// Audit the canonical card layout: every card definition must live directly
// under src/cards/<type>/ as <canonical-id-lowercase>-<slug>.ts (+ sibling
// .i18n.ts), and duplicate definitions must be authored via printings[], not
// as spread copies of a base definition.
//
//   node scripts/audit-canonical-card-layout.mjs
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CARDS_SRC = join(__dirname, "..", "src", "cards");
const TYPE_DIRS = new Set(["leaders", "characters", "events", "stages", "don"]);
const NON_DEFINITION_FILES = new Set([join(CARDS_SRC, "st01-helpers.ts")]);

const problems = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!TYPE_DIRS.has(entry.name)) {
        problems.push(`legacy directory under src/cards: ${entry.name}/`);
        continue;
      }
      walk(path);
      continue;
    }
    if (NON_DEFINITION_FILES.has(path) || entry.name === "index.ts") continue;
    if (path.slice(CARDS_SRC.length + 1).split("/").length !== 2) {
      problems.push(
        `card file not directly under a type directory: ${path.slice(CARDS_SRC.length + 1)}`,
      );
      continue;
    }
    if (entry.name.endsWith(".i18n.ts")) continue;
    if (!entry.name.endsWith(".ts")) continue;
    const text = readFileSync(path, "utf8");
    if (/^\s*\.\.\.\w+,?\s*$/m.test(text)) {
      problems.push(`spread-copy authoring (duplicate definition) in ${entry.name}`);
    }
    const id = /^ {2}id: "([^"]+)",$/m.exec(text)?.[1];
    const slug = /^ {2}slug: "([^"]+)",$/m.exec(text)?.[1];
    const expectedPrefix = `${(id ?? "").toLowerCase()}-`;
    if (id && !entry.name.startsWith(expectedPrefix)) {
      problems.push(
        `${entry.name}: file name must start with the lowercase canonical id ("${expectedPrefix}")`,
      );
    }
    if (slug && !entry.name.startsWith(`${id.toLowerCase()}-${slug.split("/")[0]}`)) {
      problems.push(
        `${entry.name}: file name must continue with the slug name part ("${slug.split("/")[0]}")`,
      );
    }
  }
}
walk(CARDS_SRC);

if (problems.length > 0) {
  console.error(`canonical card layout audit failed (${problems.length} problems):`);
  for (const problem of problems) console.error(`  - ${problem}`);
  process.exit(1);
}
console.log("canonical card layout audit passed");
