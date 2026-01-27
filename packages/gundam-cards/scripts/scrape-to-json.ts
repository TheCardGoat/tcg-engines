#!/usr/bin/env bun

/**
 * Scrape to JSON CLI
 *
 * Scrapes cards from the official website and saves raw data to JSON files.
 * Usage: bun run scripts/scrape-to-json.ts ST01
 */

import { scrapeCard, scrapeSet } from "../tools/scraper/card-scraper";
import {
  getJsonFilePath,
  saveScrapedDataToJson,
} from "../tools/storage/json-storage";

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
  const input = process.argv[2];

  if (!input) {
    console.error("❌ Error: Please provide a card number or set code");
    console.log("\nUsage:");
    console.log(
      "  Scrape single card: bun run scripts/scrape-to-json.ts ST01-001",
    );
    console.log("  Scrape full set:    bun run scripts/scrape-to-json.ts ST01");
    console.log(`\nAllowed sets: ${ALLOWED_SETS.join(", ")}`);
    process.exit(1);
  }

  // Determine if it's a card number or set code
  const isCardNumber = input.includes("-");

  if (isCardNumber) {
    await scrapeSingleCard(input);
  } else {
    await scrapeFullSet(input);
  }
}

async function scrapeSingleCard(cardNumber: string) {
  console.log(`🔍 Scraping card: ${cardNumber}\n`);

  const scraped = await scrapeCard(cardNumber);

  if (!scraped) {
    console.error(`❌ Failed to scrape card: ${cardNumber}`);
    process.exit(1);
  }

  console.log(`✅ Scraped: ${scraped.name}`);
  console.log(`   Type: ${scraped.cardType}`);
  console.log(`   Rarity: ${scraped.rarity}\n`);

  // Extract set code from card number
  const setCode = cardNumber.split("-")[0];

  // Save to JSON (will update existing file or create new one)
  const { saveScrapedCardToJson } = await import(
    "../tools/storage/json-storage"
  );
  const filepath = await saveScrapedCardToJson(scraped, setCode);

  console.log("💾 Saved to JSON:");
  console.log(`   File: ${filepath}`);
  console.log("\n✅ Done!");
}

async function scrapeFullSet(setCode: string) {
  if (!ALLOWED_SETS.includes(setCode.toUpperCase())) {
    console.error(`❌ Error: Invalid set code: ${setCode}`);
    console.log(`\nAllowed sets: ${ALLOWED_SETS.join(", ")}`);
    process.exit(1);
  }

  console.log(`🔍 Scraping set: ${setCode}\n`);

  // Scrape all cards in set
  const scrapedCards = await scrapeSet(setCode);

  if (scrapedCards.length === 0) {
    console.error(`❌ No cards found for set: ${setCode}`);
    process.exit(1);
  }

  console.log(`\n✅ Scraped ${scrapedCards.length} cards\n`);

  // Save to JSON
  console.log("💾 Saving to JSON...");
  const filepath = await saveScrapedDataToJson(scrapedCards, setCode);

  console.log(`   File: ${filepath}`);
  console.log(`   Cards: ${scrapedCards.length}`);

  // Summary
  console.log(`\n${"=".repeat(50)}`);
  console.log(`✅ Set ${setCode} scraped successfully!`);
  console.log(`   Total cards: ${scrapedCards.length}`);
  console.log(`   JSON file: ${getJsonFilePath(setCode)}`);
  console.log(`${"=".repeat(50)}`);
  console.log("\nNext steps:");
  console.log(
    `  Generate TypeScript cards: bun run scripts/generate-from-json.ts ${setCode}`,
  );
}

if (import.meta.main) {
  main();
}
