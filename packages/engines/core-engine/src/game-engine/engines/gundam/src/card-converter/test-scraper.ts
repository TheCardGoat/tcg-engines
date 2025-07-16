import { scrapeAndCreateGundamitoCard } from "./gundam-card-scraper";

async function testScraper() {
  const cardNumber = "ST01-006";

  console.log(`Testing scraper with card: ${cardNumber}`);
  console.log("=".repeat(50));

  try {
    const result = await scrapeAndCreateGundamitoCard(cardNumber);

    if (result) {
      console.log("\n✅ Successfully scraped and converted card!");
      console.log("Card details:");
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

      console.log("\nFull object:");
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log("❌ Failed to scrape and convert card");
    }
  } catch (error) {
    console.error("❌ Error during scraping:", error);
  }
}

// Run the test
testScraper();
