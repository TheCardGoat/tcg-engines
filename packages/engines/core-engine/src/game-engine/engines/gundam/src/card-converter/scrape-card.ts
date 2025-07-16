#!/usr/bin/env bun

import {
  saveCardToFile,
  scrapeAllCardsInSet,
  scrapeAndCreateGundamitoCard,
  scrapeAndSaveAllCardsInSet,
} from "./gundam-card-scraper";

async function main() {
  const input = process.argv[2];

  if (!input) {
    console.error("❌ Error: Please provide a card number or set code");
    console.log("Usage:");
    console.log(
      "  bun scrape-card.ts <CARD_NUMBER>              # Scrape single card",
    );
    console.log(
      "  bun scrape-card.ts --set <SET>                # Scrape entire set",
    );
    console.log(
      "  bun scrape-card.ts --set <SET> --save         # Scrape and save to files",
    );
    console.log(
      "  bun scrape-card.ts <CARD_NUMBER> --save       # Scrape single card and save",
    );
    console.log("Examples:");
    console.log("  bun scrape-card.ts ST01-006");
    console.log("  bun scrape-card.ts --set ST01");
    console.log("  bun scrape-card.ts --set ST01 --save");
    process.exit(1);
  }

  // Check if scraping entire set
  if (input === "--set") {
    const setCode = process.argv[3];
    if (!setCode) {
      console.error("❌ Error: Please provide a set code");
      console.log("Example: bun scrape-card.ts --set ST01");
      process.exit(1);
    }

    // Validate set code format
    const setCodeRegex = /^[A-Z0-9]+$/;
    if (!setCodeRegex.test(setCode)) {
      console.error("❌ Error: Invalid set code format");
      console.log("Expected format: ST01, GD01, etc.");
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

      console.log("\n🎉 Set scraping completed!");
      console.log(`📊 Total cards scraped: ${cards.length}`);

      if (cards.length > 0) {
        console.log("\n📋 Card Summary by Type:");
        const cardsByType = cards.reduce(
          (acc, card) => {
            acc[card.type] = (acc[card.type] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );

        for (const [type, count] of Object.entries(cardsByType)) {
          console.log(`- ${type}: ${count} card${count > 1 ? "s" : ""}`);
        }

        if (shouldSave) {
          console.log("\n✅ All cards have been saved to definition files!");
        } else {
          console.log(
            "\n💾 All card data has been logged above. Use --save flag to save to definition files!",
          );
        }
      }
    } catch (error) {
      console.error("❌ Error during set scraping:", error);
      process.exit(1);
    }
    return;
  }

  // Single card scraping (existing logic)
  const cardNumber = input;

  // Validate card number format
  const cardNumberRegex = /^[A-Z0-9]+-\d{3}$/;
  if (!cardNumberRegex.test(cardNumber)) {
    console.error("❌ Error: Invalid card number format");
    console.log("Expected format: SET-XXX (e.g., ST01-006, GD01-001)");
    process.exit(1);
  }

  console.log(`🔍 Scraping card: ${cardNumber}`);
  console.log("=".repeat(50));

  // Check if we should save to file
  const shouldSave = process.argv.includes("--save");

  try {
    const result = await scrapeAndCreateGundamitoCard(cardNumber);

    if (result) {
      console.log("\n✅ Successfully scraped and converted card!");

      // Save to file if requested
      if (shouldSave) {
        try {
          await saveCardToFile(result);
          console.log("✅ Card saved to definition file!");
        } catch (error) {
          console.error("❌ Error saving card to file:", error);
        }
      }

      console.log("\n📋 Card Summary:");
      console.log(`- ID: ${result.id}`);
      console.log(`- Name: ${result.name}`);
      console.log(`- Type: ${result.type}`);
      console.log(`- Set: ${result.set}`);
      console.log(`- Rarity: ${result.rarity}`);

      // Handle properties that don't exist on resource cards
      if (result.type !== "resource") {
        console.log(`- Cost: ${result.cost}`);
        console.log(`- Level: ${result.level}`);
        console.log(`- Color: ${result.color}`);
      }

      if (result.type === "unit") {
        console.log(`- AP: ${result.ap}`);
        console.log(`- HP: ${result.hp}`);
        console.log(`- Zones: ${result.zones.join(", ")}`);
        console.log(`- Traits: ${result.traits.join(", ")}`);
        console.log(`- Link Requirement: ${result.linkRequirement.join(", ")}`);
      }

      if (result.type === "pilot") {
        console.log(`- AP Modifier: ${result.apModifier}`);
        console.log(`- HP Modifier: ${result.hpModifier}`);
        console.log(`- Traits: ${result.traits.join(", ")}`);
      }

      console.log("\n📄 TypeScript Object:");
      console.log("=".repeat(30));
      console.log(JSON.stringify(result, null, 2));

      if (shouldSave) {
        console.log("\n✅ Card has been saved to definition file!");
      } else {
        console.log(
          "\n💡 You can now copy this object to use in your card definitions!",
        );
        console.log(
          "💡 Use --save flag to automatically save to definition file!",
        );
      }
    } else {
      console.log("❌ Failed to scrape and convert card");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Error during scraping:", error);
    process.exit(1);
  }
}

// Run the script
main();
