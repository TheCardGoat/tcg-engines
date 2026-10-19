import "../unpack-evaluation-data.ts";
import { readFileSync, writeFileSync } from "node:fs";
import { canonicalJson } from "@tcg/bot-core";
import { botEvaluationReportV1Schema } from "@tcg/bot-core/schemas";
import { alphaClashBotLabAdapter } from "../../../../src/adapters/alpha-clash.ts";

const file = (name: string) => new URL(name, import.meta.url);
const report = botEvaluationReportV1Schema.parse(
  JSON.parse(readFileSync(file("report.json"), "utf8")),
);
if (
  report.engineRevision !== alphaClashBotLabAdapter.getEngineRevision() ||
  report.cardCatalogHash !== alphaClashBotLabAdapter.getCardCatalogHash()
)
  throw new Error("Source or catalog drift; replay requires the recorded revision.");
const selected = new Map<string, (typeof report.matches)[number]>();
const add = (record: (typeof report.matches)[number]) =>
  selected.set(`${record.blockId}/${record.legId}`, record);
for (const deckId of new Set(report.matches.map((match) => match.candidateDeckId))) {
  const mirror = report.matches.find(
    (match) => match.candidateDeckId === deckId && match.baselineDeckId === deckId,
  );
  if (!mirror) throw new Error(`Missing mirror for ${deckId}`);
  add(mirror);
}
const ordered = [...report.matches].sort((left, right) => left.actionCount - right.actionCount);
add(ordered[0]!);
add(ordered[ordered.length - 1]!);
for (const match of report.matches)
  if (match.termination !== "rules-win" && match.termination !== "deck-out") add(match);
const checks = [];
for (const [matchId, original] of selected) {
  const replayed = await alphaClashBotLabAdapter.replayMatch(original, report);
  const exact = canonicalJson(original) === canonicalJson(replayed);
  checks.push({ matchId, exact, original, replayed });
  writeFileSync(
    file("replay-checks.json"),
    JSON.stringify(
      {
        scope:
          "One mirror per deck, shortest and longest games, and all abnormal terminations; exact match-record comparisons, not every frame or every suite game.",
        checks,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`${checks.length}/${selected.size} ${matchId}: ${exact ? "exact" : "MISMATCH"}`);
  if (!exact) throw new Error(`Replay mismatch: ${matchId}`);
}
