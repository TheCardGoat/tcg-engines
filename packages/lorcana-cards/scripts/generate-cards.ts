#!/usr/bin/env bun
/**
 * Card Generation Script
 *
 * Generates card data from ravensburger-input.json and lorcast-input.json
 * into the src/data directory.
 *
 * Data source strategy:
 *   - Card text: Lorcast (has symbols like {S}, {I}, {L})
 *   - All other data: Ravensburger (stats, images, set info)
 *
 * Usage:
 *   bun packages/lorcana-cards/scripts/generate-cards.ts
 *
 * Output files:
 *   - src/data/sets.json
 *   - src/data/canonical-cards.json
 *   - src/data/printings.json
 *   - src/data/id-mapping.json
 */

import fs from "node:fs";
import path from "node:path";
import { generateCanonicalCards } from "./generators/canonical-generator";
import { createIdMapping } from "./generators/id-generator";
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

const OUTPUT_DIR = path.resolve(__dirname, "../src/data");
const ID_MAPPING_PATH = path.resolve(OUTPUT_DIR, "id-mapping.json");

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

  console.log("📦 Processing cards...");
  const allCards = getAllCards(input);
  console.log(`  Found ${allCards.length} total card entries`);

  // Get unique deck_building_ids
  const deckBuildingIds = getUniqueDeckBuildingIds(allCards);
  console.log(`  Found ${deckBuildingIds.length} unique game cards`);

  // Create or update ID mapping
  console.log("🔑 Generating short IDs...");
  const existingMapping = loadExistingIdMapping();
  const idMapping = createIdMapping(deckBuildingIds, existingMapping);
  console.log(`  Generated ${Object.keys(idMapping.byShortId).length} IDs`);

  // Generate sets
  console.log("📚 Generating sets...");
  const cardSets = getCardSets(input);
  const sets = generateSets(cardSets);
  console.log(`  Found ${Object.keys(sets).length} sets`);

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

  // Write output files
  console.log("📝 Writing output files...");

  writeJson(path.join(OUTPUT_DIR, "sets.json"), sets);
  console.log("  ✅ sets.json");

  writeJson(path.join(OUTPUT_DIR, "canonical-cards.json"), canonicalCards);
  console.log("  ✅ canonical-cards.json");

  writeJson(path.join(OUTPUT_DIR, "printings.json"), printings);
  console.log("  ✅ printings.json");

  writeJson(ID_MAPPING_PATH, idMapping);
  console.log("  ✅ id-mapping.json");

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
