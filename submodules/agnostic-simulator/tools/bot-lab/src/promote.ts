import {
  BOT_CORE_SCHEMA_VERSION,
  BOT_PRODUCTION_MINIMUM_BLOCKS,
  botEvaluationReportV1Schema,
  buildPairedSchedule,
  classifyPromotion,
  isHardBotFailure,
  mean,
  pairedBootstrapConfidenceInterval,
  stableBotHash,
  type BotEvaluationReportV1,
  type BotMatchRecordV1,
  type BotPromotionRecordV1,
} from "@tcg/bot-core";

import type { BotLabAdapter, BotLabPromotionWrite } from "./adapter.ts";

function candidateScore(match: BotMatchRecordV1): number {
  if (isHardBotFailure(match.termination)) return -1;
  if (match.winner === "candidate") return 1;
  if (match.winner === "baseline") return 0;
  return 0.5;
}

function recomputeReport(input: {
  readonly adapter: BotLabAdapter;
  readonly report: BotEvaluationReportV1;
}): void {
  const { adapter, report } = input;
  if (report.manifestHash !== stableBotHash(report.manifest)) {
    throw new Error("Candidate manifest hash mismatch");
  }
  if (report.candidate.id !== report.manifest.candidateId) {
    throw new Error("Candidate descriptor does not match manifest");
  }
  if (
    report.candidate.informationPolicy !== report.manifest.informationPolicy ||
    report.candidate.informationPolicy !== report.baseline.informationPolicy
  ) {
    throw new Error("Promotion information policies do not match");
  }
  if (!report.candidate.productionEligible) {
    throw new Error("Test-only strategies cannot be promoted");
  }
  if (report.summary.matches !== report.matches.length) {
    throw new Error("Evaluation match count mismatch");
  }

  const pairs = adapter.getPromotionDeckPairs(report.manifest.evaluation.suiteId);
  const blocksPerPair = report.summary.blocks / pairs.length;
  if (!Number.isInteger(blocksPerPair) || blocksPerPair < 1) {
    throw new Error("Evaluation block count does not match the promotion deck matrix");
  }
  const schedule = buildPairedSchedule({
    suiteId: report.manifest.evaluation.suiteId,
    seedBase: report.manifest.evaluation.seedBase,
    deckPairs: pairs,
    blocksPerPair,
  });
  if (schedule.hash !== report.scheduleHash) throw new Error("Evaluation schedule hash mismatch");
  if (schedule.matches.length !== report.matches.length) {
    throw new Error("Evaluation schedule is incomplete");
  }

  const expected = new Map(
    schedule.matches.map((match) => [`${match.blockId}/${match.legId}`, match]),
  );
  const seen = new Set<string>();
  for (const match of report.matches) {
    const key = `${match.blockId}/${match.legId}`;
    const scheduled = expected.get(key);
    if (!scheduled || seen.has(key)) throw new Error(`Unexpected evaluation match: ${key}`);
    seen.add(key);
    const candidateSeat = scheduled.p1Controller === "candidate" ? "p1" : "p2";
    const candidateDeckId = candidateSeat === "p1" ? scheduled.p1DeckId : scheduled.p2DeckId;
    const baselineDeckId = candidateSeat === "p1" ? scheduled.p2DeckId : scheduled.p1DeckId;
    if (
      match.seed !== scheduled.seed ||
      match.candidateSeat !== candidateSeat ||
      match.candidateDeckId !== candidateDeckId ||
      match.baselineDeckId !== baselineDeckId
    ) {
      throw new Error(`Evaluation match does not match schedule: ${key}`);
    }
  }

  const scores = new Map<string, number[]>();
  const terminationCounts: Record<string, number> = {};
  let hardFailureCount = 0;
  for (const match of report.matches) {
    const values = scores.get(match.blockId) ?? [];
    values.push(candidateScore(match));
    scores.set(match.blockId, values);
    terminationCounts[match.termination] = (terminationCounts[match.termination] ?? 0) + 1;
    if (isHardBotFailure(match.termination)) hardFailureCount++;
  }
  const blockDeltas = new Map(
    [...scores].map(([blockId, values]) => [blockId, mean(values) - 0.5]),
  );
  const cells = new Map<string, number[]>();
  for (const [blockId, delta] of blockDeltas) {
    const separator = blockId.lastIndexOf("/block-");
    const cell = separator === -1 ? blockId : blockId.slice(0, separator);
    const values = cells.get(cell) ?? [];
    values.push(delta);
    cells.set(cell, values);
  }
  const cellRegressions = Object.fromEntries(
    [...cells].map(([cell, values]) => [cell, mean(values)]),
  );
  const values = [...blockDeltas.values()];
  const confidenceInterval = pairedBootstrapConfidenceInterval({
    blockDeltas: values,
    confidenceLevel: report.manifest.evaluation.confidenceLevel,
    seed: `${report.manifest.evaluation.seedBase}/bootstrap`,
  });
  const gate = classifyPromotion({
    spec: report.manifest.evaluation,
    blocks: values.length,
    meanPairedImprovement: mean(values),
    confidenceInterval,
    hardFailureCount,
    cellRegressions,
  });
  for (const [reason, count] of Object.entries(report.summary.terminationCounts)) {
    if ((terminationCounts[reason] ?? 0) !== count) {
      throw new Error("Evaluation termination counts are inconsistent");
    }
  }
  if (
    report.summary.blocks !== values.length ||
    report.summary.hardFailureCount !== hardFailureCount ||
    report.summary.meanPairedImprovement !== mean(values) ||
    stableBotHash(report.summary.confidenceInterval) !== stableBotHash(confidenceInterval) ||
    stableBotHash(report.summary.cellRegressions) !== stableBotHash(cellRegressions) ||
    report.verdict !== gate.verdict ||
    stableBotHash(report.verdictReasons) !== stableBotHash(gate.reasons)
  ) {
    throw new Error("Evaluation summary is inconsistent with its match records");
  }
}

