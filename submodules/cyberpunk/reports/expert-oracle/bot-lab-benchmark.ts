/** Diagnostic benchmark only: oracle/public comparisons cannot promote a bot. */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { cyberpunkBotLabAdapter as adapter } from "../../../agnostic-simulator/tools/bot-lab/src/adapters/cyberpunk.ts";
import {
  buildPairedSchedule,
  canonicalJson,
  isHardBotFailure,
  mean,
  pairedBootstrapConfidenceInterval,
  stableBotHash,
  type BotCandidateManifestV1,
  type BotMatchRecordV1,
} from "../../../agnostic-simulator/packages/bot-core/src/index.ts";

const output = resolve(process.argv[3] ?? "/tmp/expert-bot-lab-2026-10-03");
const configPath = `${output}/plan.json`;
const resultPath = (index: number) => `${output}/match-${index}.json`;
type Plan = { manifest: BotCandidateManifestV1; schedule: ReturnType<typeof buildPairedSchedule> };
type Result = { record: BotMatchRecordV1; elapsedMs: number };

if (process.argv[2] === "worker") {
  const plan: Plan = JSON.parse(readFileSync(configPath, "utf8"));
  const shard = Number(process.argv[4]);
  const workers = Number(process.argv[5]);
  for (let index = shard; index < plan.schedule.matches.length; index += workers) {
    if (existsSync(resultPath(index))) continue;
    const started = performance.now();
    const record = await adapter.runMatch({
      scheduledMatch: plan.schedule.matches[index]!,
      candidateManifest: plan.manifest,
      baselineStrategyId: "tactical",
    });
    writeFileSync(
      resultPath(index),
      canonicalJson({ record, elapsedMs: performance.now() - started }),
    );
    console.log(`${index}: ${record.winner} / ${record.termination}`);
  }
} else if (process.argv[2] === "replay") {
  const plan: Plan = JSON.parse(readFileSync(configPath, "utf8"));
  const index = Number(process.argv[4]);
  const original: Result = JSON.parse(readFileSync(resultPath(index), "utf8"));
  const replay = await adapter.runMatch({
    scheduledMatch: plan.schedule.matches[index]!,
    candidateManifest: plan.manifest,
    baselineStrategyId: "tactical",
  });
  if (canonicalJson(original.record) !== canonicalJson(replay))
    throw new Error(`Replay mismatch at ${index}`);
  console.log(`Replay ${index} matches all recorded fields, including terminal state hash.`);
} else {
  mkdirSync(output, { recursive: true });
  const suiteId = "expert-practice-diagnostic-v1";
  const deckPairs = adapter.getPromotionDeckPairs(suiteId);
  const blockCount = deckPairs.length * 4;
  const manifest: BotCandidateManifestV1 = {
    schemaVersion: 1,
    game: "cyberpunk",
    candidateId: "expert-oracle",
    parentStrategyId: "tactical",
    informationPolicy: "oracle",
    hypothesis:
      "Full-information practice Expert outperforms public Sharp across the authored bot-lab matrix.",
    engineRevision: adapter.getEngineRevision(),
    cardCatalogHash: adapter.getCardCatalogHash(),
    adapterVersion: adapter.adapterVersion,
    changes: {},
    evaluation: {
      suiteId,
      seedBase: "expert-botlab-holdout-2026-10-03-v1",
      minimumBlocks: blockCount,
      maximumBlocks: blockCount,
      batchSize: blockCount,
      confidenceLevel: 0.95,
      minimumMeanImprovement: 0.02,
      maximumCellRegression: 0.05,
    },
  };
  const schedule = buildPairedSchedule({
    suiteId,
    seedBase: manifest.evaluation.seedBase,
    deckPairs,
    blocksPerPair: 4,
  });
  const plan = { manifest, schedule };
  if (
    existsSync(configPath) &&
    canonicalJson(JSON.parse(readFileSync(configPath, "utf8"))) !== canonicalJson(plan)
  )
    throw new Error("Existing plan differs; use a new output directory.");
  writeFileSync(configPath, canonicalJson(plan));
  console.log(
    JSON.stringify({
      doctor: await adapter.doctor(),
      matches: schedule.matches.length,
      blocks: blockCount,
      policies: ["oracle", "public"],
      promotionEligible: false,
    }),
  );
  const workers = Math.max(1, Math.floor(Number(process.env.EXPERT_BENCHMARK_WORKERS) || 6));
  const children = Array.from({ length: workers }, (_, shard) =>
    Bun.spawn(
      [process.execPath, import.meta.path, "worker", output, String(shard), String(workers)],
      { stdout: "inherit", stderr: "inherit" },
    ),
  );
  const codes = await Promise.all(children.map((child) => child.exited));
  if (codes.some((code) => code !== 0)) throw new Error(`Worker failure: ${codes}`);
  const results: Result[] = schedule.matches.map((_, index) =>
    JSON.parse(readFileSync(resultPath(index), "utf8")),
  );
  const records = results.map(({ record }) => record);
  const blocks = new Map<string, number[]>();
  for (const record of records) {
    const scores = blocks.get(record.blockId) ?? [];
    scores.push(
      isHardBotFailure(record.termination)
        ? -1
        : record.winner === "candidate"
          ? 1
          : record.winner === "baseline"
            ? 0
            : 0.5,
    );
    blocks.set(record.blockId, scores);
  }
  const deltas = [...blocks.values()].map((scores) => mean(scores) - 0.5);
  const interval = pairedBootstrapConfidenceInterval({
    blockDeltas: deltas,
    confidenceLevel: 0.95,
    seed: `${manifest.evaluation.seedBase}/bootstrap`,
  });
  const rawBlocks = new Map<string, number[]>();
  for (const record of records) {
    const scores = rawBlocks.get(record.blockId) ?? [];
    scores.push(record.winner === "candidate" ? 1 : record.winner === "baseline" ? 0 : 0.5);
    rawBlocks.set(record.blockId, scores);
  }
  const rawDeltas = [...rawBlocks.values()].map((scores) => mean(scores) - 0.5);
  const rawInterval = pairedBootstrapConfidenceInterval({
    blockDeltas: rawDeltas,
    confidenceLevel: 0.95,
    seed: `${manifest.evaluation.seedBase}/bootstrap`,
  });
  const counts = (rows: BotMatchRecordV1[]) => ({
    games: rows.length,
    wins: rows.filter((r) => r.winner === "candidate").length,
    losses: rows.filter((r) => r.winner === "baseline").length,
    draws: rows.filter((r) => r.winner === null).length,
    failures: rows.filter((r) => isHardBotFailure(r.termination)).length,
  });
  const failures = records.filter((r) => isHardBotFailure(r.termination));
  const report = {
    reportKind: "practice-diagnostic",
    promotionEligible: false,
    manifest,
    manifestHash: stableBotHash(manifest),
    scheduleHash: schedule.hash,
    candidate: adapter.getStrategyDescriptor("expert-oracle"),
    baseline: adapter.getStrategyDescriptor("tactical"),
    summary: {
      ...counts(records),
      blocks: blocks.size,
      meanPairedImprovement: mean(deltas),
      confidenceInterval: interval,
      rawPairedImprovement: mean(rawDeltas),
      rawConfidenceInterval: rawInterval,
      betterSupported:
        mean(deltas) >= manifest.evaluation.minimumMeanImprovement &&
        interval.lower > 0 &&
        failures.length === 0,
      terminations: Object.fromEntries(
        [...new Set(records.map((r) => r.termination))].map((reason) => [
          reason,
          records.filter((r) => r.termination === reason).length,
        ]),
      ),
      seats: Object.fromEntries(
        ["p1", "p2"].map((seat) => [seat, counts(records.filter((r) => r.candidateSeat === seat))]),
      ),
      cells: Object.fromEntries(
        adapter
          .getPromotionDeckPairs(manifest.evaluation.suiteId)
          .map((pair) => [
            pair.id,
            counts(records.filter((r) => r.blockId.startsWith(`${pair.id}/`))),
          ]),
      ),
      wallMsPerMatch: {
        mean: mean(results.map((r) => r.elapsedMs)),
        max: Math.max(...results.map((r) => r.elapsedMs)),
      },
    },
    matches: records,
  };
  writeFileSync(`${output}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report.summary, null, 2));
}
