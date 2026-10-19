import "../unpack-evaluation-data.ts";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { canonicalJson, buildPairedSchedule } from "@tcg/bot-core";
import { botCandidateManifestV1Schema, botEvaluationReportV1Schema } from "@tcg/bot-core/schemas";
import { alphaClashBotLabAdapter } from "../../../../src/adapters/alpha-clash.ts";
import { evaluateCandidate } from "../../../../src/evaluate.ts";

const file = (name: string) => new URL(name, import.meta.url);
const manifest = botCandidateManifestV1Schema.parse(
  JSON.parse(readFileSync(file("manifest.json"), "utf8")),
);
const pairs = alphaClashBotLabAdapter.getPromotionDeckPairs("season3");
const schedule = buildPairedSchedule({
  suiteId: "season3",
  seedBase: manifest.evaluation.seedBase,
  deckPairs: pairs,
  blocksPerPair: 1,
});
if (
  new Set(pairs.flatMap((pair) => [pair.deckA, pair.deckB])).size !== 8 ||
  schedule.matches.length !== 128
)
  throw new Error("Expected eight decks and a complete 128-game paired sweep.");
writeFileSync(
  file("doctor.json"),
  JSON.stringify(await alphaClashBotLabAdapter.doctor(), null, 2) + "\n",
);
writeFileSync(file("matches.jsonl"), "");
let completed = 0;
const started = Date.now();
const report = await evaluateCandidate({
  manifest,
  adapter: {
    ...alphaClashBotLabAdapter,
    runMatch: async (input) => {
      const record = await alphaClashBotLabAdapter.runMatch(input);
      appendFileSync(file("matches.jsonl"), canonicalJson(record) + "\n");
      completed++;
      if (completed % 8 === 0 || record.termination !== "rules-win")
        console.log(
          `${completed}/128 ${record.blockId}/${record.legId}: ${record.termination}, ${record.actionCount} actions, ${Math.round((Date.now() - started) / 1000)}s elapsed`,
        );
      return record;
    },
  },
});
botEvaluationReportV1Schema.parse(report);
writeFileSync(file("report.json"), JSON.stringify(report, null, 2) + "\n");
writeFileSync(
  file("run-metadata.json"),
  JSON.stringify(
    {
      verifiedOn: "2026-10-12",
      durationSeconds: (Date.now() - started) / 1000,
      expectedMatches: schedule.matches.length,
      scheduleHashMatches: report.scheduleHash === schedule.hash,
      scope:
        "Local native engine; exact imported main decks; no sideboarding, hosted flow, or deployment verification.",
    },
    null,
    2,
  ) + "\n",
);
console.log(JSON.stringify(report.summary, null, 2));
console.log(`${report.verdict}: ${report.verdictReasons.join("; ")}`);
