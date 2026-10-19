import "../unpack-evaluation-data.ts";
import {
  readFileSync,
  writeFileSync,
  existsSync,
  copyFileSync,
  openSync,
  closeSync,
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
import { evaluateCandidate } from "../../../../src/evaluate.ts";

const file = (name: string) => new URL(name, import.meta.url);
const manifest = botCandidateManifestV1Schema.parse(
  JSON.parse(readFileSync(file("manifest.json"), "utf8")),
);
if (
  manifest.engineRevision !== adapter.getEngineRevision() ||
  manifest.cardCatalogHash !== adapter.getCardCatalogHash()
)
  throw new Error("Coordinator source or catalog drift");
const pairs = adapter.getPromotionDeckPairs("season3");
const schedule = buildPairedSchedule({
  suiteId: "season3",
  seedBase: manifest.evaluation.seedBase,
  deckPairs: pairs,
  blocksPerPair: 10,
});
if (schedule.matches.length !== 1280 || pairs.length !== 36)
  throw new Error("Unexpected suite size");
const old = botEvaluationReportV1Schema.parse(
  JSON.parse(readFileSync(file("../season3-suite/report.json"), "utf8")),
);
const reused =
  old.engineRevision === manifest.engineRevision &&
  old.cardCatalogHash === manifest.cardCatalogHash &&
  old.manifest.candidateId === manifest.candidateId &&
  old.baseline.id === manifest.parentStrategyId &&
  canonicalJson(old.manifest.changes) === canonicalJson(manifest.changes)
    ? old.matches
    : [];
const cached = new Map(reused.map((match) => [`${match.blockId}/${match.legId}`, match]));
const tasks = schedule.matches.filter((match) => {
  const prior = cached.get(`${match.blockId}/${match.legId}`);
  if (prior && prior.seed !== match.seed) throw new Error("Cached seed mismatch");
  return !prior;
});
const workers = 4;
writeFileSync(file("schedule.json"), JSON.stringify(schedule, null, 2) + "\n");
writeFileSync(file("reused-matches.json"), JSON.stringify(reused, null, 2) + "\n");
copyFileSync(file("../season3-suite/decks.json"), file("decks.json"));
writeFileSync(file("doctor.json"), JSON.stringify(await adapter.doctor(), null, 2) + "\n");
const started = Date.now();
console.log(
  `${schedule.matches.length} scheduled; ${reused.length} same-revision records reused; ${tasks.length} new games; ${workers} native workers`,
);
const jobs = Array.from({ length: workers }, (_, index) => {
  const chunk = tasks.filter((_, position) => position % workers === index);
  writeFileSync(file(`tasks-${index}.json`), JSON.stringify(chunk, null, 2) + "\n");
  return new Promise<void>((resolve, reject) => {
    const fd = openSync(file(`worker-${index}.log`), "a");
    const child = spawn(process.execPath, [fileURLToPath(file("worker.ts")), String(index)], {
      stdio: ["ignore", fd, fd],
    });
    closeSync(fd);
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`Worker ${index} exited ${code}`)),
    );
  });
});
const outcomes = await Promise.allSettled(jobs);
if (outcomes.some((outcome) => outcome.status === "rejected"))
  throw new Error(JSON.stringify(outcomes));
for (let index = 0; index < workers; index++) {
  const journal = file(`matches-${index}.jsonl`);
  if (!existsSync(journal)) continue;
  for (const line of readFileSync(journal, "utf8").split("\n").filter(Boolean)) {
    const record = botMatchRecordV1Schema.parse(JSON.parse(line));
    const key = `${record.blockId}/${record.legId}`;
    if (cached.has(key)) throw new Error(`Duplicate ${key}`);
    cached.set(key, record);
  }
}
const report = await evaluateCandidate({
  manifest,
  adapter: {
    ...adapter,
    runMatch: ({ scheduledMatch }) => {
      const record = cached.get(`${scheduledMatch.blockId}/${scheduledMatch.legId}`);
      if (!record || record.seed !== scheduledMatch.seed)
        throw new Error("Missing or wrong-seed native match record");
      return record;
    },
  },
});
botEvaluationReportV1Schema.parse(report);
if (report.matches.length !== 1280 || report.scheduleHash !== schedule.hash)
  throw new Error("Incomplete schedule");
writeFileSync(file("report.json"), JSON.stringify(report, null, 2) + "\n");
writeFileSync(
  file("matches.jsonl"),
  report.matches.map((match) => canonicalJson(match)).join("\n") + "\n",
);
writeFileSync(
  file("run-metadata.json"),
  JSON.stringify(
    {
      verifiedOn: "2026-10-12",
      durationSeconds: (Date.now() - started) / 1000,
      blocksPerPair: 10,
      scheduledMatches: 1280,
      reusedMatches: reused.length,
      newlyExecutedMatches: tasks.length,
      nativeWorkers: workers,
      scheduleHashMatches: true,
      scope:
        "Exact main decks, meta-v1 self-play, local native commands. No sideboarding or hosted-flow proof.",
    },
    null,
    2,
  ) + "\n",
);
console.log(JSON.stringify(report.summary, null, 2));
