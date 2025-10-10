#!/usr/bin/env bun

/**
 * Generate from JSON CLI
 *
 * Generates TypeScript card definition files from JSON scraped data.
 * Usage: bun run scripts/generate-from-json.ts ST01
 */

import type { CardDefinition } from "../src/cards/card-types";
import { createCardDefinition } from "../tools/generator/card-generator";
import { generateSetIndex, saveCardFile } from "../tools/generator/file-writer";
import { parseCardText } from "../tools/parser/text-parser";
import {
  getAvailableSetCodes,
  getJsonFilePath,
  loadScrapedDataFromJson,
} from "../tools/storage/json-storage";

async function main() {
  const setCode = process.argv[2];

  if (!setCode) {
    const availableSets = await getAvailableSetCodes();
    console.error("❌ Error: Please provide a set code");
    console.log("\nUsage: bun run scripts/generate-from-json.ts ST01");

    if (availableSets.length > 0) {
      console.log(`\nAvailable sets: ${availableSets.join(", ")}`);
    } else {
      console.log("\n⚠️  No scraped data found. Run scrape-to-json.ts first.");
    }
    process.exit(1);
  }

  console.log(`🔧 Generating TypeScript cards from JSON: ${setCode}\n`);

  // Load scraped data from JSON
  let scrapedCards;
  try {
    scrapedCards = await loadScrapedDataFromJson(setCode);
  } catch (error) {
    console.error(`❌ Failed to load JSON for set: ${setCode}`);
    console.log(`   File: ${getJsonFilePath(setCode)}`);
    console.log("\n💡 Run scrape-to-json.ts first to generate the JSON file.");
    process.exit(1);
  }

  if (scrapedCards.length === 0) {
    console.error(`❌ No cards found in JSON for set: ${setCode}`);
    process.exit(1);
  }

  console.log(`📄 Loaded ${scrapedCards.length} cards from JSON\n`);

  // Parse and generate all cards
  console.log("🔧 Parsing and generating card definitions...\n");

  const cardDefinitions: CardDefinition[] = [];
  let successCount = 0;
  let failCount = 0;
  let warningCount = 0;

  for (const scraped of scrapedCards) {
    try {
      // Parse abilities
      const parsed = parseCardText(scraped.effectText);

      // Create card definition
      const card = createCardDefinition(scraped, parsed);

      if (!card) {
        console.error(`❌ Failed to create definition for: ${scraped.name}`);
        failCount++;
        continue;
      }

      // Save to file
      await saveCardFile(card);
      cardDefinitions.push(card);
      successCount++;

      if (parsed.warnings.length > 0) {
        warningCount += parsed.warnings.length;
        console.log(
          `   ⚠️  ${scraped.name}: ${parsed.warnings.length} parsing warnings`,
        );
        for (const warning of parsed.warnings) {
          console.log(`      - ${warning}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing ${scraped.name}:`, error);
      failCount++;
    }
  }

  // Generate set index
  console.log("\n📝 Generating set index...");
  await generateSetIndex(setCode, cardDefinitions);

  // Summary
  console.log(`\n${"=".repeat(50)}`);
  console.log(`✅ Set ${setCode} generation complete!`);
  console.log(`   Success: ${successCount} cards`);
  if (failCount > 0) {
    console.log(`   Failed: ${failCount} cards`);
  }
  if (warningCount > 0) {
    console.log(`   Warnings: ${warningCount} total`);
  }
  console.log(`${"=".repeat(50)}`);
}

if (import.meta.main) {
  main();
}
