import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { CommandCard } from "@tcg/gundam-types";
import { ApitcgScraper } from "../src/scrapers/apitcg.ts";
import { NormalizationError, normalizeCommand } from "../src/normalizer.ts";
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

function renderCommand(card: CommandCard, constName: string): string {
  const effects = parseEffect(card.effect, card.type);
  const hasEffects = effects.length > 0;

  const lines = [
    hasEffects
      ? `import type { CardEffect, CommandCard } from "@tcg/gundam-types";`
      : `import type { CommandCard } from "@tcg/gundam-types";`,
    ``,
    `export const ${constName}: CommandCard = {`,
    `  cardNumber: ${JSON.stringify(card.cardNumber)},`,
    `  name: ${JSON.stringify(card.name)},`,
    `  type: "command",`,
  ];

  if (card.color !== undefined) lines.push(`  color: ${JSON.stringify(card.color)},`);
  lines.push(`  traits: ${JSON.stringify(card.traits)},`);
  lines.push(...renderCatalogMetadataLines(card));
  lines.push(`  level: ${card.level},`);
  lines.push(`  cost: ${card.cost},`);
  if (card.pilotName !== undefined) {
    lines.push(`  pilotName: ${JSON.stringify(card.pilotName)},`);
    lines.push(`  apBonus: ${card.apBonus ?? 0},`);
    lines.push(`  hpBonus: ${card.hpBonus ?? 0},`);
  }
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

const commandsBySet = new Map<string, Map<string, CommandCard>>();

console.log(`Scraping ${sets.length} sets for Command cards...\n`);

for (const set of sets) {
  process.stdout.write(`  ${set.id} (${set.name})... `);

  let rawCards: RawGundamCard[];
  try {
    rawCards = await scraper.scrapeCards(set.id);
  } catch (err) {
    console.log(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
    continue;
  }

  const commands = rawCards.filter((r) => r.cardType.toUpperCase() === "COMMAND");
  let count = 0;
  const bucket = new Map<string, CommandCard>();

  for (const raw of commands) {
    try {
      const card = normalizeCommand(raw);
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

  if (bucket.size > 0) commandsBySet.set(set.id, bucket);
  console.log(`${count} commands`);
}

// ── Write files ───────────────────────────────────────────────────────────────

let totalFiles = 0;

for (const [setId, commands] of commandsBySet) {
  const dir = join(CARDS_DIR, setId, "command");
  mkdirSync(dir, { recursive: true });

  const exports: string[] = [];

  for (const card of commands.values()) {
    const num = cardNumber(card.cardNumber);
    const slug = slugify(card.name);
    const constName = toConstName(card.name, num, setId);
    const filename = `${num}-${slug}.ts`;

    writeFileSync(join(dir, filename), renderCommand(card, constName));
    exports.push(`export { ${constName} } from "./${filename}";`);
    totalFiles++;
  }

  writeSetIndex(dir, exports);
}

updateRootIndex();
fmtDir(CARDS_DIR);

console.log(`\n✓ ${totalFiles} command files written to packages/cards/src/cards/`);
