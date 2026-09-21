import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { rewalkClosedLoop, writeJournalMarkdown } from "./self-improve-journal.ts";

const root = process.argv[2];
if (!root) throw new Error("usage: rewalk-journal <batch-dir>");

const rows = rewalkClosedLoop({
  dumpDir: join(root, "dumps"),
  iterations: 10,
});
writeJournalMarkdown(join(root, "iterations.md"), rows);
writeFileSync(
  join(root, "journal.jsonl"),
  `${rows.map((row) => JSON.stringify(row)).join("\n")}\n`,
);
console.log("rewrote", rows.length, "rows");
const named = rows.filter((row) => row.flowGap !== "none");
console.log("named flowGap rows", named.length);
