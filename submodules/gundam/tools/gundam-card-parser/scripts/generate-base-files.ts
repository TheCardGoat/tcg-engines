import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { BaseCard } from "@tcg/gundam-types";
import { ApitcgScraper } from "../src/scrapers/apitcg.ts";
import { NormalizationError, normalizeBase } from "../src/normalizer.ts";
import type { RawGundamCard } from "../src/types/scraper.ts";
import {
  CARDS_DIR,
  cardNumber,
  fmtDir,
  renderCatalogMetadataLines,
  slugify,
  toConstName,
  updateRootIndex,
  writeSetIndex,
} from "./_helpers.ts";
import { parseEffect } from "./parseEffect.ts";

// ── Rendering ─────────────────────────────────────────────────────────────────

function renderBase(card: BaseCard, constName: string): string {
  const effects = parseEffect(card.effect, card.type);
  const hasEffects = effects.length > 0;

  const lines = [
    hasEffects
      ? `import type { BaseCard, CardEffect } from "@tcg/gundam-types";`
      : `import type { BaseCard } from "@tcg/gundam-types";`,
    ``,
    `export const ${constName}: BaseCard = {`,
    `  cardNumber: ${JSON.stringify(card.cardNumber)},`,
    `  name: ${JSON.stringify(card.name)},`,
    `  type: "base",`,
    `  traits: ${JSON.stringify(card.traits)},`,
    ...renderCatalogMetadataLines(card),
    `  level: ${card.level},`,
    `  cost: ${card.cost},`,
    `  hp: ${card.hp},`,
  ];

  if (card.effect !== undefined) lines.push(`  effect: ${JSON.stringify(card.effect)},`);
  if (hasEffects) lines.push(`  effects: ${JSON.stringify(effects, null, 2)} as CardEffect[],`);
  else lines.push(`  effects: [],`);
  if (card.keywordEffects.length > 0)
    lines.push(`  keywordEffects: ${JSON.stringify(card.keywordEffects)},`);
  else lines.push(`  keywordEffects: [],`);
  lines.push(`  rarity: ${JSON.stringify(card.rarity)},`);
  lines.push(`};`, ``);

  return lines.join("\n");
}

// ── Pipeline ──────────────────────────────────────────────────────────────────

const apiKey = process.env["APITCG_KEY"];
if (!apiKey) {
  console.error("Error: APITCG_KEY environment variable is required.");
  process.exit(1);
}

const scraper = new ApitcgScraper(apiKey);
const sets = await scraper.scrapeSetList();

const basesBySet = new Map<string, Map<string, BaseCard>>();

console.log(`Scraping ${sets.length} sets for Base cards...\n`);

for (const set of sets) {
  process.stdout.write(`  ${set.id} (${set.name})... `);

  let rawCards: RawGundamCard[];
  try {
    rawCards = await scraper.scrapeCards(set.id);
  } catch (err) {
    console.log(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
    continue;
  }

  const bases = rawCards.filter((r) => r.cardType.toUpperCase() === "BASE");
  let count = 0;
  const bucket = new Map<string, BaseCard>();

  for (const raw of bases) {
    try {
      const card = normalizeBase(raw);
      if (!bucket.has(card.cardNumber)) {
        bucket.set(card.cardNumber, card);
        count++;
      }
    } catch (err) {
      if (err instanceof NormalizationError) {
        console.warn(`\n    SKIP ${raw.id}: ${err.message}`);
      } else {
        throw err;
      }
    }
  }

  if (bucket.size > 0) basesBySet.set(set.id, bucket);
  console.log(`${count} bases`);
}

// ── Write files ───────────────────────────────────────────────────────────────

let totalFiles = 0;

for (const [setId, bases] of basesBySet) {
  const dir = join(CARDS_DIR, setId, "base");
  mkdirSync(dir, { recursive: true });

  const exports: string[] = [];

  for (const card of bases.values()) {
    const num = cardNumber(card.cardNumber);
    const slug = slugify(card.name);
    const constName = toConstName(card.name, num, setId);
    const filename = `${num}-${slug}.ts`;

    writeFileSync(join(dir, filename), renderBase(card, constName));
    exports.push(`export { ${constName} } from "./${filename}";`);
    totalFiles++;
  }

  writeSetIndex(dir, exports);
}

updateRootIndex();
fmtDir(CARDS_DIR);

console.log(`\n✓ ${totalFiles} base files written to packages/cards/src/cards/`);
