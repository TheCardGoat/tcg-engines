import "../unpack-evaluation-data.ts";
import { appendFileSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { canonicalJson } from "@tcg/bot-core";
import { botCandidateManifestV1Schema } from "@tcg/bot-core/schemas";
import { alphaClashBotLabAdapter as adapter } from "../../../../src/adapters/alpha-clash.ts";

const file = (name: string) => new URL(name, import.meta.url);
const index = Number(process.argv[2]);
const tasks = JSON.parse(readFileSync(file(`tasks-${index}.json`), "utf8"));
const manifest = botCandidateManifestV1Schema.parse(
  JSON.parse(readFileSync(file("manifest.json"), "utf8")),
);
if (
  adapter.getEngineRevision() !== manifest.engineRevision ||
  adapter.getCardCatalogHash() !== manifest.cardCatalogHash
)
  throw new Error("Worker source or catalog drift");
writeFileSync(
  file(`worker-${index}-metadata.json`),
  JSON.stringify(
    {
      engineRevision: adapter.getEngineRevision(),
      cardCatalogHash: adapter.getCardCatalogHash(),
      tasks: tasks.length,
    },
    null,
    2,
  ),
);
const journal = file(`matches-${index}.jsonl`);
const done = new Set(
  existsSync(journal)
    ? readFileSync(journal, "utf8")
        .trim()
        .split("\n")
        .filter(Boolean)
        .map((line) => {
          const m = JSON.parse(line);
          return `${m.blockId}/${m.legId}`;
        })
    : [],
);
let completed = done.size;
const started = Date.now();
for (const scheduledMatch of tasks) {
  const matchId = `${scheduledMatch.blockId}/${scheduledMatch.legId}`;
  if (done.has(matchId)) continue;
  try {
    const record = await adapter.runMatch({
      scheduledMatch,
      candidateManifest: manifest,
      baselineStrategyId: manifest.parentStrategyId,
    });
    appendFileSync(journal, canonicalJson(record) + "\n");
    completed++;
    if (completed % 16 === 0 || record.termination !== "rules-win")
      console.log(
        `${completed}/${tasks.length} ${record.termination} ${matchId} ${Math.round((Date.now() - started) / 1000)}s`,
      );
  } catch (error) {
    appendFileSync(
      file(`exceptions-${index}.jsonl`),
      JSON.stringify({
        matchId,
        scheduledMatch,
        error: error instanceof Error ? error.stack : String(error),
      }) + "\n",
    );
    throw error;
  }
}
console.log(`Worker ${index} complete: ${completed}`);
