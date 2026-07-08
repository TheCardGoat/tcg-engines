/**
 * Enrich Gundam token/setup card definitions with the catalog-identity fields
 * required by `BaseCardDefinition` (RFC §7 / ADR-11).
 *
 * Token/setup cards live in `packages/token-data` and are NOT processed by the
 * catalog enrich script (which targets `packages/cards`). They are authored
 * gameplay entities (tokens, EX base/resource) that still extend `CardBase`, so
 * they must carry `canonicalId`, `slug`, and at least one degenerate `printing`.
 *
 * Each token gets:
 *  - `canonicalId`: `cardNumber` with any parallel suffix stripped.
 *  - `slug`: `slugify(name) + "-" + lowercase(cardNumber)`.
 *  - `printings`: one degenerate printing (`artId === canonicalId`, set "T").
 *
 * Run: `pnpm --filter @tcg/gundam-card-parser exec tsx scripts/enrich-token-cards.ts`
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SCRIPT_DIR = new URL(".", import.meta.url).pathname;
const TOKEN_ROOT = join(SCRIPT_DIR, "../../../packages/token-data/src");

const TOKEN_FIELDS = new Set(["canonicalId", "slug", "printings"]);

interface ParsedToken {
  cardNumber: string;
  name: string;
  filePath: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stripParallelSuffix(value: string): string {
  return value.replace(/[-_]p\d+$/i, "");
}

function walkFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(path));
    else if (entry.name.endsWith(".ts") && entry.name !== "index.ts") out.push(path);
  }
  return out;
}

function parseToken(filePath: string, source: string): ParsedToken | null {
  const cardNumber = source.match(/\n\s*cardNumber:\s*"([^"]+)"/)?.[1];
  const name = source.match(/\n\s*name:\s*"([^"]+)"/)?.[1];
  if (!cardNumber || !name) return null;
  return { cardNumber, name, filePath };
}

function removeExistingTokenFields(lines: string[]): string[] {
  const output: string[] = [];
  let skipping = false;
  for (const line of lines) {
    const topLevelProperty = line.match(/^  ([A-Za-z][A-Za-z0-9]*):/);
    if (topLevelProperty && TOKEN_FIELDS.has(topLevelProperty[1]!)) {
      skipping = true;
      continue;
    }
    if (skipping && (/^  [A-Za-z][A-Za-z0-9]*:/.test(line) || line === "};")) {
      skipping = false;
    }
    if (!skipping) output.push(line);
  }
  return output;
}

function renderTokenFields(parsed: ParsedToken): string[] {
  const canonicalId = stripParallelSuffix(parsed.cardNumber);
  const printing = {
    id: parsed.cardNumber,
    artId: canonicalId,
    setCode: "T",
    collectorNumber: parsed.cardNumber,
    cardNumber: parsed.cardNumber,
    set: { code: "T", name: "Token Cards" },
    rarity: "common",
    finish: "standard",
    imageUrl: "",
  };
  return [
    `  canonicalId: ${JSON.stringify(canonicalId)},`,
    `  slug: ${JSON.stringify(`${slugify(parsed.name)}-${parsed.cardNumber.toLowerCase()}`)},`,
    `  printings: ${JSON.stringify([printing], null, 2)},`,
  ];
}

function insertTokenFields(source: string, parsed: ParsedToken): string {
  const lines = removeExistingTokenFields(source.split("\n"));
  const traitsIndex = lines.findIndex((line) => line.startsWith("  traits:"));
  if (traitsIndex < 0) throw new Error(`Could not find traits property in ${parsed.filePath}`);
  lines.splice(traitsIndex + 1, 0, ...renderTokenFields(parsed));
  return lines.join("\n");
}

let updated = 0;
let skipped = 0;
for (const filePath of walkFiles(TOKEN_ROOT).sort()) {
  const source = readFileSync(filePath, "utf8");
  const parsed = parseToken(filePath, source);
  if (!parsed) {
    skipped++;
    continue;
  }
  const nextSource = insertTokenFields(source, parsed);
  if (nextSource !== source) {
    writeFileSync(filePath, nextSource);
    updated++;
  }
}

console.log(`Enriched ${updated} Gundam token/setup card file(s); skipped ${skipped}.`);
