#!/usr/bin/env bun

import { mkdir, writeFile } from "fs/promises";
import path from "path";
import type { GundamitoCard } from "../cards/definitions/cardTypes";
import { generateAbilitiesFromText, parseGundamText } from "../text-parser";
import { scrapeAndCreateGundamitoCard } from "./gundam-card-scraper";

// Directory paths
const ROOT_DIR = path.resolve(
  process.cwd(),
  "packages/engines/core-engine/src/game-engine/engines/gundam/src",
);
const IMPORTS_DIR = path.join(ROOT_DIR, "cards/imports/scrape");
const DEFINITIONS_DIR = path.join(ROOT_DIR, "cards/definitions");

// Card types we handle
const CARD_TYPES = [
  "unit",
  "pilot",
  "command",
  "base",
  "resource",
  "token",
] as const;

async function main() {
  const setPrefix = process.argv[2];

  if (!setPrefix) {
    console.error("❌ Error: Please provide a set prefix");
    console.log("Usage: bun scrape-set.ts <SET_PREFIX>");
    console.log("Example: bun scrape-set.ts ST01");
    process.exit(1);
  }

  // Validate set prefix format
  const setPrefixRegex = /^[A-Z0-9]+$/;
  if (!setPrefixRegex.test(setPrefix)) {
    console.error("❌ Error: Invalid set prefix format");
    console.log("Expected format: e.g., ST01, GD01");
    process.exit(1);
  }

  console.log(`🔍 Scraping cards from set: ${setPrefix}`);
  console.log("=".repeat(50));

  // Ensure directories exist
  await ensureDirectoriesExist(setPrefix);

  // Cards array to hold all scraped cards
  const scrapedCards: GundamitoCard[] = [];
  let cardNumber = 1;
  let consecutiveFailures = 0;
  const MAX_CONSECUTIVE_FAILURES = 5; // Stop after 5 consecutive failures

  // Continue scraping until we hit consecutive failures
  while (consecutiveFailures < MAX_CONSECUTIVE_FAILURES) {
    const paddedNumber = cardNumber.toString().padStart(3, "0");
    const fullCardId = `${setPrefix}-${paddedNumber}`;

    try {
      console.log(`Scraping card: ${fullCardId}`);
      const { card, effectText } =
        await scrapeAndCreateGundamitoCardWithText(fullCardId);

      if (card) {
        // Reset failure counter on success
        consecutiveFailures = 0;

        // Parse card text and generate abilities
        const cardWithAbilities = addAbilitiesToCard(card, effectText);
        scrapedCards.push(cardWithAbilities);

        // Save card to appropriate directory
        await saveCardToDefinitions(cardWithAbilities);
        console.log(`✅ Successfully processed: ${fullCardId}`);
      } else {
        consecutiveFailures++;
        console.warn(`⚠️ Failed to scrape card: ${fullCardId}`);
      }
    } catch (error) {
      consecutiveFailures++;
      console.error(`❌ Error scraping ${fullCardId}:`, error);
    }

    cardNumber++;

    // Add a small delay between requests to be nice to the server
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // Save all cards to the imports directory
  await saveCardsToImports(setPrefix, scrapedCards);

  console.log(
    `\n✅ Completed scraping ${scrapedCards.length} cards from set ${setPrefix}`,
  );
  console.log(
    `📂 Intermediate results saved to: ${IMPORTS_DIR}/${setPrefix.toLowerCase()}.json`,
  );
  console.log(`📂 Final results saved to: ${DEFINITIONS_DIR}/${setPrefix}`);
}

/**
 * Custom wrapper for scrapeAndCreateGundamitoCard that also returns the effect text
 */
async function scrapeAndCreateGundamitoCardWithText(
  cardNumber: string,
): Promise<{ card: GundamitoCard | null; effectText: string }> {
  // Import the original function directly to access the internal scraped data
  const { scrapeCardData, convertToGundamitoCard } = await import(
    "./gundam-card-scraper"
  );

  const scrapedData = await scrapeCardData(cardNumber);

  if (!scrapedData) {
    return { card: null, effectText: "" };
  }

  const card = convertToGundamitoCard(scrapedData);
  return { card, effectText: scrapedData.effectText };
}

/**
 * Ensure that all required directories exist
 */
async function ensureDirectoriesExist(setPrefix: string) {
  // Create imports directory
  await mkdir(IMPORTS_DIR, { recursive: true });

  // Create set directory
  const setDir = path.join(DEFINITIONS_DIR, setPrefix);
  await mkdir(setDir, { recursive: true });

  // Create subdirectories for each card type
  for (const cardType of CARD_TYPES) {
    await mkdir(path.join(setDir, `${cardType}s`), { recursive: true });
  }
}

/**
 * Add abilities to card by parsing card text
 */
function addAbilitiesToCard(
  card: GundamitoCard,
  effectText: string,
): GundamitoCard {
  // Skip for resource cards as they don't have abilities
  if (card.type === "resource") return card;

  if (effectText) {
    try {
      // Parse the card text into abilities using the Gundam text parser
      console.log(`Parsing abilities for ${card.id}: "${effectText}"`);
      const result = parseGundamText(effectText);

      if (result && result.abilities && result.abilities.length > 0) {
        console.log(
          `✓ Successfully parsed ${result.abilities.length} abilities`,
        );

        // @ts-ignore - We know this card has abilities
        return {
          ...card,
          abilities: result.abilities,
        };
      }
      console.warn(`⚠️ No abilities parsed for card: ${card.id}`);
      if (result.warnings.length > 0) {
        console.warn(`Parser warnings: ${result.warnings.join(", ")}`);
      }
      if (result.errors.length > 0) {
        console.error(`Parser errors: ${result.errors.join(", ")}`);
      }
    } catch (error) {
      console.error(`❌ Error parsing abilities for ${card.id}:`, error);
    }
  } else {
    console.warn(`⚠️ No effect text found for card: ${card.id}`);
  }

  return card;
}

/**
 * Save card to appropriate definition directory
 */
async function saveCardToDefinitions(card: GundamitoCard) {
  const setPrefix = card.set;
  // Use string literal for directory naming
  const cardTypeDir = `${card.type}s`;

  const cardDir = path.join(DEFINITIONS_DIR, setPrefix, cardTypeDir);

  // Convert card name to a valid filename by replacing special characters
  const validFileName = card.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric chars with hyphens
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens

  // Create filename with format: 001-card-name.ts
  const paddedNumber = card.number.toString().padStart(3, "0");
  const fileName = `${paddedNumber}-${validFileName}.ts`;

  const filePath = path.join(cardDir, fileName);

  // Generate the card file content
  const fileContent = generateCardFileContent(card);

  await writeFile(filePath, fileContent, "utf-8");

  // Update the index.ts file to export this card
  await updateIndexFile(setPrefix, card.type, card.number, validFileName);
}

/**
 * Generate TypeScript file content for a card definition
 */
function generateCardFileContent(card: GundamitoCard): string {
  // Generate imports
  const imports = ['import type { GundamitoCard } from "../../cardTypes";'];

  // Generate card definition
  const cardObj = JSON.stringify(card, null, 2)
    // Fix quotes for proper TypeScript output
    .replace(/"([^"]+)":/g, "$1:")
    // Add export keyword
    .replace(/^{/, "export const card: GundamitoCard = {");

  return `${imports.join("\n")}\n\n${cardObj};\n`;
}

/**
 * Update the index file for a set to export the new card
 */
async function updateIndexFile(
  setPrefix: string,
  cardType: string,
  cardNumber: number,
  validFileName: string,
) {
  const typeDir = `${cardType}s`;
  const indexPath = path.join(DEFINITIONS_DIR, setPrefix, "index.ts");

  const paddedNumber = cardNumber.toString().padStart(3, "0");
  const fileName = `${paddedNumber}-${validFileName}`;

  let indexContent = "";

  try {
    // Try to read existing index file
    const fs = await import("fs/promises");

    try {
      indexContent = await fs.readFile(indexPath, "utf-8");
    } catch (error) {
      // Create new index file if it doesn't exist
      indexContent = `// ${setPrefix} Card Index\n\n`;
    }

    // Check if the export for this card already exists
    const exportStatement = `export { card as ${setPrefix}_${cardNumber} } from "./${typeDir}/${fileName}";`;

    if (!indexContent.includes(exportStatement)) {
      // Add a section header for this card type if it doesn't exist
      const typeHeader = `// ${cardType.charAt(0).toUpperCase() + cardType.slice(1)}s`;

      if (!indexContent.includes(typeHeader)) {
        indexContent += `\n${typeHeader}\n`;
      }

      // Add the export statement
      indexContent += `${exportStatement}\n`;
    }

    // Write the updated index file
    await fs.writeFile(indexPath, indexContent, "utf-8");
  } catch (error) {
    console.error(`❌ Error updating index file: ${error}`);
  }
}

/**
 * Save all cards to imports directory as JSON
 */
async function saveCardsToImports(setPrefix: string, cards: GundamitoCard[]) {
  const filePath = path.join(IMPORTS_DIR, `${setPrefix.toLowerCase()}.json`);
  await writeFile(filePath, JSON.stringify(cards, null, 2), "utf-8");
}

// Run the script
main();
