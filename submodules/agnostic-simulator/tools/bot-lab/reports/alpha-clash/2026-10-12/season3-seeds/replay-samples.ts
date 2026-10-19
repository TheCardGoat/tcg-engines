import "../unpack-evaluation-data.ts";
import { readFileSync, writeFileSync } from "node:fs";
import { canonicalJson } from "@tcg/bot-core";
import { botEvaluationReportV1Schema } from "@tcg/bot-core/schemas";
import { alphaClashBotLabAdapter as adapter } from "../../../../src/adapters/alpha-clash.ts";

const file = (name: string) => new URL(name, import.meta.url);
const report = botEvaluationReportV1Schema.parse(
  JSON.parse(readFileSync(file("report.json"), "utf8")),
);
if (
  report.engineRevision !== adapter.getEngineRevision() ||
  report.cardCatalogHash !== adapter.getCardCatalogHash()
)
  throw new Error("Recorded source revision is required for replay");
const selected = new Map<string, (typeof report.matches)[number]>();
const add = (record: (typeof report.matches)[number]) =>
  selected.set(`${record.blockId}/${record.legId}`, record);
for (const deckId of new Set(report.matches.map((match) => match.candidateDeckId))) {
  const mirror = report.matches.find(
    (match) =>
      match.blockId.endsWith("/block-9") &&
      match.candidateDeckId === deckId &&
      match.baselineDeckId === deckId,
  );
  if (!mirror) throw new Error(`Missing final-block mirror: ${deckId}`);
  add(mirror);
}
const newMatches = report.matches.filter((match) => !match.blockId.endsWith("/block-0"));
const ordered = [...newMatches].sort((left, right) => left.actionCount - right.actionCount);
add(ordered[0]!);
add(ordered[ordered.length - 1]!);
for (const match of newMatches)
  if (match.termination !== "rules-win" && match.termination !== "deck-out") add(match);
const checks = [];
for (const [matchId, original] of selected) {
  const replayed = await adapter.replayMatch(original, report);
  const exact = canonicalJson(original) === canonicalJson(replayed);
  checks.push({ matchId, exact, original, replayed });
  writeFileSync(
    file("replay-checks.json"),
    JSON.stringify(
      {
        scope:
          "One final-block mirror per deck, shortest and longest new games, and all abnormal new terminations. Exact match-record comparisons; not every game or frame.",
        checks,
      },
      null,
      2,
    ) + "\n",
  );
  console.log(`${checks.length}/${selected.size} ${matchId}: ${exact ? "exact" : "MISMATCH"}`);
  if (!exact) throw new Error(`Replay mismatch: ${matchId}`);
}
