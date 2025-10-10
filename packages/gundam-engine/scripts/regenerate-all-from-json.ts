#!/usr/bin/env bun

/**
 * Regenerate All from JSON CLI
 *
 * Regenerates all TypeScript card definition files from all available JSON data.
 * Usage: bun run scripts/regenerate-all-from-json.ts
 */

import type { CardDefinition } from "../src/cards/card-types";
import { createCardDefinition } from "../tools/generator/card-generator";
import {
  generateMasterIndex,
  generateSetIndex,
  saveCardFile,
} from "../tools/generator/file-writer";
import { parseCardText } from "../tools/parser/text-parser";
import {
  getAvailableSetCodes,
  loadScrapedDataFromJson,
} from "../tools/storage/json-storage";

async function main() {
  console.log("🔧 Regenerating all TypeScript cards from JSON data\n");

  // Get all available sets
  const setCodes = await getAvailableSetCodes();

  if (setCodes.length === 0) {
    console.error("❌ No scraped data found");
    console.log("\n💡 Run scrape-to-json.ts first to generate JSON files.");
    process.exit(1);
  }

  console.log(`📊 Found ${setCodes.length} sets: ${setCodes.join(", ")}\n`);

  const allSetCodes: string[] = [];
  let totalSuccess = 0;
  let totalFail = 0;
  let totalWarnings = 0;

  // Process each set
  for (const setCode of setCodes) {
    console.log(`\n${"=".repeat(50)}`);
    console.log(`📦 Processing set: ${setCode}`);
    console.log("=".repeat(50));

    try {
      const result = await processSet(setCode);
      allSetCodes.push(setCode);
      totalSuccess += result.successCount;
      totalFail += result.failCount;
      totalWarnings += result.warningCount;

      console.log(`\n✅ ${setCode} complete:`);
      console.log(`   Success: ${result.successCount} cards`);
      if (result.failCount > 0) {
        console.log(`   Failed: ${result.failCount} cards`);
      }
      if (result.warningCount > 0) {
        console.log(`   Warnings: ${result.warningCount} total`);
      }
    } catch (error) {
      console.error(`\n❌ Failed to process set ${setCode}:`, error);
      totalFail++;
    }
  }

  // Generate master index
  console.log(`\n${"=".repeat(50)}`);
  console.log("📝 Generating master index...");
  await generateMasterIndex(allSetCodes);

  // Final summary
  console.log(`\n${"=".repeat(60)}`);
  console.log("✅ All sets regenerated successfully!");
  console.log("=".repeat(60));
  console.log("📊 Summary:");
  console.log(`   Sets processed: ${allSetCodes.length}`);
  console.log(`   Total cards generated: ${totalSuccess}`);
  if (totalFail > 0) {
    console.log(`   Total failures: ${totalFail}`);
  }
  if (totalWarnings > 0) {
    console.log(`   Total warnings: ${totalWarnings}`);
  }
  console.log("=".repeat(60));
}

async function processSet(setCode: string): Promise<{
  successCount: number;
  failCount: number;
  warningCount: number;
}> {
  // Load scraped data
  const scrapedCards = await loadScrapedDataFromJson(setCode);

  if (scrapedCards.length === 0) {
    console.log(`⚠️  No cards found in JSON for set: ${setCode}`);
    return { successCount: 0, failCount: 0, warningCount: 0 };
  }

  console.log(`📄 Loaded ${scrapedCards.length} cards from JSON`);

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
        console.error(`   ❌ Failed to create definition for: ${scraped.name}`);
        failCount++;
        continue;
      }

      // Save to file
      await saveCardFile(card);
      cardDefinitions.push(card);
      successCount++;

      if (parsed.warnings.length > 0) {
        warningCount += parsed.warnings.length;
        // Only show first warning to avoid cluttering output
        if (warningCount === parsed.warnings.length) {
          console.log(
            `   ⚠️  ${scraped.name}: ${parsed.warnings.length} parsing warnings`,
          );
        }
      }
    } catch (error) {
      console.error(`   ❌ Error processing ${scraped.name}:`, error);
      failCount++;
    }
  }

  // Generate set index
  await generateSetIndex(setCode, cardDefinitions);

  return { successCount, failCount, warningCount };
}

if (import.meta.main) {
  main();
}
