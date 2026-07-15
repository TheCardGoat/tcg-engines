/**
 * Backfill script: adds `effects:` field to all card files that are missing it.
 *
 * For each card file without an `effects:` field:
 *   - Extracts the raw `effect:` string value
 *   - Runs parseEffect() on it
 *   - Injects `effects: [...] as CardEffect[]` (or `effects: []`) before `keywordEffects:`
 *   - Updates the import to include `CardEffect` when needed
 *
 * Run with:
 *   node --experimental-strip-types scripts/backfill-effects.ts
 */

import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import { parseEffect } from "./parseEffect.ts";
import type { CardType } from "@tcg/gundam-types";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CARDS_DIR = join(__dirname, "../../../packages/cards/src/cards");
const REPO_ROOT = join(__dirname, "../../..");

// ── File discovery ─────────────────────────────────────────────────────────────

function findCardFiles(dir: string): string[] {
  const result: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...findCardFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".ts") && entry.name !== "index.ts") {
      result.push(fullPath);
    }
  }
  return result;
}

// ── String extraction ──────────────────────────────────────────────────────────

/**
 * Extract the raw effect string value from a card's TypeScript source.
 * Handles both inline and next-line formats:
 *   effect: "value",
 *   effect:
 *     "value",
 */
function extractEffectString(src: string): string | null {
  // Match effect key followed by optional whitespace/newline, then a JSON string
  const match = src.match(/  effect:[ \t]*\n?[ \t]*("(?:[^"\\]|\\.)*"),/);
  if (!match || !match[1]) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

// ── Source rewriting ───────────────────────────────────────────────────────────

function addCardEffectToImport(src: string): string {
  return src.replace(
    /^import type \{([^}]+)\} from "@tcg\/gundam-types";/m,
    (_match, types: string) => {
      const typeList = types
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      if (!typeList.includes("CardEffect")) {
        typeList.unshift("CardEffect");
      }
      return `import type { ${typeList.join(", ")} } from "@tcg/gundam-types";`;
    },
  );
}

function formatEffectsBlock(effects: object[]): string {
  // Produce the inline JSON blob; the formatter will clean up indentation
  return JSON.stringify(effects, null, 2);
}

function injectEffects(src: string, effects: object[]): string {
  const hasEffects = effects.length > 0;

  // Update import when we have real effects
  let newSrc = hasEffects ? addCardEffectToImport(src) : src;

  // Build the effects line(s) to insert before keywordEffects
  const effectsLine = hasEffects
    ? `  effects: ${formatEffectsBlock(effects)} as CardEffect[],\n`
    : `  effects: [],\n`;

  newSrc = newSrc.replace(/^([ \t]+keywordEffects:)/m, `${effectsLine}$1`);

  return newSrc;
}

// ── Main loop ──────────────────────────────────────────────────────────────────

const files = findCardFiles(CARDS_DIR);

let countSkipped = 0;
let countNoEffect = 0;
let countUpdated = 0;

const unparseable: Array<{ file: string; effect: string }> = [];

for (const filePath of files) {
  const src = readFileSync(filePath, "utf8");
  const rel = relative(CARDS_DIR, filePath);

  // Skip files that already have the effects field
  if (/^\s+effects:/m.test(src)) {
    countSkipped++;
    continue;
  }

  const effectValue = extractEffectString(src);

  if (effectValue === null) {
    // No effect field at all — inject empty effects before keywordEffects
    if (/^\s+keywordEffects:/m.test(src)) {
      const newSrc = src.replace(/^([ \t]+keywordEffects:)/m, `  effects: [],\n$1`);
      writeFileSync(filePath, newSrc);
      countUpdated++;
    } else {
      countNoEffect++;
    }
    continue;
  }

  // Extract card type for parseEffect
  const typeMatch = src.match(/  type:\s*"(\w+)"/);
  const cardType = (typeMatch?.[1] ?? undefined) as CardType | undefined;

  const effects = parseEffect(effectValue, cardType);

  if (effects.length === 0 && effectValue !== "-" && effectValue.trim() !== "") {
    // parseEffect returned nothing for a non-trivial effect string
    unparseable.push({ file: rel, effect: effectValue });
  }

  const newSrc = injectEffects(src, effects);

  if (newSrc !== src) {
    writeFileSync(filePath, newSrc);
    countUpdated++;
  }
}

console.log(`\nBackfill complete:`);
console.log(`  Updated:              ${countUpdated}`);
console.log(`  Already had effects:  ${countSkipped}`);
console.log(`  No effect/keywordEffects field: ${countNoEffect}`);

if (unparseable.length > 0) {
  console.log(
    `\n⚠  ${unparseable.length} cards have effect text that parseEffect could not parse:`,
  );
  for (const { file, effect } of unparseable) {
    console.log(`\n  ${file}`);
    console.log(`    ${effect.slice(0, 120).replace(/\n/g, "↵")}`);
  }
} else {
  console.log(`\n✓ All card effects were parsed successfully.`);
}

// Format the updated files
console.log(`\nFormatting cards directory...`);
try {
  execSync(`vp fmt ${CARDS_DIR}`, { stdio: "inherit", cwd: REPO_ROOT });
} catch {
  // fmt is best-effort
}
