import { ruleUnits } from "./rules-audit-units.mjs";
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
  // Include current pages omitted by the table of contents, without reviving
  // old unlinked aliases that remain on disk from previous imports.
  const current = JSON.parse(readFileSync(join(rulesRoot, "current-pages.json"), "utf8"));
  for (const file of current.files) {
    if (file === "table-of-contents.md" || file === "changelog.md") continue;
    if (!file.endsWith(".md") || file.includes("..") || !existsSync(join(rulesRoot, file))) {
      throw new Error(`Invalid current rules page: ${file}`);
    }
    seen.add(file);
  }
  return [...seen].sort();
}

const units = linkedRuleFiles().flatMap((file) =>
  ruleUnits(file, readFileSync(join(rulesRoot, file), "utf8")),
);
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
  const [evidenceFile, checkpoint] = entry.evidence.split(" — ");
  const evidencePath = resolve(scriptDirectory, "..", evidenceFile);
  if (
    !existsSync(evidencePath) ||
    !checkpoint ||
    !readFileSync(evidencePath, "utf8").includes(`\`${checkpoint}\``)
  ) {
    throw new Error(`Rules audit evidence cannot be resolved: ${key}`);
  }
  if (!/^[a-f0-9]{64}$/.test(entry.reviewedFingerprint ?? "")) {
    throw new Error(`Rules audit unit lacks a reviewed content fingerprint: ${key}`);
  }
}

const rows = units.map((unit) => ({
  ...unit,
  status: !statuses[unit.key]
    ? "pending"
    : statuses[unit.key].reviewedFingerprint === unit.fingerprint
      ? statuses[unit.key].status
      : "stale",
  evidence: statuses[unit.key]?.evidence ?? "",
}));
const counts = Object.fromEntries(
  ["implemented", "external", "partial", "missing", "pending", "stale"].map((status) => [
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
  (counts.pending > 0 || counts.partial > 0 || counts.missing > 0 || counts.stale > 0)
) {
  process.stderr.write(
    `Rules audit is incomplete: ${counts.stale} stale, ${counts.pending} pending, ${counts.partial} partial, ${counts.missing} missing.\n`,
  );
  process.exitCode = 1;
}
