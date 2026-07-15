/**
 * Pre-flight collision check (RFC open Q6a).
 *
 * Verifies that no `cardNumber` is shared across genuinely-different cards before
 * the catalog generator backfills `canonicalId` from `cardNumber`. A `cardNumber`
 * is the canonical gameplay identity: it MAY be shared by a canonical card and
 * its BETA duplicates (same name, same gameplay), but MUST NOT be shared by two
 * cards with different names — that would be a data bug that corrupts the
 * canonical-id anchor.
 *
 * Rule: group card files by canonical `cardNumber` (parallel suffix stripped).
 * Within each group, every file must carry the SAME card `name`. Any group with
 * divergent names is reported as a collision and fails the check.
 *
 * Run: `pnpm --filter @tcg/gundam-card-parser exec tsx scripts/check-cardnumber-collisions.ts`
 * (or via `vp run`). Exits non-zero on collision.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SCRIPT_DIR = new URL(".", import.meta.url).pathname;
const CARD_ROOT = join(SCRIPT_DIR, "../../../packages/cards/src/cards");

function stripParallelSuffix(cardNumber: string): string {
  return cardNumber.replace(/[-_]p\d+$/i, "");
}

function walkFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(path));
    else if (
      entry.name.endsWith(".ts") &&
      !entry.name.endsWith(".test.ts") &&
      entry.name !== "index.ts" &&
      entry.name !== "source-titles.ts"
    ) {
      out.push(path);
    }
  }
  return out;
}

interface CardRecord {
  cardNumber: string;
  canonical: string;
  name: string;
  file: string;
}

const records: CardRecord[] = [];
let unparsed = 0;
for (const file of walkFiles(CARD_ROOT).sort()) {
  const source = readFileSync(file, "utf8");
  const cardNumber = source.match(/\n\s*cardNumber:\s*"([^"]+)"/)?.[1];
  const name = source.match(/\n\s*name:\s*"([^"]+)"/)?.[1];
  if (!cardNumber || !name) {
    unparsed++;
    continue;
  }
  records.push({ cardNumber, canonical: stripParallelSuffix(cardNumber), name, file });
}

// Group by canonical cardNumber.
const byCanonical = new Map<string, CardRecord[]>();
for (const record of records) {
  const list = byCanonical.get(record.canonical) ?? [];
  list.push(record);
  byCanonical.set(record.canonical, list);
}

// A canonical id is a collision iff more than one DISTINCT name appears across
// its card files (BETA duplicates legitimately share both cardNumber and name).
const collisions: Array<{ canonical: string; names: Map<string, string[]> }> = [];
for (const [canonical, list] of byCanonical) {
  const namesToFiles = new Map<string, string[]>();
  for (const record of list) {
    const files = namesToFiles.get(record.name) ?? [];
    files.push(record.file);
    namesToFiles.set(record.name, files);
  }
  if (namesToFiles.size > 1) {
    collisions.push({ canonical, names: namesToFiles });
  }
}

// Summary stats.
const cardsPerCanonical = [...byCanonical.values()].map((list) => list.length);
const maxCardsPerCanonical = cardsPerCanonical.reduce((a, b) => Math.max(a, b), 0);
const multiCardCanonicals = cardsPerCanonical.filter((n) => n > 1).length;

console.log(`Checked ${records.length} card files (${unparsed} unparsed).`);
console.log(
  `Distinct canonical cardNumbers: ${byCanonical.size}. ` +
    `Cards-per-canonical: max ${maxCardsPerCanonical}, ` +
    `${multiCardCanonicals} canonical id(s) shared by >1 card file.`,
);

if (collisions.length > 0) {
  console.error(
    `\nFOUND ${collisions.length} cardNumber collision(s) across different-name cards:`,
  );
  for (const { canonical, names } of collisions) {
    console.error(`  ${canonical}:`);
    for (const [name, files] of names) {
      console.error(`    - name=${JSON.stringify(name)} (${files.length} file(s))`);
      for (const file of files) console.error(`        ${file}`);
    }
  }
  process.exit(1);
}

console.log("OK: no cardNumber collisions across genuinely-different cards.");
