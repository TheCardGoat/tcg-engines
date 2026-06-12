import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { PilotCard } from "@tcg/gundam-types";
import { ApitcgScraper } from "../src/scrapers/apitcg.ts";
import { NormalizationError, normalizePilot } from "../src/normalizer.ts";
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

function renderPilot(card: PilotCard, constName: string): string {
  const effects = parseEffect(card.effect, card.type);
  const hasEffects = effects.length > 0;

  const lines = [
    hasEffects
      ? `import type { CardEffect, PilotCard } from "@tcg/gundam-types";`
      : `import type { PilotCard } from "@tcg/gundam-types";`,
    ``,
    `export const ${constName}: PilotCard = {`,
    `  cardNumber: ${JSON.stringify(card.cardNumber)},`,
    `  name: ${JSON.stringify(card.name)},`,
    `  type: "pilot",`,
  ];

  if (card.color !== undefined) lines.push(`  color: ${JSON.stringify(card.color)},`);
  lines.push(`  traits: ${JSON.stringify(card.traits)},`);
  lines.push(...renderCatalogMetadataLines(card));
  lines.push(`  level: ${card.level},`);
  lines.push(`  cost: ${card.cost},`);
  lines.push(`  apBonus: ${card.apBonus},`);
  lines.push(`  hpBonus: ${card.hpBonus},`);
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

const pilotsBySet = new Map<string, Map<string, PilotCard>>();

console.log(`Scraping ${sets.length} sets for Pilot cards...\n`);

for (const set of sets) {
  process.stdout.write(`  ${set.id} (${set.name})... `);

  let rawCards: RawGundamCard[];
  try {
    rawCards = await scraper.scrapeCards(set.id);
  } catch (err) {
    console.log(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
    continue;
  }

  const pilots = rawCards.filter((r) => r.cardType.toUpperCase() === "PILOT");
  let count = 0;
  const bucket = new Map<string, PilotCard>();

  for (const raw of pilots) {
    try {
      const card = normalizePilot(raw);
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

  if (bucket.size > 0) pilotsBySet.set(set.id, bucket);
  console.log(`${count} pilots`);
}

// ── Write files ───────────────────────────────────────────────────────────────

let totalFiles = 0;

for (const [setId, pilots] of pilotsBySet) {
  const dir = join(CARDS_DIR, setId, "pilot");
  mkdirSync(dir, { recursive: true });

  const exports: string[] = [];

  for (const card of pilots.values()) {
    const num = cardNumber(card.cardNumber);
    const slug = slugify(card.name);
    const constName = toConstName(card.name, num, setId);
    const filename = `${num}-${slug}.ts`;

    writeFileSync(join(dir, filename), renderPilot(card, constName));
    exports.push(`export { ${constName} } from "./${filename}";`);
    totalFiles++;
  }

  writeSetIndex(dir, exports);
}

updateRootIndex();
fmtDir(CARDS_DIR);

console.log(`\n✓ ${totalFiles} pilot files written to packages/cards/src/cards/`);
