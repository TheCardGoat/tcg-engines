import "../unpack-evaluation-data.ts";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  openSync,
  closeSync,
  readdirSync,
  statSync,
} from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { canonicalJson, buildPairedSchedule } from "@tcg/bot-core";
import {
  botCandidateManifestV1Schema,
  botEvaluationReportV1Schema,
  botMatchRecordV1Schema,
} from "@tcg/bot-core/schemas";
import { alphaClashBotLabAdapter as adapter } from "../../../../src/adapters/alpha-clash.ts";
import {
  ALPHA_CLASH_META_DECKS,
  resolveAlphaClashLabDeck,
} from "../../../../../../packages/alpha-clash/alpha-clash-server-adapter/src/practice-decks.ts";
import { evaluateCandidate } from "../../../../src/evaluate.ts";

const file = (name: string) => new URL(name, import.meta.url);
const blocksPerPair = 3;
const pairs = adapter.getPromotionDeckPairs("season3");
const manifestPath = file("manifest.json");
const plan = {
  candidateId: "expert-oracle",
  parentStrategyId: "meta-v1",
  informationPolicy: "oracle",
  hypothesis:
    "Native full-information turn search improves on the unchanged meta-v1 action-priority policy across all eight Season 3 decks.",
  changes: {},
  evaluation: {
    suiteId: "season3",
    seedBase: "alpha-clash-expert-v1-season3-holdout",
    minimumBlocks: 108,
    maximumBlocks: 108,
    batchSize: 108,
    confidenceLevel: 0.95,
    minimumMeanImprovement: 0.05,
    maximumCellRegression: 0.25,
  },
};
const manifest = botCandidateManifestV1Schema.parse(
  existsSync(manifestPath)
    ? JSON.parse(readFileSync(manifestPath, "utf8"))
    : await adapter.train?.(plan),
);
if (
  manifest.engineRevision !== adapter.getEngineRevision() ||
  manifest.cardCatalogHash !== adapter.getCardCatalogHash() ||
  manifest.adapterVersion !== adapter.adapterVersion
)
  throw Error(
    "Source/catalog/adapter drift; preserve this run and use a new directory for changed code",
  );
writeFileSync(file("plan.json"), JSON.stringify(plan, null, 2) + "\n");
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
const schedule = buildPairedSchedule({
  suiteId: "season3",
  seedBase: manifest.evaluation.seedBase,
  deckPairs: pairs,
  blocksPerPair,
});
if (pairs.length !== 36 || schedule.matches.length !== 384)
  throw Error("Incomplete Season 3 schedule");
writeFileSync(file("schedule.json"), JSON.stringify(schedule, null, 2) + "\n");
writeFileSync(
  file("decks.json"),
  JSON.stringify(
    ALPHA_CLASH_META_DECKS.filter((deck) => pairs.some((pair) => pair.deckA === deck.id)).map(
      (deck) => ({ ...deck, resolved: resolveAlphaClashLabDeck(deck.id) }),
    ),
    null,
    2,
  ) + "\n",
);
writeFileSync(file("doctor.json"), JSON.stringify(await adapter.doctor(), null, 2) + "\n");
const started = statSync(manifestPath).birthtimeMs,
  workers = 12;
const completedKeys = new Set<string>();
for (const name of readdirSync(file(".")).filter((name) => /^matches-\d+\.jsonl$/.test(name))) {
  for (const line of readFileSync(file(name), "utf8").split("\n").filter(Boolean)) {
    const record = botMatchRecordV1Schema.parse(JSON.parse(line));
    completedKeys.add(`${record.blockId}/${record.legId}`);
  }
}
const remaining = schedule.matches.filter(
  (match) => !completedKeys.has(`${match.blockId}/${match.legId}`),
);
console.log(
  `${schedule.matches.length} native games; ${completedKeys.size} completed in this frozen run; ${remaining.length} remaining; ${workers} workers`,
);
const jobs = Array.from({ length: workers }, (_, index) => {
  writeFileSync(
    file(`tasks-${index}.json`),
    JSON.stringify(
      remaining.filter((_, n) => n % workers === index),
      null,
      2,
    ) + "\n",
  );
  return new Promise<void>((resolve, reject) => {
    const fd = openSync(file(`worker-${index}.log`), "a");
    const child = spawn(process.execPath, [fileURLToPath(file("worker.ts")), String(index)], {
      stdio: ["ignore", fd, fd],
    });
    closeSync(fd);
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(Error(`Worker ${index} exited ${code}`)),
    );
  });
});
const outcomes = await Promise.allSettled(jobs);
if (outcomes.some((outcome) => outcome.status === "rejected"))
  throw Error(JSON.stringify(outcomes));
const records = new Map();
for (let index = 0; index < workers; index++) {
  for (const line of readFileSync(file(`matches-${index}.jsonl`), "utf8")
    .split("\n")
    .filter(Boolean)) {
    const record = botMatchRecordV1Schema.parse(JSON.parse(line));
    const key = `${record.blockId}/${record.legId}`;
    if (records.has(key)) throw Error(`Duplicate ${key}`);
    records.set(key, record);
  }
}
const report = await evaluateCandidate({
  manifest,
  adapter: {
    ...adapter,
    runMatch: ({ scheduledMatch }) => {
      const record = records.get(`${scheduledMatch.blockId}/${scheduledMatch.legId}`);
      if (!record || record.seed !== scheduledMatch.seed)
        throw Error("Missing native match record");
      return record;
    },
  },
});
botEvaluationReportV1Schema.parse(report);
if (report.matches.length !== 384 || report.scheduleHash !== schedule.hash)
  throw Error("Incomplete report");
writeFileSync(file("report.json"), JSON.stringify(report, null, 2) + "\n");
writeFileSync(file("matches.jsonl"), report.matches.map(canonicalJson).join("\n") + "\n");
writeFileSync(
  file("run-metadata.json"),
  JSON.stringify(
    {
      verifiedOn: "2026-10-12",
      durationSeconds: (Date.now() - started) / 1000,
      blocksPerPair,
      workers,
      scheduledMatches: 384,
      reusedHistoricalMatches: 0,
      search: { maxNodes: 768, beamWidth: 5, depthLimit: 12, replyLines: 4 },
      shufflePolicy:
        "Adapter v4 removes the terminal -seat-1/-seat-2 suffix for native shuffling. Each seat pair keeps physical deck assignment and shuffle fixed while swapping policies.",
      scope:
        "Native engine games, exact main decks, full private information for both policies, no sideboarding, construction validation disabled. No hosted or browser proof.",
    },
    null,
    2,
  ) + "\n",
);
console.log(JSON.stringify({ summary: report.summary, verdict: report.verdict }, null, 2));
