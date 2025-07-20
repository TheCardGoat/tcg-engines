#!/usr/bin/env bun

import { logger } from "~/shared/logger";
import {
  saveCardToFile,
  scrapeAllCardsInSet,
  scrapeAndCreateGundamitoCard,
  scrapeAndSaveAllCardsInSet,
} from "./gundam-card-scraper";

async function main() {
  const input = process.argv[2];

  if (!input) {
    logger.error("❌ Error: Please provide a card number or set code");
    logger.log("Usage:");
    logger.log(
      "  bun scrape-card.ts <CARD_NUMBER>              # Scrape single card",
    );
    logger.log(
      "  bun scrape-card.ts --set <SET>                # Scrape entire set",
    );
    logger.log(
      "  bun scrape-card.ts --set <SET> --save         # Scrape and save to files",
    );
    logger.log(
      "  bun scrape-card.ts <CARD_NUMBER> --save       # Scrape single card and save",
    );
    logger.log("Examples:");
    logger.log("  bun scrape-card.ts ST01-006");
    logger.log("  bun scrape-card.ts --set ST01");
    logger.log("  bun scrape-card.ts --set ST01 --save");
    process.exit(1);
  }

  // Check if scraping entire set
  if (input === "--set") {
    const setCode = process.argv[3];
    if (!setCode) {
      logger.error("❌ Error: Please provide a set code");
      logger.log("Example: bun scrape-card.ts --set ST01");
      process.exit(1);
    }

    // Validate set code format
    const setCodeRegex = /^[A-Z0-9]+$/;
    if (!setCodeRegex.test(setCode)) {
      logger.error("❌ Error: Invalid set code format");
      logger.log("Expected format: ST01, GD01, etc.");
      process.exit(1);
    }

    // Check if we should save to files
    const shouldSave = process.argv.includes("--save");

    try {
      let cards: any[];

      if (shouldSave) {
        cards = await scrapeAndSaveAllCardsInSet(setCode, true);
      } else {
        cards = await scrapeAllCardsInSet(setCode);
      }

      logger.log("\n🎉 Set scraping completed!");
      logger.log(`📊 Total cards scraped: ${cards.length}`);

      if (cards.length > 0) {
        logger.log("\n📋 Card Summary by Type:");
        const cardsByType = cards.reduce(
          (acc, card) => {
            acc[card.type] = (acc[card.type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        for (const [type, count] of Object.entries(cardsByType)) {
          logger.log(`- ${type}: ${count} card${Number(count) > 1 ? "s" : ""}`);
        }

        if (shouldSave) {
          logger.log("\n✅ All cards have been saved to definition files!");
        } else {
          logger.log(
            "\n💾 All card data has been logged above. Use --save flag to save to definition files!",
          );
        }
      }
    } catch (error) {
      logger.error("❌ Error during set scraping:", error);
      process.exit(1);
    }
    return;
  }

  // Single card scraping (existing logic)
  const cardNumber = input;

  // Validate card number format
  const cardNumberRegex = /^[A-Z0-9]+-\d{3}$/;
  if (!cardNumberRegex.test(cardNumber)) {
    logger.error("❌ Error: Invalid card number format");
    logger.log("Expected format: SET-XXX (e.g., ST01-006, GD01-001)");
    process.exit(1);
  }

  logger.log(`🔍 Scraping card: ${cardNumber}`);
  logger.log("=".repeat(50));

  // Check if we should save to file
  const shouldSave = process.argv.includes("--save");

  try {
    const result = await scrapeAndCreateGundamitoCard(cardNumber);

    if (result) {
      logger.log("\n✅ Successfully scraped and converted card!");

      // Save to file if requested
      if (shouldSave) {
        try {
          await saveCardToFile(result);
          logger.log("✅ Card saved to definition file!");
        } catch (error) {
          logger.error("❌ Error saving card to file:", error);
        }
      }

      logger.log("\n📋 Card Summary:");
      logger.log(`- ID: ${result.id}`);
      logger.log(`- Name: ${result.name}`);
      logger.log(`- Type: ${result.type}`);
      logger.log(`- Set: ${result.set}`);
      logger.log(`- Rarity: ${result.rarity}`);

      // Handle properties that don't exist on resource cards
      if (result.type !== "resource") {
        logger.log(`- Cost: ${result.cost}`);
        logger.log(`- Level: ${result.level}`);
        logger.log(`- Color: ${result.color}`);
      }

      if (result.type === "unit") {
        logger.log(`- AP: ${result.ap}`);
        logger.log(`- HP: ${result.hp}`);
        logger.log(`- Zones: ${result.zones.join(", ")}`);
        logger.log(`- Traits: ${result.traits.join(", ")}`);
        logger.log(`- Link Requirement: ${result.linkRequirement.join(", ")}`);
      }

      if (result.type === "pilot") {
        logger.log(`- AP Modifier: ${result.apModifier}`);
        logger.log(`- HP Modifier: ${result.hpModifier}`);
        logger.log(`- Traits: ${result.traits.join(", ")}`);
      }

      logger.log("\n📄 TypeScript Object:");
      logger.log("=".repeat(30));
      logger.log(JSON.stringify(result, null, 2));

      if (shouldSave) {
        logger.log("\n✅ Card has been saved to definition file!");
      } else {
        logger.log(
          "\n💡 You can now copy this object to use in your card definitions!",
        );
        logger.log(
          "💡 Use --save flag to automatically save to definition file!",
        );
      }
    } else {
      logger.log("❌ Failed to scrape and convert card");
      process.exit(1);
    }
  } catch (error) {
    logger.error("❌ Error during scraping:", error);
    process.exit(1);
  }
}

// Run the script
main();
