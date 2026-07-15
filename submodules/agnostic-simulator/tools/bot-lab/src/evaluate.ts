import {
  BOT_CORE_SCHEMA_VERSION,
  buildPairedSchedule,
  classifyPromotion,
  isHardBotFailure,
  mean,
  pairedBootstrapConfidenceInterval,
  stableBotHash,
  type BotCandidateManifestV1,
  type BotEvaluationReportV1,
  type BotMatchRecordV1,
  type BotTerminationReason,
} from "@tcg/bot-core";

import type { BotLabAdapter } from "./adapter.ts";

const TERMINATIONS: readonly BotTerminationReason[] = [
  "rules-win",
  "deck-out",
  "player-concession",
  "automation-concession",
  "repeated-state",
  "unsupported-prompt",
  "illegal-command",
  "max-actions",
  "replay-mismatch",
  "infrastructure-error",
];

function scoreCandidate(match: BotMatchRecordV1): number {
  if (isHardBotFailure(match.termination)) return -1;
  if (match.winner === "candidate") return 1;
  if (match.winner === "baseline") return 0;
  return 0.5;
}

function aggregateBlockDeltas(matches: readonly BotMatchRecordV1[]): Map<string, number> {
  const scores = new Map<string, number[]>();
  for (const match of matches) {
    const existing = scores.get(match.blockId) ?? [];
    existing.push(scoreCandidate(match));
    scores.set(match.blockId, existing);
  }
  return new Map([...scores].map(([blockId, values]) => [blockId, mean(values) - 0.5]));
}

function cellRegressions(blockDeltas: ReadonlyMap<string, number>): Record<string, number> {
  const cells = new Map<string, number[]>();
  for (const [blockId, delta] of blockDeltas) {
    const separator = blockId.lastIndexOf("/block-");
    const cell = separator === -1 ? blockId : blockId.slice(0, separator);
    const values = cells.get(cell) ?? [];
    values.push(delta);
    cells.set(cell, values);
  }
  return Object.fromEntries([...cells].map(([cell, values]) => [cell, mean(values)]));
}

export async function evaluateCandidate(input: {
  readonly adapter: BotLabAdapter;
  readonly manifest: BotCandidateManifestV1;
  readonly baselineStrategyId?: string;
}): Promise<BotEvaluationReportV1> {
  const { adapter, manifest } = input;
  if (manifest.game !== adapter.game)
    throw new Error(`Manifest game ${manifest.game} does not match ${adapter.game}`);
  if (manifest.adapterVersion !== adapter.adapterVersion)
    throw new Error("Adapter version drift detected");
  if (manifest.engineRevision !== adapter.getEngineRevision())
    throw new Error("Engine revision drift detected");
  if (manifest.cardCatalogHash !== adapter.getCardCatalogHash())
    throw new Error("Card catalog drift detected");

  const baselineId = input.baselineStrategyId ?? manifest.parentStrategyId;
  const baseline = adapter.getStrategyDescriptor(baselineId);
  if (!baseline) throw new Error(`Unknown baseline strategy: ${baselineId}`);
  const candidate = adapter.getCandidateDescriptor(manifest);
  if (baseline.informationPolicy !== candidate.informationPolicy) {
    throw new Error("Promotion comparisons require matching information policies");
  }

  const deckPairs = adapter.getPromotionDeckPairs(manifest.evaluation.suiteId);
  const matches: BotMatchRecordV1[] = [];
  let blocksPerPair = 0;
  let scheduleHash = "";
  let gate: ReturnType<typeof classifyPromotion> = {
    verdict: "inconclusive",
    reasons: ["evaluation not started"],
  };
  let confidenceInterval = { level: manifest.evaluation.confidenceLevel, lower: 0, upper: 0 };
  let deltas = new Map<string, number>();

  while (blocksPerPair * deckPairs.length < manifest.evaluation.maximumBlocks) {
    const currentBlocks = blocksPerPair * deckPairs.length;
    const targetBlocks = Math.min(
      manifest.evaluation.maximumBlocks,
      currentBlocks + manifest.evaluation.batchSize,
    );
    const nextBlocks = Math.max(blocksPerPair + 1, Math.ceil(targetBlocks / deckPairs.length));
    const schedule = buildPairedSchedule({
      suiteId: manifest.evaluation.suiteId,
      seedBase: manifest.evaluation.seedBase,
      deckPairs,
      blocksPerPair: nextBlocks,
    });
    scheduleHash = schedule.hash;
    const completed = new Set(matches.map((match) => `${match.blockId}/${match.legId}`));
    for (const scheduledMatch of schedule.matches) {
      if (completed.has(`${scheduledMatch.blockId}/${scheduledMatch.legId}`)) continue;
      matches.push(
        await adapter.runMatch({
          scheduledMatch,
          candidateManifest: manifest,
          baselineStrategyId: baselineId,
        }),
      );
    }
    blocksPerPair = nextBlocks;
    deltas = aggregateBlockDeltas(matches);
    const blockValues = [...deltas.values()];
    confidenceInterval = pairedBootstrapConfidenceInterval({
      blockDeltas: blockValues,
      confidenceLevel: manifest.evaluation.confidenceLevel,
      seed: `${manifest.evaluation.seedBase}/bootstrap`,
    });
    gate = classifyPromotion({
      spec: manifest.evaluation,
      blocks: blockValues.length,
      meanPairedImprovement: mean(blockValues),
      confidenceInterval,
      hardFailureCount: matches.filter((match) => isHardBotFailure(match.termination)).length,
      cellRegressions: cellRegressions(deltas),
    });
    if (gate.verdict !== "inconclusive") break;
  }

  const terminationCounts = Object.fromEntries(TERMINATIONS.map((reason) => [reason, 0])) as Record<
    BotTerminationReason,
    number
  >;
  for (const match of matches) terminationCounts[match.termination]++;
  const blockValues = [...deltas.values()];
  return {
    schemaVersion: BOT_CORE_SCHEMA_VERSION,
    manifest,
    manifestHash: stableBotHash(manifest),
    scheduleHash,
    candidate,
    baseline,
    engineRevision: manifest.engineRevision,
    cardCatalogHash: manifest.cardCatalogHash,
    matches,
    summary: {
      blocks: blockValues.length,
      matches: matches.length,
      meanPairedImprovement: mean(blockValues),
      confidenceInterval,
      terminationCounts,
      hardFailureCount: matches.filter((match) => isHardBotFailure(match.termination)).length,
      cellRegressions: cellRegressions(deltas),
    },
    verdict: gate.verdict,
    verdictReasons: gate.reasons,
  };
}
