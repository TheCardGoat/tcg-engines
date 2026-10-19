import "../unpack-evaluation-data.ts";
import { readFileSync, writeFileSync } from "node:fs";
import { canonicalJson } from "@tcg/bot-core";
import { alphaClashBotLabAdapter as adapter } from "../../../../src/adapters/alpha-clash.ts";
import { botEvaluationReportV1Schema } from "@tcg/bot-core/schemas";
const file = (name: string) => new URL(name, import.meta.url);
const report = botEvaluationReportV1Schema.parse(
  JSON.parse(readFileSync(file("report.json"), "utf8")),
);
if (
  adapter.getEngineRevision() !== report.engineRevision ||
  adapter.getCardCatalogHash() !== report.cardCatalogHash
)
  throw Error("Replay source drift");
const index = Number(process.argv[2]);
const selected: string[] = JSON.parse(readFileSync(file(`replay-tasks-${index}.json`), "utf8"));
const checks = [];
for (const key of selected) {
  const record = report.matches.find((m) => `${m.blockId}/${m.legId}` === key)!;
  const replay = await adapter.replayMatch(record, report);
  const matches = canonicalJson(record) === canonicalJson(replay);
  checks.push({
    key,
    matches,
    expectedHash: record.finalStateHash,
    actualHash: replay.finalStateHash,
  });
  if (!matches) throw Error(`Replay mismatch: ${key}`);
}
writeFileSync(file(`replay-checks-${index}.json`), JSON.stringify(checks, null, 2) + "\n");
