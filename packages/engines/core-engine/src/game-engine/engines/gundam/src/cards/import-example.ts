import type { GundamitoCard } from "./definitions/cardTypes";
import { type ExternalCardData, importCards } from "./import-converter";

/**
 * Example usage of the import converter
 * This file demonstrates how to convert external JSON card data
 * into the internal Gundam engine card representation
 */

// Sample external card data (as provided by the user)
const sampleExternalData: ExternalCardData[] = [
  {
    id: "ST01-001",
    code: "ST01-001",
    rarity: "LR",
    name: "Gundam",
    images: {
      small:
        "https://www.gundam-gcg.com/en/images/cards/card/ST01-001.webp?250711",
      large:
        "https://www.gundam-gcg.com/en/images/cards/card/ST01-001.webp?250711",
    },
    level: "4",
    cost: "3",
    color: "Blue",
    cardType: "UNIT",
    effect:
      "&lt;Repair 2&gt; (At the end of your turn, this Unit recovers the specified number of HP.)<br>【During Pair】During your turn, all your Units get AP+1.<br>",
    zone: "Space Earth",
    trait: "(Earth Federation) (White Base Team)",
    link: "[Amuro Ray]",
    ap: "3",
    hp: "4",
    sourceTitle: "Mobile Suit Gundam",
    getIt: "Heroic Beginnings [ST01]",
    set: { id: "st01", name: "Heroic Beginnings [ST01]" },
  },
  {
    id: "ST01-010",
    code: "ST01-010",
    rarity: "C",
    name: "Amuro Ray",
    images: {
      small:
        "https://www.gundam-gcg.com/en/images/cards/card/ST01-010.webp?250711",
      large:
        "https://www.gundam-gcg.com/en/images/cards/card/ST01-010.webp?250711",
    },
    level: "4",
    cost: "1",
    color: "Blue",
    cardType: "PILOT",
    effect:
      "【Burst】Add this card to your hand.<br>【When Paired】Choose 1 enemy Unit with 5 or less HP. Rest it.<br>",
    zone: "-",
    trait: "(Earth Federation) (White Base Team) (Newtype)",
    link: "-",
    ap: "+2",
    hp: "+1",
    sourceTitle: "Mobile Suit Gundam",
    getIt: "Heroic Beginnings [ST01]",
    set: { id: "st01", name: "Heroic Beginnings [ST01]" },
  },
  {
    id: "ST01-012",
    code: "ST01-012",
    rarity: "C",
    name: "Thoroughly Damaged",
    images: {
      small:
        "https://www.gundam-gcg.com/en/images/cards/card/ST01-012.webp?250711",
      large:
        "https://www.gundam-gcg.com/en/images/cards/card/ST01-012.webp?250711",
    },
    level: "2",
    cost: "1",
    color: "Blue",
    cardType: "COMMAND",
    effect:
      "【Main】Choose 1 rested enemy Unit. Deal 1 damage to it.<br>【Pilot】[Hayato Kobayashi]<br>",
    zone: "-",
    trait: "(Earth Federation) (White Base Team)",
    link: "-",
    ap: "+0",
    hp: "+1",
    sourceTitle: "Mobile Suit Gundam",
    getIt: "Heroic Beginnings [ST01]",
    set: { id: "st01", name: "Heroic Beginnings [ST01]" },
  },
  {
    id: "ST01-015",
    code: "ST01-015",
    rarity: "C",
    name: "White Base",
    images: {
      small:
        "https://www.gundam-gcg.com/en/images/cards/card/ST01-015.webp?250711",
      large:
        "https://www.gundam-gcg.com/en/images/cards/card/ST01-015.webp?250711",
    },
    level: "3",
    cost: "2",
    color: "Blue",
    cardType: "BASE",
    effect:
      "【Burst】Deploy this card.<br>【Deploy】Add 1 of your Shields to your hand.<br>\n【Activate･Main】【Once per Turn】②：Deploy 1 [Gundam]((White Base Team)･AP3･HP3) Unit token if you have no Units in play, deploy 1 [Guncannon]((White Base Team)･AP2･HP2) Unit token if you have only 1 Unit in play, or deploy 1 [Guntank]((White Base Team)･AP1･HP1) Unit token if you have 2 or more Units in play.<br>",
    zone: "Space Earth",
    trait: "(Earth Federation) (White Base Team) (Warship)",
    link: "-",
    ap: "-",
    hp: "5",
    sourceTitle: "Mobile Suit Gundam",
    getIt: "Heroic Beginnings [ST01]",
    set: { id: "st01", name: "Heroic Beginnings [ST01]" },
  },
];

/**
 * Example function to demonstrate the conversion process
 */
export function demonstrateCardImport(): void {
  console.log("Converting external card data to internal representation...\n");

  const result = importCards(sampleExternalData);

  console.log(`✅ Successfully converted ${result.success.length} cards`);
  console.log(`⚠️  ${result.warnings.length} warnings`);
  console.log(`❌ ${result.errors.length} errors\n`);

  // Display warnings
  if (result.warnings.length > 0) {
    console.log("Warnings:");
    result.warnings.forEach((warning) => console.log(`  - ${warning}`));
    console.log();
  }

  // Display errors
  if (result.errors.length > 0) {
    console.log("Errors:");
    result.errors.forEach((error) => {
      console.log(
        `  - Card ${error.cardId}, field ${error.field}: ${error.reason}`,
      );
    });
    console.log();
  }

  // Display successfully converted cards
  if (result.success.length > 0) {
    console.log("Successfully converted cards:");
    result.success.forEach((card) => {
      console.log(`  - ${card.id}: ${card.name} (${card.type})`);
    });
    console.log();

    // Show detailed conversion for first card
    const firstCard = result.success[0];
    console.log("Example conversion (first card):");
    console.log(
      "External format ->",
      JSON.stringify(sampleExternalData[0], null, 2),
    );
    console.log("Internal format ->", JSON.stringify(firstCard, null, 2));
  }
}

/**
 * Function to convert and save cards from a JSON file
 * This would be used when you manually add JSON files
 */
export function convertCardsFromJson(
  jsonData: ExternalCardData[],
): GundamitoCard[] {
  const result = importCards(jsonData);

  // Log results
  console.log("Conversion completed:");
  console.log(`- Success: ${result.success.length} cards`);
  console.log(`- Warnings: ${result.warnings.length}`);
  console.log(`- Errors: ${result.errors.length}`);

  if (result.errors.length > 0) {
    console.log("\nErrors encountered:");
    result.errors.forEach((error) => {
      console.log(`  ${error.cardId}: ${error.reason}`);
    });
  }

  // Here you would typically save the converted cards to your card database
  // or return them for further processing
  return result.success;
}

// Export the sample data for testing purposes
export { sampleExternalData };
