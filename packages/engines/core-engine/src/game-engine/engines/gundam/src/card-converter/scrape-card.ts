#!/usr/bin/env bun

import { parseGundamText } from "../text-parser";
import { scrapeAndCreateGundamitoCard } from "./gundam-card-scraper";

async function main() {
  const cardNumber = process.argv[2];

  if (!cardNumber) {
    console.error("❌ Error: Please provide a card number");
    console.log("Usage: bun scrape-card.ts <CARD_NUMBER>");
    console.log("Example: bun scrape-card.ts ST01-006");
    process.exit(1);
  }

  // Validate card number format
  const cardNumberRegex = /^[A-Z0-9]+-\d{3}$/;
  if (!cardNumberRegex.test(cardNumber)) {
    console.error("❌ Error: Invalid card number format");
    console.log("Expected format: SET-XXX (e.g., ST01-006, GD01-001)");
    process.exit(1);
  }

  console.log(`🔍 Scraping card: ${cardNumber}`);
  console.log("=".repeat(50));

  try {
    // Get the card data including the effect text
    const { scrapeCardData, convertToGundamitoCard } = await import(
      "./gundam-card-scraper"
    );

    const scrapedData = await scrapeCardData(cardNumber);
    if (!scrapedData) {
      console.error("❌ Failed to scrape card data");
      process.exit(1);
    }

    const card = convertToGundamitoCard(scrapedData);
    if (!card) {
      console.error("❌ Failed to convert card data");
      process.exit(1);
    }

    // Parse the effect text if available
    if (scrapedData.effectText && card.type !== "resource") {
      console.log(`\n📝 Effect Text: "${scrapedData.effectText}"`);
      console.log("\n🔍 Parsing abilities...");

      try {
        const parseResult = parseGundamText(scrapedData.effectText);

        if (parseResult.abilities && parseResult.abilities.length > 0) {
          console.log(
            `\n✅ Successfully parsed ${parseResult.abilities.length} abilities:`,
          );
          console.log(JSON.stringify(parseResult.abilities, null, 2));

          // Add abilities to card
          // @ts-ignore - We know this card has abilities
          card.abilities = parseResult.abilities;
        } else {
          console.log("\n⚠️ No abilities parsed from the effect text");

          if (parseResult.warnings.length > 0) {
            console.log("\n⚠️ Warnings:");
            parseResult.warnings.forEach((warning) =>
              console.log(`- ${warning}`),
            );
          }

          if (parseResult.errors.length > 0) {
            console.log("\n❌ Errors:");
            parseResult.errors.forEach((error) => console.log(`- ${error}`));
          }
        }
      } catch (error) {
        console.error("\n❌ Error parsing abilities:", error);
      }
    }

    console.log("\n✅ Successfully scraped and converted card!");
    console.log("\n📋 Card Summary:");
    console.log(`- ID: ${card.id}`);
    console.log(`- Name: ${card.name}`);
    console.log(`- Type: ${card.type}`);
    console.log(`- Set: ${card.set}`);
    console.log(`- Rarity: ${card.rarity}`);

    // Handle properties that don't exist on resource cards
    if (card.type !== "resource") {
      console.log(`- Cost: ${card.cost}`);
      console.log(`- Level: ${card.level}`);
      console.log(`- Color: ${card.color}`);
    }

    if (card.type === "unit") {
      console.log(`- AP: ${card.ap}`);
      console.log(`- HP: ${card.hp}`);
      console.log(`- Zones: ${card.zones.join(", ")}`);
      console.log(`- Traits: ${card.traits.join(", ")}`);
      console.log(`- Link Requirement: ${card.linkRequirement.join(", ")}`);
    }

    if (card.type === "pilot") {
      console.log(`- AP Modifier: ${card.apModifier}`);
      console.log(`- HP Modifier: ${card.hpModifier}`);
      console.log(`- Traits: ${card.traits.join(", ")}`);
    }

    console.log("\n📄 TypeScript Object:");
    console.log("=".repeat(30));
    console.log(JSON.stringify(card, null, 2));

    console.log(
      "\n💡 You can now copy this object to use in your card definitions!",
    );
  } catch (error) {
    console.error("❌ Error during scraping:", error);
    process.exit(1);
  }
}

// Run the script
main();
