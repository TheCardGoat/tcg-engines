#!/usr/bin/env bun

/**
 * Regenerate All Sets
 *
 * Regenerates all scraped card sets with the fixed scraper.
 */

import type { CardDefinition } from "@tcg/gundam-types";
import { createCardDefinition } from "../tools/generator/card-generator";
import { generateSetIndex, saveCardFile } from "../tools/generator/file-writer";
import { parseCardText } from "../tools/parser/text-parser";
import { scrapeSet } from "../tools/scraper/card-scraper";

const SETS_TO_REGENERATE = ["GD01", "ST01", "ST02", "ST03", "ST04", "ST05"];

async function regenerateSet(setCode: string) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(`🔄 Regenerating set: ${setCode}`);
  console.log(`${"=".repeat(60)}\n`);

  try {
    // Step 1: Scrape all cards in set
    const scrapedCards = await scrapeSet(setCode);

    if (scrapedCards.length === 0) {
      console.error(`❌ No cards found for set: ${setCode}`);
      return { success: false, count: 0 };
    }

    console.log(`\n✅ Scraped ${scrapedCards.length} cards\n`);

    // Step 2: Parse and generate all cards
    console.log("🔧 Generating card definitions...\n");

    const cardDefinitions: CardDefinition[] = [];
    let successCount = 0;
    let failCount = 0;

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

        // Show progress every 10 cards
        if (successCount % 10 === 0) {
          console.log(
            `   ✅ Progress: ${successCount}/${scrapedCards.length} cards`,
          );
        }
      } catch (error) {
        console.error(`❌ Error processing ${scraped.name}:`, error);
        failCount++;
      }
    }

    // Step 3: Generate set index
    console.log("\n📝 Generating set index...");
    await generateSetIndex(setCode, cardDefinitions);

    // Summary
    console.log(`\n✅ Set ${setCode} complete!`);
    console.log(`   Success: ${successCount} cards`);
    if (failCount > 0) {
      console.log(`   Failed: ${failCount} cards`);
    }

    return { success: true, count: successCount };
  } catch (error) {
    console.error(`❌ Error regenerating set ${setCode}:`, error);
    return { success: false, count: 0 };
  }
}

async function main() {
  console.log("\n🚀 Starting batch regeneration of all card sets...\n");

  const startTime = Date.now();
  const results: Record<string, { success: boolean; count: number }> = {};

  for (const setCode of SETS_TO_REGENERATE) {
    const result = await regenerateSet(setCode);
    results[setCode] = result;

    // Add a small delay between sets to avoid overwhelming the server
    if (SETS_TO_REGENERATE.indexOf(setCode) < SETS_TO_REGENERATE.length - 1) {
      console.log("\n⏳ Waiting 5 seconds before next set...\n");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }

  // Final summary
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000 / 60).toFixed(2);

  console.log(`\n${"=".repeat(60)}`);
  console.log("🎉 REGENERATION COMPLETE!");
  console.log(`${"=".repeat(60)}`);
  console.log(`\nTotal time: ${duration} minutes\n`);

  let totalSuccess = 0;
  let totalFailed = 0;

  for (const [setCode, result] of Object.entries(results)) {
    if (result.success) {
      console.log(`✅ ${setCode}: ${result.count} cards regenerated`);
      totalSuccess += result.count;
    } else {
      console.log(`❌ ${setCode}: Failed to regenerate`);
      totalFailed++;
    }
  }

  console.log(`\n📊 Total: ${totalSuccess} cards regenerated`);
  if (totalFailed > 0) {
    console.log(`   ${totalFailed} sets failed`);
  }
  console.log();
}

if (import.meta.main) {
  main().catch(console.error);
}
