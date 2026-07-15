#!/usr/bin/env bun

/**
 * Scrape Single Card CLI
 *
 * Usage: bun run scripts/scrape-card.ts ST01-001
 */

import { createCardDefinition } from "../tools/generator/card-generator";
import { saveCardFile } from "../tools/generator/file-writer";
import { parseCardText } from "../tools/parser/text-parser";
import { scrapeCard } from "../tools/scraper/card-scraper";

async function main() {
  const cardNumber = process.argv[2];

  if (!cardNumber) {
    console.error("❌ Error: Please provide a card number");
    console.log("Usage: bun run scripts/scrape-card.ts ST01-001");
    process.exit(1);
  }

  console.log(`🔍 Scraping card: ${cardNumber}\n`);

  // Step 1: Scrape card data
  const scraped = await scrapeCard(cardNumber);

  if (!scraped) {
    console.error(`❌ Failed to scrape card: ${cardNumber}`);
    process.exit(1);
  }

  console.log(`✅ Scraped: ${scraped.name}`);
  console.log(`   Type: ${scraped.cardType}`);
  console.log(`   Rarity: ${scraped.rarity}\n`);

  // Step 2: Parse abilities
  console.log("🔧 Parsing abilities...");
  const parsed = parseCardText(scraped.effectText);

  console.log(`   Keywords: ${parsed.keywords.length}`);
  console.log(`   Effects: ${parsed.effects.length}`);

  if (parsed.warnings.length > 0) {
    console.log(`   ⚠️  Warnings: ${parsed.warnings.length}`);
    for (const warning of parsed.warnings) {
      console.log(`      - ${warning}`);
    }
  }
  console.log();

  // Step 3: Create card definition
  const card = createCardDefinition(scraped, parsed);

  if (!card) {
    console.error("❌ Failed to create card definition");
    process.exit(1);
  }

  // Step 4: Save to file
  console.log("💾 Saving card definition...");
  const filepath = await saveCardFile(card);

  console.log("\n✅ Successfully created card definition!");
  console.log(`   File: ${filepath}`);
}

if (import.meta.main) {
  main();
}
