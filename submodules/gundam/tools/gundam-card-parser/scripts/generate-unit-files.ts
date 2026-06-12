import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { UnitCard } from "@tcg/gundam-types";
import { ApitcgScraper } from "../src/scrapers/apitcg.ts";
import { NormalizationError, normalizeUnit } from "../src/normalizer.ts";
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

function renderUnit(card: UnitCard, constName: string): string {
  const effects = parseEffect(card.effect, card.type);
  const hasEffects = effects.length > 0;

  const lines = [
    hasEffects
      ? `import type { CardEffect, UnitCard } from "@tcg/gundam-types";`
      : `import type { UnitCard } from "@tcg/gundam-types";`,
    ``,
    `export const ${constName}: UnitCard = {`,
    `  cardNumber: ${JSON.stringify(card.cardNumber)},`,
    `  name: ${JSON.stringify(card.name)},`,
    `  type: "unit",`,
  ];

  if (card.color !== undefined) lines.push(`  color: ${JSON.stringify(card.color)},`);
  lines.push(`  traits: ${JSON.stringify(card.traits)},`);
  lines.push(...renderCatalogMetadataLines(card));
  lines.push(`  level: ${card.level},`);
  lines.push(`  cost: ${card.cost},`);
  lines.push(`  ap: ${card.ap},`);
  lines.push(`  hp: ${card.hp},`);
  if (card.linkCondition !== undefined)
    lines.push(`  linkCondition: ${JSON.stringify(card.linkCondition)},`);
  if (card.zone !== undefined) lines.push(`  zone: ${JSON.stringify(card.zone)},`);
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

const unitsBySet = new Map<string, Map<string, UnitCard>>();

console.log(`Scraping ${sets.length} sets for Unit cards...\n`);

for (const set of sets) {
  process.stdout.write(`  ${set.id} (${set.name})... `);

  let rawCards: RawGundamCard[];
  try {
    rawCards = await scraper.scrapeCards(set.id);
  } catch (err) {
    console.log(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
    continue;
  }

  const units = rawCards.filter((r) => r.cardType.toUpperCase() === "UNIT");
  let count = 0;
  const bucket = new Map<string, UnitCard>();

  for (const raw of units) {
    try {
      const card = normalizeUnit(raw);
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

  if (bucket.size > 0) unitsBySet.set(set.id, bucket);
  console.log(`${count} units`);
}

// ── Write files ───────────────────────────────────────────────────────────────

let totalFiles = 0;

for (const [setId, units] of unitsBySet) {
  const dir = join(CARDS_DIR, setId, "unit");
  mkdirSync(dir, { recursive: true });

  const exports: string[] = [];

  for (const card of units.values()) {
    const num = cardNumber(card.cardNumber);
    const slug = slugify(card.name);
    const constName = toConstName(card.name, num, setId);
    const filename = `${num}-${slug}.ts`;

    writeFileSync(join(dir, filename), renderUnit(card, constName));
    exports.push(`export { ${constName} } from "./${filename}";`);
    totalFiles++;
  }

  writeSetIndex(dir, exports);
}

updateRootIndex();
fmtDir(CARDS_DIR);

console.log(`\n✓ ${totalFiles} unit files written to packages/cards/src/cards/`);
