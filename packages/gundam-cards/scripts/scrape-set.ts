#!/usr/bin/env bun

/**
 * Scrape Card Set CLI
 *
 * Usage: bun run scripts/scrape-set.ts ST01
 */

import type { CardDefinition } from "@tcg/gundam-types";
import { createCardDefinition } from "../tools/generator/card-generator";
import { generateSetIndex, saveCardFile } from "../tools/generator/file-writer";
import { parseCardText } from "../tools/parser/text-parser";
import { scrapeSet } from "../tools/scraper/card-scraper";

const ALLOWED_SETS = [
  "GD01",
  "ST01",
  "ST02",
  "ST03",
  "ST04",
  "ST05",
  "EXB-001",
];

async function main() {
  const setCode = process.argv[2];

  if (!setCode) {
    console.error("❌ Error: Please provide a set code");
    console.log("Usage: bun run scripts/scrape-set.ts ST01");
    console.log(`\nAllowed sets: ${ALLOWED_SETS.join(", ")}`);
    process.exit(1);
  }

  if (!ALLOWED_SETS.includes(setCode.toUpperCase())) {
    console.error(`❌ Error: Invalid set code: ${setCode}`);
    console.log(`\nAllowed sets: ${ALLOWED_SETS.join(", ")}`);
    process.exit(1);
  }

  console.log(`🔍 Scraping set: ${setCode}\n`);

  // Step 1: Scrape all cards in set
  const scrapedCards = await scrapeSet(setCode);

  if (scrapedCards.length === 0) {
    console.error(`❌ No cards found for set: ${setCode}`);
    process.exit(1);
  }

  console.log(`\n✅ Scraped ${scrapedCards.length} cards\n`);

  // Step 2: Parse and generate all cards
  console.log("🔧 Parsing and generating card definitions...\n");

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

      if (parsed.warnings.length > 0) {
        console.log(
          `   ⚠️  ${scraped.name}: ${parsed.warnings.length} warnings`,
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
  console.log(`\n${"=".repeat(50)}`);
  console.log(`✅ Set ${setCode} complete!`);
  console.log(`   Success: ${successCount} cards`);
  if (failCount > 0) {
    console.log(`   Failed: ${failCount} cards`);
  }
  console.log(`${"=".repeat(50)}`);
}

if (import.meta.main) {
  main();
}
