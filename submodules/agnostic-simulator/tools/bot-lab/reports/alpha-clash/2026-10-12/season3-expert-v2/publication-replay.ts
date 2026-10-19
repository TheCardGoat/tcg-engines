import "../unpack-evaluation-data.ts";
import { readFileSync, writeFileSync } from "node:fs";
import { spawn, execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { canonicalJson } from "@tcg/bot-core";
import { botEvaluationReportV1Schema } from "@tcg/bot-core/schemas";
import { alphaClashBotLabAdapter as adapter } from "../../../../src/adapters/alpha-clash.ts";

const file = (name: string) => new URL(name, import.meta.url);
const report = botEvaluationReportV1Schema.parse(
  JSON.parse(readFileSync(file("report.json"), "utf8")),
);
const source = adapter.getEngineRevision();
if (adapter.getCardCatalogHash() !== report.cardCatalogHash)
  throw Error("Publication catalog drift");
const selected: { key: string }[] = JSON.parse(readFileSync(file("replay-checks.json"), "utf8"));
const workers = 4;
if (process.argv[2] === undefined) {
  writeFileSync(
    file("publication-source.json"),
    JSON.stringify(
      {
        baseCommit: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
        recordedEngineRevision: report.engineRevision,
        publishedEngineRevision: source,
        cardCatalogHash: report.cardCatalogHash,
        method:
          "Preserve the recorded benchmark manifest. Replay the same ten records against the scoped PR source after integration with current main, and compare complete canonical records.",
      },
      null,
      2,
    ) + "\n",
  );
  await Promise.all(
    Array.from(
      { length: workers },
      (_, index) =>
        new Promise<void>((resolve, reject) => {
          const child = spawn(process.execPath, [fileURLToPath(import.meta.url), String(index)], {
            stdio: "inherit",
          });
          child.on("error", reject);
          child.on("exit", (code) =>
            code === 0 ? resolve() : reject(Error(`Publication replay worker ${index}: ${code}`)),
          );
        }),
    ),
  );
  const checks = Array.from({ length: workers }, (_, index) =>
    JSON.parse(readFileSync(file(`publication-replay-checks-${index}.json`), "utf8")),
  ).flat();
  writeFileSync(file("publication-replay-checks.json"), JSON.stringify(checks, null, 2) + "\n");
  console.log(
    `${checks.length}/${checks.length} original full records reproduced against scoped PR source`,
  );
} else {
  const frozen = JSON.parse(readFileSync(file("publication-source.json"), "utf8"));
  if (frozen.publishedEngineRevision !== source)
    throw Error("Publication source changed during replay");
  const index = Number(process.argv[2]);
  const checks = [];
  for (const { key } of selected.filter((_, n) => n % workers === index)) {
    const record = report.matches.find((match) => `${match.blockId}/${match.legId}` === key);
    if (!record) throw Error(`Missing original record ${key}`);
    const replay = await adapter.replayMatch(record, report);
    const matches = canonicalJson(record) === canonicalJson(replay);
    if (!matches) throw Error(`Publication replay mismatch: ${key}`);
    checks.push({
      key,
      matches,
      expectedHash: record.finalStateHash,
      actualHash: replay.finalStateHash,
    });
  }
  writeFileSync(
    file(`publication-replay-checks-${index}.json`),
    JSON.stringify(checks, null, 2) + "\n",
  );
}
