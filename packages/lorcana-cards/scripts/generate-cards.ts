#!/usr/bin/env bun
/**
 * Card Generation Script
 *
 * Generates card data from ravensburger-input.json and lorcast-input.json
 * into the src/cards directory (individual TypeScript files) and
 * src/data directory (JSON reference files).
 *
 * Data source strategy:
 *   - Card text: Lorcast (has symbols like {S}, {I}, {D})
 *   - All other data: Ravensburger (stats, images, set info)
 *
 * Usage:
 *   bun packages/lorcana-cards/scripts/generate-cards.ts
 *
 * Output files:
 *   - src/cards/{set}/{type}/{card}.ts (individual card files)
 *   - src/cards/cards.ts (main aggregator)
 *   - src/cards/index.ts (entry point)
 *   - src/cards/types.ts (type definitions)
 *   - src/data/sets.json
 *   - src/data/printings.json
 *   - src/data/id-mapping.json
 */

import fs from "node:fs";
import path from "node:path";
import { generateCanonicalCards } from "./generators/canonical-generator";
import { generateCardFiles } from "./generators/file-generator";
import { createIdMapping } from "./generators/id-generator";
import {
  hasManualOverride,
  hasSimpleDrawAbility,
  isKeywordOnlyCard,
  isParseableCard,
} from "./generators/parser-validator";
import {
  calculateSetTotals,
  generatePrintings,
} from "./generators/printings-generator";
import { generateSets, updateSetTotalCards } from "./generators/sets-generator";
import {
  getAllCards,
  getCardSets,
  getUniqueDeckBuildingIds,
  groupByDeckBuildingId,
  loadLorcastJson,
  loadMergedInput,
  loadRavensburgerJson,
} from "./parsers/input-parser";
import { loadAndBuildLorcastIndex } from "./parsers/lorcast-parser";
import type { IdMapping } from "./types";

const DATA_OUTPUT_DIR = path.resolve(__dirname, "../src/data");
const CARDS_OUTPUT_DIR = path.resolve(__dirname, "../src/cards");
const ID_MAPPING_PATH = path.resolve(DATA_OUTPUT_DIR, "id-mapping.json");

/**
 * Load existing ID mapping if available (for stable IDs)
 */
function loadExistingIdMapping(): IdMapping | undefined {
  try {
    if (fs.existsSync(ID_MAPPING_PATH)) {
      const content = fs.readFileSync(ID_MAPPING_PATH, "utf-8");
      return JSON.parse(content) as IdMapping;
    }
  } catch {
    console.log("No existing ID mapping found, generating fresh IDs");
  }
  return undefined;
}

/**
 * Write JSON file with pretty formatting
 */
function writeJson(filePath: string, data: unknown): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Main generation function
 */