export function planPromotion(input: {
  readonly adapter: BotLabAdapter;
  readonly report: BotEvaluationReportV1;
}): { readonly record: BotPromotionRecordV1; readonly writes: readonly BotLabPromotionWrite[] } {
  const report = botEvaluationReportV1Schema.parse(input.report);
  recomputeReport({ adapter: input.adapter, report });
  if (report.verdict !== "promote")
    throw new Error(`Cannot promote report with verdict ${report.verdict}`);
  if (
    report.summary.blocks < BOT_PRODUCTION_MINIMUM_BLOCKS ||
    report.manifest.evaluation.minimumBlocks < BOT_PRODUCTION_MINIMUM_BLOCKS
  ) {
    throw new Error(
      `Production promotion requires at least ${BOT_PRODUCTION_MINIMUM_BLOCKS} paired blocks`,
    );
  }
  if (report.candidate.game !== input.adapter.game)
    throw new Error("Report game does not match adapter");
  if (report.engineRevision !== input.adapter.getEngineRevision())
    throw new Error("Engine revision drift detected");
  if (report.cardCatalogHash !== input.adapter.getCardCatalogHash())
    throw new Error("Card catalog drift detected");

  const record: BotPromotionRecordV1 = {
    schemaVersion: BOT_CORE_SCHEMA_VERSION,
    game: input.adapter.game,
    promotedStrategyId: report.candidate.id,
    previousStrategyId: report.baseline.id,
    informationPolicy: report.candidate.informationPolicy,
    manifestHash: report.manifestHash,
    scheduleHash: report.scheduleHash,
    engineRevision: report.engineRevision,
    cardCatalogHash: report.cardCatalogHash,
    strategyConfig: report.manifest.changes,
    blocks: report.summary.blocks,
    matches: report.summary.matches,
    meanPairedImprovement: report.summary.meanPairedImprovement,
    confidenceInterval: report.summary.confidenceInterval,
  };
  return { record, writes: input.adapter.planPromotion(record) };
}
