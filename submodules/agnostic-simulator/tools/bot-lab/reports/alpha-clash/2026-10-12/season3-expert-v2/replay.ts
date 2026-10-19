import "../unpack-evaluation-data.ts";
import { readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { botEvaluationReportV1Schema } from "@tcg/bot-core/schemas";
const file = (name: string) => new URL(name, import.meta.url);
const report = botEvaluationReportV1Schema.parse(
  JSON.parse(readFileSync(file("report.json"), "utf8")),
);
const selected = new Map();
const add = (m: (typeof report.matches)[number]) => selected.set(`${m.blockId}/${m.legId}`, m);
for (const id of new Set(report.matches.map((m) => m.candidateDeckId)))
  add(
    report.matches.find(
      (m) => m.candidateDeckId === id && m.baselineDeckId === id && m.blockId.endsWith("block-2"),
    )!,
  );
add([...report.matches].sort((a, b) => a.actionCount - b.actionCount)[0]!);
add([...report.matches].sort((a, b) => b.actionCount - a.actionCount)[0]!);
const workers = 4;
await Promise.all(
  Array.from({ length: workers }, (_, index) => {
    writeFileSync(
      file(`replay-tasks-${index}.json`),
      JSON.stringify(
        [...selected.keys()].filter((_, n) => n % workers === index),
        null,
        2,
      ) + "\n",
    );
    return new Promise<void>((resolve, reject) => {
      const child = spawn(
        process.execPath,
        [fileURLToPath(file("replay-worker.ts")), String(index)],
        { stdio: "inherit" },
      );
      child.on("error", reject);
      child.on("exit", (code) =>
        code === 0 ? resolve() : reject(Error(`Replay worker ${index}: ${code}`)),
      );
    });
  }),
);
const checks = Array.from({ length: workers }, (_, n) =>
  JSON.parse(readFileSync(file(`replay-checks-${n}.json`), "utf8")),
).flat();
writeFileSync(file("replay-checks.json"), JSON.stringify(checks, null, 2) + "\n");
console.log(`${checks.length}/${checks.length} exact native record replays`);