async function main() {
  console.log("🔍 Loading card data from dual sources...");
  console.log("   - Ravensburger: stats, images, set info");
  console.log("   - Lorcast: card text with symbols ({S}, {I}, {D})");

  // Load Lorcast index for text merging
  console.log("\n📖 Loading Lorcast data...");
  const lorcastIndex = loadAndBuildLorcastIndex();

  // Load merged input (already has Lorcast text merged in)
  console.log("\n📚 Loading Ravensburger data with Lorcast text...");
  const input = loadMergedInput();

  // Generate sets (only EXPANSION sets, filter out QUEST/gateway)
  console.log("📚 Generating sets...");
  const cardSets = getCardSets(input);
  const expansionSets = cardSets.filter((set) => set.type === "EXPANSION");
  const sets = generateSets(expansionSets);
  const expansionSetIds = new Set(Object.keys(sets));
  console.log(
    `  Found ${Object.keys(sets).length} expansion sets (filtered ${cardSets.length - expansionSets.length} non-expansion sets)`,
  );

  console.log("📦 Processing cards...");
  const allCardsRaw = getAllCards(input);
  // Filter to only cards that belong to expansion sets
  const allCards = allCardsRaw.filter((card) =>
    card.card_sets.some((setId) => expansionSetIds.has(setId)),
  );
  console.log(
    `  Found ${allCards.length} expansion card entries (filtered ${allCardsRaw.length - allCards.length} non-expansion cards)`,
  );

  // Get unique deck_building_ids
  const deckBuildingIds = getUniqueDeckBuildingIds(allCards);
  console.log(`  Found ${deckBuildingIds.length} unique game cards`);

  // Create or update ID mapping
  console.log("🔑 Generating short IDs...");
  const existingMapping = loadExistingIdMapping();
  const idMapping = createIdMapping(deckBuildingIds, existingMapping);
  console.log(`  Generated ${Object.keys(idMapping.byShortId).length} IDs`);

  // Group cards by deck_building_id
  console.log("🗂️ Grouping cards by deck_building_id...");
  const cardGroups = groupByDeckBuildingId(allCards);

  // Generate printings first (needed to calculate set totals)
  console.log("🖨️ Generating printings...");
  const printings = generatePrintings(allCards, idMapping);
  console.log(`  Generated ${Object.keys(printings).length} printings`);

  // Update set totals
  const setTotals = calculateSetTotals(printings);
  for (const [setId, total] of setTotals.entries()) {
    updateSetTotalCards(sets, setId, total);
  }

  // Generate canonical cards (with Lorcast text for symbols)
  console.log("🃏 Generating canonical cards...");
  const canonicalCards = generateCanonicalCards(
    cardGroups,
    idMapping,
    lorcastIndex,
  );
  console.log(
    `  Generated ${Object.keys(canonicalCards).length} canonical cards`,
  );

  // Write JSON reference files
  console.log("📝 Writing JSON reference files...");

  writeJson(path.join(DATA_OUTPUT_DIR, "sets.json"), sets);
  console.log("  ✅ sets.json");

  writeJson(path.join(DATA_OUTPUT_DIR, "printings.json"), printings);
  console.log("  ✅ printings.json");

  writeJson(path.join(DATA_OUTPUT_DIR, "canonical-cards.json"), canonicalCards);
  console.log("  ✅ canonical-cards.json");

  writeJson(ID_MAPPING_PATH, idMapping);
  console.log("  ✅ id-mapping.json");

  // Generate individual card TypeScript files
  console.log("\n📂 Generating card TypeScript files...");

  // Clear existing cards directory
  /*
  if (fs.existsSync(CARDS_OUTPUT_DIR)) {
    fs.rmSync(CARDS_OUTPUT_DIR, { recursive: true });
  }
  */

  // Filter to vanilla cards + parseable cards (keywords or action effects)
  const generatableCards: Record<string, (typeof canonicalCards)[string]> = {};
  let vanillaCount = 0;
  let parseableCount = 0;
  let manualOverrideCount = 0;
  let keywordOnlyCount = 0;
  let simpleDrawCount = 0;

  // Detailed tracking for verbose log
  const cardCategories: {
    vanilla: string[];
    manualOverride: string[];
    keywordOnly: string[];
    simpleDraw: string[];
    otherParseable: string[];
  } = {
    vanilla: [],
    manualOverride: [],
    keywordOnly: [],
    simpleDraw: [],
    otherParseable: [],
  };

  for (const [id, card] of Object.entries(canonicalCards)) {
    if (card.vanilla) {
      generatableCards[id] = card;
      vanillaCount++;
      cardCategories.vanilla.push(card.fullName || card.name);
    } else if (isParseableCard(card)) {
      generatableCards[id] = card;
      parseableCount++;

      const cardName = card.fullName || card.name;
      if (hasManualOverride(card)) {
        manualOverrideCount++;
        cardCategories.manualOverride.push(cardName);
      } else if (isKeywordOnlyCard(card)) {
        keywordOnlyCount++;
        cardCategories.keywordOnly.push(cardName);
      } else if (hasSimpleDrawAbility(card)) {
        simpleDrawCount++;
        cardCategories.simpleDraw.push(cardName);
      } else {
        cardCategories.otherParseable.push(cardName);
      }
    } else {
      // Stubbed cards (not supported by parser yet)
      card.missingImplementation = true;
      card.missingTests = true;
      generatableCards[id] = card;
      // We'll track them if we add a category, but for now just adding them is enough to generate.
      // Let's add logging for them too.
    }
  }

  // CLI output - concise
  console.log(
    `  Filtering to ${Object.keys(generatableCards).length} generatable cards:`,
  );
  console.log(`    - Vanilla: ${vanillaCount}`);
  console.log(`    - Parseable: ${parseableCount}`);
  if (manualOverrideCount > 0) {
    console.log(`      • Manual overrides: ${manualOverrideCount}`);
  }
  if (keywordOnlyCount > 0) {
    console.log(`      • Keywords only: ${keywordOnlyCount}`);
  }
  if (simpleDrawCount > 0) {
    console.log(`      • Simple draw effects: ${simpleDrawCount}`);
  }
  if (cardCategories.otherParseable.length > 0) {
    console.log(
      `      • Other parseable: ${cardCategories.otherParseable.length}`,
    );
  }

  // Write verbose log to file
  const verboseLogPath = path.join(DATA_OUTPUT_DIR, "generation-verbose.log");
  const verboseLog: string[] = [];
  verboseLog.push("=".repeat(80));
  verboseLog.push("CARD GENERATION VERBOSE LOG");
  verboseLog.push("=".repeat(80));
  verboseLog.push("");
  verboseLog.push(
    `Total generatable cards: ${Object.keys(generatableCards).length}`,
  );
  verboseLog.push("");

  if (cardCategories.vanilla.length > 0) {
    verboseLog.push(`VANILLA CARDS (${cardCategories.vanilla.length}):`);
    cardCategories.vanilla.forEach((name) => {
      verboseLog.push(`  - ${name}`);
    });
    verboseLog.push("");
  }

  if (cardCategories.manualOverride.length > 0) {
    verboseLog.push(
      `MANUAL OVERRIDE CARDS (${cardCategories.manualOverride.length}):`,
    );
    cardCategories.manualOverride.forEach((name) => {
      verboseLog.push(`  - ${name}`);
    });
    verboseLog.push("");
  }

  if (cardCategories.keywordOnly.length > 0) {
    verboseLog.push(
      `KEYWORD-ONLY CARDS (${cardCategories.keywordOnly.length}):`,
    );
    cardCategories.keywordOnly.forEach((name) => {
      verboseLog.push(`  - ${name}`);
    });
    verboseLog.push("");
  }

  if (cardCategories.simpleDraw.length > 0) {
    verboseLog.push(
      `SIMPLE DRAW EFFECT CARDS (${cardCategories.simpleDraw.length}):`,
    );
    cardCategories.simpleDraw.forEach((name) => {
      verboseLog.push(`  - ${name}`);
    });
    verboseLog.push("");
  }

  if (cardCategories.otherParseable.length > 0) {
    verboseLog.push(
      `OTHER PARSEABLE CARDS (${cardCategories.otherParseable.length}):`,
    );
    cardCategories.otherParseable.forEach((name) => {
      verboseLog.push(`  - ${name}`);
    });
    verboseLog.push("");
  }

  fs.writeFileSync(verboseLogPath, verboseLog.join("\n"), "utf-8");
  console.log(
    `  ✅ Verbose log: ${path.relative(process.cwd(), verboseLogPath)}`,
  );

  generateCardFiles(CARDS_OUTPUT_DIR, generatableCards, sets);

  // Print summary
  console.log("\n📊 Summary:");
  console.log(`  Sets: ${Object.keys(sets).length}`);
  console.log(`  Canonical Cards: ${Object.keys(canonicalCards).length}`);
  console.log(`  Printings: ${Object.keys(printings).length}`);
  console.log(`  ID Mappings: ${Object.keys(idMapping.byShortId).length}`);

  // Print card type breakdown
  const cardsByType = new Map<string, number>();
  for (const card of Object.values(canonicalCards)) {
    const count = cardsByType.get(card.cardType) || 0;
    cardsByType.set(card.cardType, count + 1);
  }
  console.log("\n  Cards by type:");
  for (const [type, count] of cardsByType.entries()) {
    console.log(`    ${type}: ${count}`);
  }

  console.log("\n🎉 Done!");
}

// Run the script
main().catch((err) => {
  console.error("❌ Error generating cards:", err);
  process.exit(1);
});
