import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { ResourceCard } from "@tcg/gundam-types";
import { ApitcgScraper } from "../src/scrapers/apitcg.ts";
import { NormalizationError, normalizeResource } from "../src/normalizer.ts";
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

function renderResource(card: ResourceCard, constName: string): string {
  const effects = parseEffect(card.effect, card.type);
  const hasEffects = effects.length > 0;

  const lines = [
    hasEffects
      ? `import type { CardEffect, ResourceCard } from "@tcg/gundam-types";`
      : `import type { ResourceCard } from "@tcg/gundam-types";`,
    ``,
    `export const ${constName}: ResourceCard = {`,
    `  cardNumber: ${JSON.stringify(card.cardNumber)},`,
    `  name: ${JSON.stringify(card.name)},`,
    `  type: "resource",`,
    `  traits: ${JSON.stringify(card.traits)},`,
    ...renderCatalogMetadataLines(card),
    `  level: ${card.level},`,
    `  cost: ${card.cost},`,
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

const resourcesBySet = new Map<string, Map<string, ResourceCard>>();

console.log(`Scraping ${sets.length} sets for Resource cards...\n`);

for (const set of sets) {
  process.stdout.write(`  ${set.id} (${set.name})... `);

  let rawCards: RawGundamCard[];
  try {
    rawCards = await scraper.scrapeCards(set.id);
  } catch (err) {
    console.log(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
    continue;
  }

  const resources = rawCards.filter((r) => r.cardType.toUpperCase() === "RESOURCE");
  let count = 0;
  const bucket = new Map<string, ResourceCard>();

  for (const raw of resources) {
    try {
      const card = normalizeResource(raw);
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

  if (bucket.size > 0) resourcesBySet.set(set.id, bucket);
  console.log(`${count} resources`);
}

// ── Write files ───────────────────────────────────────────────────────────────

let totalFiles = 0;

for (const [setId, resources] of resourcesBySet) {
  const dir = join(CARDS_DIR, setId, "resource");
  mkdirSync(dir, { recursive: true });

  const exports: string[] = [];

  for (const card of resources.values()) {
    const num = cardNumber(card.cardNumber);
    const slug = slugify(card.name);
    const constName = toConstName(card.name, num, setId);
    const filename = `${num}-${slug}.ts`;

    writeFileSync(join(dir, filename), renderResource(card, constName));
    exports.push(`export { ${constName} } from "./${filename}";`);
    totalFiles++;
  }

  writeSetIndex(dir, exports);
}

updateRootIndex();
fmtDir(CARDS_DIR);

console.log(`\n✓ ${totalFiles} resource files written to packages/cards/src/cards/`);
