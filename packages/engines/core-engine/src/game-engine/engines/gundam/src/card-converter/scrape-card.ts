#!/usr/bin/env bun

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
    const result = await scrapeAndCreateGundamitoCard(cardNumber);

    if (result) {
      console.log("\n✅ Successfully scraped and converted card!");
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

      console.log(
        "\n💡 You can now copy this object to use in your card definitions!",
      );
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
