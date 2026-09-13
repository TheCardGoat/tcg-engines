import { readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(scriptDirectory, "../../..");
const rulesRoot = join(
  workspaceRoot,
  ".agents/skills/grand-archive-rules/references/grand-archive-comprehensive-rules",
);
const statusPath = resolve(scriptDirectory, "../reports/comprehensive-rules-audit-status.json");
const statuses = JSON.parse(readFileSync(statusPath, "utf8"));

function linkedRuleFiles() {
  const pending = ["table-of-contents.md"];
  const seen = new Set();
  while (pending.length > 0) {
    const file = pending.shift();
    if (seen.has(file)) continue;
    const absolutePath = join(rulesRoot, file);
    if (!existsSync(absolutePath)) throw new Error(`Rules link does not exist: ${file}`);
    seen.add(file);
    const source = readFileSync(absolutePath, "utf8");
    for (const match of source.matchAll(/\]\(\/([^)#]+\.md)(?:#[^)]+)?\)/g)) {
      if (!seen.has(match[1])) pending.push(match[1]);
    }
  }
  seen.delete("table-of-contents.md");
  return [...seen].sort();
}

function headingSlug(value) {
  return value
    .replace(/<a\b[^>]*>.*?<\/a>/g, "")
    .replace(/[`*_]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ruleUnits(file) {
  const source = readFileSync(join(rulesRoot, file), "utf8");
  const headings = [...source.matchAll(/^(#{1,6})\s+(.+?)\s*$/gm)];
  const units = [];
  for (let index = 0; index < headings.length; index += 1) {
    const heading = headings[index];
    const bodyStart = heading.index + heading[0].length;
    const bodyEnd = headings[index + 1]?.index ?? source.length;
    const body = source.slice(bodyStart, bodyEnd);
    if (!/^\s*(?:\d+\.|\*)\s+/m.test(body)) continue;
    const title = heading[2].replace(/<a\b[^>]*>.*?<\/a>/g, "").trim();
    units.push({
      key: `${file}#${headingSlug(title)}`,
      file,
      title,
      line: source.slice(0, heading.index).split("\n").length,
    });
  }
  return units;
}

const units = linkedRuleFiles().flatMap(ruleUnits);
const unitByKey = new Map(units.map((unit) => [unit.key, unit]));
if (unitByKey.size !== units.length) throw new Error("Rules audit contains duplicate unit keys");

const allowedStatuses = new Set(["implemented", "external", "partial", "missing"]);
for (const [key, entry] of Object.entries(statuses)) {
  if (!unitByKey.has(key)) throw new Error(`Unknown rules audit unit: ${key}`);
  if (!entry || typeof entry !== "object" || !allowedStatuses.has(entry.status)) {
    throw new Error(`Invalid status for rules audit unit: ${key}`);
  }
  if (typeof entry.evidence !== "string" || entry.evidence.trim().length === 0) {
    throw new Error(`Rules audit unit lacks evidence: ${key}`);
  }
}

const rows = units.map((unit) => ({
  ...unit,
  status: statuses[unit.key]?.status ?? "pending",
  evidence: statuses[unit.key]?.evidence ?? "",
}));
const counts = Object.fromEntries(
  ["implemented", "external", "partial", "missing", "pending"].map((status) => [
    status,
    rows.filter((row) => row.status === status).length,
  ]),
);

if (process.argv.includes("--list")) {
  for (const row of rows) {
    process.stdout.write(`${row.status}\t${row.key}\t${row.evidence}\n`);
  }
} else {
  process.stdout.write(
    `${JSON.stringify({ files: linkedRuleFiles().length, units: rows.length, ...counts }, null, 2)}\n`,
  );
}

if (
  process.argv.includes("--complete") &&
  (counts.pending > 0 || counts.partial > 0 || counts.missing > 0)
) {
  process.stderr.write(
    `Rules audit is incomplete: ${counts.pending} pending, ${counts.partial} partial, ${counts.missing} missing.\n`,
  );
  process.exitCode = 1;
}
