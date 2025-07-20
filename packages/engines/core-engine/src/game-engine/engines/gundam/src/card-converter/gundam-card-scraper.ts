import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";
import { logger } from "~/game-engine/core-engine/utils";
import type {
  CardColor,
  CardRarity,
  CardZones,
  GundamitoCardSet,
  GundamitoCardType,
  Traits,
} from "../../shared-types";
import type {
  GundamitoBaseCard,
  GundamitoCard,
  GundamitoCommandCard,
  GundamitoPilotCard,
  GundamitoResourceCard,
  GundamitoUnitCard,
} from "../cards/definitions/cardTypes";
import { parseGundamText } from "../text-parser";

interface ScrapedCardData {
  cardNumber: string;
  rarity: string;
  blockIcon: string;
  cardName: string;
  level: string;
  cost: string;
  color: string;
  type: string;
  effectText: string;
  zone: string;
  trait: string;
  link: string;
  ap: string;
  hp: string;
  sourceTitle: string;
  productInfo: string;
  imageUrl: string;
}

/**
 * Scrapes card data from the Gundam Card Game website
 */
export async function scrapeCardData(
  cardNumber: string,
): Promise<ScrapedCardData | null> {
  const url = `https://www.gundam-gcg.com/en/cards/detail.php?detailSearch=${cardNumber}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Check if we were redirected to the homepage or a different URL
    if (response.url !== url) {
      logger.log(
        `Card ${cardNumber} redirected from ${url} to ${response.url}`,
      );

      // If redirected to homepage, index, or root directory, this card doesn't exist
      if (
        response.url.includes("/en/index.php") ||
        response.url.endsWith("/en/") ||
        response.url.endsWith("/en") ||
        !response.url.includes("detail.php")
      ) {
        logger.log(
          `Card ${cardNumber} appears to not exist (redirected to homepage)`,
        );
        return null;
      }
    }

    const html = await response.text();
    return parseCardHTML(html);
  } catch (error) {
    logger.error(`Error scraping card ${cardNumber}:`, error);
    return null;
  }
}

/**
 * Parses HTML content to extract card data
 */
function isValidCardPage(html: string): boolean {
  // Check if this is a valid card page vs the default page with just logo
  const hasCardNumber = html.includes('class="cardNo"');
  const hasCardName = html.includes('class="cardName"');
  const hasDataBoxes = html.includes('class="dataBox');

  // Check for homepage indicators
  const isHomepage =
    html.includes("The GANDAM CARD GAME launches on Friday") ||
    html.includes("LEARN TO PLAY") ||
    html.includes("Start playing the GUNDAM CARD GAME") ||
    html.includes("WHAT'S NEW");

  // Check for logo-only page (another indicator of invalid card)
  const isLogoOnly =
    html.includes("/en/images/common/logo.png") && !hasCardNumber;

  // Must have card elements and not be homepage/logo-only
  const isValid =
    hasCardNumber && hasCardName && hasDataBoxes && !isHomepage && !isLogoOnly;

  if (!isValid) {
    logger.log("Invalid card page detected:", {
      hasCardNumber,
      hasCardName,
      hasDataBoxes,
      isHomepage,
      isLogoOnly,
    });
  }

  return isValid;
}

function parseCardHTML(html: string): ScrapedCardData | null {
  try {
    // Check if this is a valid card page first
    if (!isValidCardPage(html)) {
      return null;
    }

    // Extract card number
    const cardNumberMatch = html.match(
      /<div class="cardNo">\s*([^<]+)\s*<\/div>/,
    );
    const cardNumber = cardNumberMatch?.[1]?.trim() || "";

    // Extract rarity
    const rarityMatch = html.match(/<div class="rarity">\s*([^<]+)\s*<\/div>/);
    const rarity = rarityMatch?.[1]?.trim() || "";

    // Extract block icon
    const blockIconMatch = html.match(/<div class="blockIcon">([^<]+)<\/div>/);
    const blockIcon = blockIconMatch?.[1]?.trim() || "";

    // Extract card name
    const cardNameMatch = html.match(/<h1 class="cardName">([^<]+)<\/h1>/);
    const cardName = cardNameMatch?.[1]?.trim() || "";

    // Extract image URL from cardImage div
    const cardImageMatch = html.match(
      /<div class="cardImage">\s*<img src=\s*"([^"]+)"[^>]*>/,
    );
    const imageUrl = cardImageMatch?.[1]?.trim() || "";

    // Extract all data fields using a more comprehensive approach
    const dataFields: Record<string, string> = {};

    // Match all data boxes
    const dataBoxMatches = html.matchAll(
      /<dl class="dataBox[^"]*">\s*<dt class="dataTit">([^<]+)<\/dt>\s*<dd class="dataTxt[^"]*">([^<]+)<\/dd>\s*<\/dl>/g,
    );

    for (const match of dataBoxMatches) {
      const key = match[1].trim();
      const value = match[2].trim();
      dataFields[key] = value;
    }

    // Extract effect text (overview section) - capture everything including pilot info
    const effectMatch = html.match(
      /<div class="cardDataRow overview">\s*<div class="dataTxt isRegular">\s*(.*?)\s*<\/div>/s,
    );
    const effectText = effectMatch?.[1]?.trim().replace(/<br>/g, "\n") || "";

    return {
      cardNumber,
      rarity,
      blockIcon,
      cardName,
      level: dataFields["Lv."] || "",
      cost: dataFields["COST"] || "",
      color: dataFields["COLOR"] || "",
      type: dataFields["TYPE"] || "",
      effectText,
      zone: dataFields["Zone"] || "",
      trait: dataFields["Trait"] || "",
      link: dataFields["Link"] || "",
      ap: dataFields["AP"] || "",
      hp: dataFields["HP"] || "",
      sourceTitle: dataFields["Source Title"] || "",
      productInfo: dataFields["Where to get it"] || "",
      imageUrl,
    };
  } catch (error) {
    logger.error("Error parsing HTML:", error);
    return null;
  }
}

/**
 * Converts scraped data to GundamitoCard
 */
export function convertToGundamitoCard(
  data: ScrapedCardData,
): GundamitoCard | null {
  try {
    // Parse basic info
    const cardType = convertCardType(data.type);
    const color = convertColor(data.color);
    const rarity = convertRarity(data.rarity);
    const set = extractCardSet(data.cardNumber);
    const number = extractCardNumber(data.cardNumber);

    const baseCard = {
      id: generateCardId(data.cardNumber, data.cardName),
      implemented: false,
      missingTestCase: true,
      cost: Number.parseInt(data.cost, 10) || 0,
      level: Number.parseInt(data.level, 10) || 1,
      number,
      name: data.cardName,
      color,
      set,
      rarity,
      imageUrl: data.imageUrl,
    };

    // Handle different card types
    switch (cardType) {
      case "unit": {
        const zones = parseZones(data.zone);
        const traits = parseTraits(data.trait);
        const linkRequirement = parseLinkRequirement(data.link);

        return {
          ...baseCard,
          type: "unit",
          zones,
          traits,
          linkRequirement,
          ap: Number.parseInt(data.ap, 10) || 0,
          hp: Number.parseInt(data.hp, 10) || 1,
          abilities: parseAbilitiesFromText(data.effectText),
          text: data.effectText,
        } as GundamitoUnitCard;
      }

      case "pilot": {
        const traits = parseTraits(data.trait);
        const apModifier = data.ap.startsWith("+")
          ? Number.parseInt(data.ap.replace("+", ""), 10) || 0
          : Number.parseInt(data.ap, 10) || 0;
        const hpModifier = data.hp.startsWith("+")
          ? Number.parseInt(data.hp.replace("+", ""), 10) || 0
          : Number.parseInt(data.hp, 10) || 0;

        return {
          ...baseCard,
          type: "pilot",
          traits,
          apModifier,
          hpModifier,
          abilities: parseAbilitiesFromText(data.effectText),
          text: data.effectText,
        } as GundamitoPilotCard;
      }

      case "command": {
        // Check if this command has pilot properties
        const pilotInfo = parsePilotInfo(data.effectText);
        const traits = parseTraits(data.trait);

        if (pilotInfo) {
          const apModifier = data.ap.startsWith("+")
            ? Number.parseInt(data.ap.replace("+", ""), 10) || 0
            : Number.parseInt(data.ap, 10) || 0;
          const hpModifier = data.hp.startsWith("+")
            ? Number.parseInt(data.hp.replace("+", ""), 10) || 0
            : Number.parseInt(data.hp, 10) || 0;

          return {
            ...baseCard,
            type: "command",
            subType: "pilot",
            pilotName: pilotInfo,
            traits,
            apModifier,
            hpModifier,
            abilities: parseAbilitiesFromText(data.effectText),
            text: data.effectText,
          } as GundamitoCommandCard;
        }

        return {
          ...baseCard,
          type: "command",
          abilities: parseAbilitiesFromText(data.effectText),
          text: data.effectText,
        } as GundamitoCommandCard;
      }

      case "base": {
        const zones = parseZones(data.zone);
        const traits = parseTraits(data.trait);

        return {
          ...baseCard,
          type: "base",
          zones,
          traits,
          abilities: parseAbilitiesFromText(data.effectText),
          text: data.effectText,
          ap: Number.parseInt(data.ap, 10) || 0,
          hp: Number.parseInt(data.hp, 10) || 1,
        } as GundamitoBaseCard;
      }

      case "resource": {
        return {
          id: baseCard.id,
          implemented: baseCard.implemented,
          missingTestCase: baseCard.missingTestCase,
          name: baseCard.name,
          number: baseCard.number,
          set: baseCard.set,
          rarity: baseCard.rarity,
          type: "resource",
        } as GundamitoResourceCard;
      }

      default: {
        logger.warn(`Unknown card type: ${data.type}`);
        return null;
      }
    }
  } catch (error) {
    logger.error("Error converting to GundamitoCard:", error);
    return null;
  }
}

/**
 * Helper functions for data conversion
 */
function convertCardType(type: string): GundamitoCardType {
  const normalizedType = type.toLowerCase();
  switch (normalizedType) {
    case "unit":
      return "unit";
    case "pilot":
      return "pilot";
    case "command":
      return "command";
    case "base":
      return "base";
    case "resource":
      return "resource";
    default:
      logger.warn(`Unknown card type: ${type}, defaulting to unit`);
      return "unit";
  }
}

function convertColor(color: string): CardColor {
  const normalizedColor = color.toLowerCase();
  switch (normalizedColor) {
    case "blue":
      return "blue";
    case "white":
      return "white";
    case "green":
      return "green";
    case "red":
      return "red";
    default:
      logger.warn(`Unknown color: ${color}, defaulting to blue`);
      return "blue";
  }
}

function convertRarity(rarity: string): CardRarity {
  const normalizedRarity = rarity.toLowerCase();
  switch (normalizedRarity) {
    case "c":
    case "common":
      return "common";
    case "u":
    case "uncommon":
      return "uncommon";
    case "r":
    case "rare":
      return "rare";
    case "sr":
    case "super_rare":
      return "super_rare";
    case "lr":
    case "legendary":
      return "legendary";
    default:
      logger.warn(`Unknown rarity: ${rarity}, defaulting to common`);
      return "common";
  }
}

function extractCardSet(cardNumber: string): GundamitoCardSet {
  const setMatch = cardNumber.match(/^([A-Z0-9]+)-/);
  const setCode = setMatch?.[1] || "";

  switch (setCode) {
    case "ST01":
      return "ST01";
    case "ST02":
      return "ST02";
    case "ST03":
      return "ST03";
    case "ST04":
      return "ST04";
    case "ST05":
      return "ST05";
    case "ST06":
      return "ST06";
    case "GD01":
      return "GD01";
    case "GD02":
      return "GD02";
    case "EXBP":
      return "EXBP";
    default:
      logger.warn(`Unknown set: ${setCode}, defaulting to ST01`);
      return "ST01";
  }
}

function extractCardNumber(cardId: string): number {
  const numberMatch = cardId.match(/-(\d+)$/);
  return Number.parseInt(numberMatch?.[1] || "1", 10);
}

function generateCardId(cardNumber: string, cardName: string): string {
  // Extract set and number from cardNumber (e.g., "ST01-006" -> "ST01" and "006")
  const match = cardNumber.match(/^([A-Z0-9]+)-(\d+)$/);
  if (!match) {
    logger.warn(`Invalid card number format: ${cardNumber}`);
    return cardNumber; // fallback to original
  }

  const [, set, number] = match;
  return `${set}-${number.padStart(3, "0")}`;
}

function parseAbilitiesFromText(effectText: string): any[] {
  if (!effectText || effectText.trim() === "") {
    return [];
  }

  try {
    // Clean the HTML entities from the effect text
    const cleanText = effectText
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/<br>/g, " ")
      .replace(/<\/br>/g, " ")
      .trim();

    logger.log(`Parsing abilities from text: "${cleanText}"`);

    const result = parseGundamText(cleanText, { debug: false });

    if (result.abilities && result.abilities.length > 0) {
      logger.log(`Generated ${result.abilities.length} abilities`);
      if (result.warnings.length > 0) {
        logger.log(`Warnings: ${result.warnings.join(", ")}`);
      }
      if (result.errors.length > 0) {
        logger.log(`Errors: ${result.errors.join(", ")}`);
      }
      return result.abilities;
    }

    return [];
  } catch (error) {
    logger.warn(`Error parsing abilities from text "${effectText}":`, error);
    return [];
  }
}

function parseZones(zoneText: string): CardZones[] {
  if (!zoneText) return [];

  const zones: CardZones[] = [];
  const normalizedZones = zoneText.toLowerCase();

  if (normalizedZones.includes("space")) {
    zones.push("space");
  }
  if (normalizedZones.includes("earth")) {
    zones.push("earth");
  }

  return zones;
}

function parseTraits(traitText: string): Traits[] {
  if (!traitText || traitText.trim() === "" || traitText.trim() === "-") {
    return [];
  }

  // Remove parentheses and split by common delimiters
  const cleanTraitText = traitText.replace(/[()]/g, "").toLowerCase();
  const traitParts = cleanTraitText
    .split(/[,\s]+/)
    .filter((part) => part.length > 0 && part !== "-");

  const traits: Traits[] = [];
  const unknownTraits: string[] = [];

  // Map common trait patterns
  const traitMappings: Record<string, Traits> = {
    academy: "academy",
    earth: "earth federation",
    federation: "earth federation",
    zeon: "zeon",
    oz: "oz",
    newtype: "newtype",
    civilian: "civilian",
    stronghold: "stronghold",
    warship: "warship",
  };

  for (const part of traitParts) {
    let matched = false;

    for (const [key, trait] of Object.entries(traitMappings)) {
      if (part.includes(key)) {
        if (!traits.includes(trait)) {
          traits.push(trait);
        }
        matched = true;
        break; // Found a match, no need to check other mappings
      }
    }

    // Track unknown traits for logging (exclude empty/null indicators)
    if (!matched && part.trim().length > 0 && part !== "-") {
      unknownTraits.push(part);
    }
  }

  // Log unknown traits to help with discovery
  if (unknownTraits.length > 0) {
    logger.warn(
      `🔍 Unknown traits found in "${traitText}": [${unknownTraits.join(", ")}]`,
    );
    logger.warn(
      "   Consider adding these to the Traits type and traitMappings",
    );
  }

  return traits;
}

function parseLinkRequirement(linkText: string): string[] {
  if (!linkText) return [];

  // Remove brackets and split by commas
  const cleanLinkText = linkText.replace(/[[\]]/g, "");
  return cleanLinkText
    .split(",")
    .map((link) => link.trim().toLowerCase())
    .filter((link) => link.length > 0);
}

function parsePilotInfo(effectText: string): string | null {
  // Look for 【Pilot】[Name] pattern in the effect text
  const pilotMatch = effectText.match(/【Pilot】\[([^\]]+)\]/);
  return pilotMatch ? pilotMatch[1].trim() : null;
}

/**
 * Main function to scrape and convert a card
 */
export async function scrapeAndCreateGundamitoCard(
  cardNumber: string,
): Promise<GundamitoCard | null> {
  logger.log(`Scraping card: ${cardNumber}`);

  const scrapedData = await scrapeCardData(cardNumber);
  if (!scrapedData) {
    logger.error(`Failed to scrape data for card: ${cardNumber}`);
    return null;
  }

  logger.log("Scraped data:", scrapedData);

  const gundamitoCard = convertToGundamitoCard(scrapedData);
  if (!gundamitoCard) {
    logger.error(
      `Failed to convert scraped data to GundamitoCard for: ${cardNumber}`,
    );
    return null;
  }

  logger.log(
    "Generated GundamitoCard:",
    JSON.stringify(gundamitoCard, null, 2),
  );

  return gundamitoCard;
}

/**
 * Scrapes all cards in a set by trying sequential numbers until failure
 */
export async function scrapeAllCardsInSet(
  setCode: string,
): Promise<GundamitoCard[]> {
  logger.log(`🔍 Scraping all cards in set: ${setCode}`);
  logger.log("=".repeat(50));

  const cards: GundamitoCard[] = [];
  const discoveredTraits = new Set<string>();
  let currentNumber = 1;
  let consecutiveFailures = 0;
  const maxConsecutiveFailures = 3; // Stop after 3 consecutive failures

  while (consecutiveFailures < maxConsecutiveFailures) {
    const cardNumber = `${setCode}-${currentNumber.toString().padStart(3, "0")}`;
    logger.log(`\n🔍 Attempting to scrape: ${cardNumber}`);

    try {
      const card = await scrapeAndCreateGundamitoCard(cardNumber);
      if (card) {
        cards.push(card);
        consecutiveFailures = 0; // Reset failure counter
        logger.log(`✅ Successfully scraped: ${cardNumber} - ${card.name}`);

        // Collect traits for discovery report
        if ("traits" in card && Array.isArray(card.traits)) {
          card.traits.forEach((trait) => discoveredTraits.add(trait));
        }
      } else {
        consecutiveFailures++;
        logger.log(
          `❌ Failed to scrape: ${cardNumber} (${consecutiveFailures}/${maxConsecutiveFailures})`,
        );
      }
    } catch (error) {
      consecutiveFailures++;
      logger.log(
        `❌ Error scraping ${cardNumber}: ${error} (${consecutiveFailures}/${maxConsecutiveFailures})`,
      );
    }

    currentNumber++;

    // Add a small delay to avoid overwhelming the server
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  logger.log(`\n📊 Scraping complete for set ${setCode}`);
  logger.log(`✅ Successfully scraped ${cards.length} cards`);
  logger.log(
    `📋 Cards found: ${cards.map((c) => `${c.name} (${c.type})`).join(", ")}`,
  );

  if (discoveredTraits.size > 0) {
    logger.log(
      `\n🔍 Traits discovered in ${setCode}: [${Array.from(discoveredTraits).sort().join(", ")}]`,
    );
  }

  return cards;
}

/**
 * Creates the file path for a card based on its properties
 */
function createCardFilePath(card: GundamitoCard): string {
  const basePath = join(
    dirname(import.meta.url.replace("file://", "")),
    "../cards/definitions",
  );

  // Determine the card type folder name
  let cardTypeFolder: string;
  switch (card.type) {
    case "unit":
      cardTypeFolder = "units";
      break;
    case "pilot":
      cardTypeFolder = "pilots";
      break;
    case "command":
      cardTypeFolder = "commands";
      break;
    case "base":
      cardTypeFolder = "bases";
      break;
    case "resource":
      cardTypeFolder = "resources";
      break;
    default:
      cardTypeFolder = "unknown";
  }

  // Create the filename with three-digit number and kebab-case name
  const numberMatch = card.id.match(/^[A-Z0-9]+-(\d+)$/);
  const cardNumber = numberMatch?.[1] || "1";
  const threeDigitNumber = cardNumber.padStart(3, "0");
  const kebabCaseName = card.name
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const filename = `${threeDigitNumber}-${kebabCaseName}.ts`;

  return join(basePath, card.set, cardTypeFolder, filename);
}

function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^\w/, (char) => char.toLowerCase());
}

/**
 * Generates TypeScript code for a card
 */
function generateCardTypeScript(card: GundamitoCard): string {
  const cardTypeName = `${card.type.charAt(0).toUpperCase()}${card.type.slice(1)}Card`;
  const interfaceName = `Gundamito${cardTypeName}`;

  // Generate camelCase variable name from card name only (no number prefix)
  const variableName = toCamelCase(card.name);

  // Extract abilities if they exist
  const hasAbilities =
    "abilities" in card &&
    Array.isArray(card.abilities) &&
    card.abilities.length > 0;

  let abilitiesSection = "";
  const cardObjectWithoutAbilities = { ...card };

  if (hasAbilities) {
    // Create abilities constant
    const abilitiesString = JSON.stringify(card.abilities, null, 2)
      .replace(/"([^"]+)":/g, "$1:") // Remove quotes from object keys
      .replace(/"/g, '"'); // Keep quotes for string values

    abilitiesSection = `const abilities: ${interfaceName}["abilities"] = ${abilitiesString};

`;

    // Remove abilities from card object and add reference
    delete cardObjectWithoutAbilities.abilities;
  }

  // Convert card object to clean TypeScript syntax
  let cardObjectString = JSON.stringify(
    cardObjectWithoutAbilities,
    null,
    2,
  ).replace(/"([^"]+)":/g, "$1:"); // Remove quotes from object keys

  // Add abilities reference if needed
  if (hasAbilities) {
    // Insert abilities reference before the closing brace, ensuring proper comma
    cardObjectString = cardObjectString.replace(
      /(\n)(\s*)}$/,
      ",$1$2abilities: abilities$1$2}",
    );
  }

  return `import type { ${interfaceName} } from "../../cardTypes";

${abilitiesSection}export const ${variableName}: ${interfaceName} = ${cardObjectString};
`;
}

/**
 * Saves a card to the appropriate file structure
 */
export async function saveCardToFile(card: GundamitoCard): Promise<void> {
  try {
    const filePath = createCardFilePath(card);
    const directoryPath = dirname(filePath);

    // Ensure directory exists
    await mkdir(directoryPath, { recursive: true });

    // Generate TypeScript content
    const content = generateCardTypeScript(card);

    // Write file
    await writeFile(filePath, content, "utf-8");

    logger.log(`💾 Saved card to: ${filePath}`);
  } catch (error) {
    logger.error(`❌ Error saving card ${card.id}:`, error);
    throw error;
  }
}

/**
 * Scrapes all cards in a set and saves them to files
 */
export async function scrapeAndSaveAllCardsInSet(
  setCode: string,
  saveToFiles = true,
): Promise<GundamitoCard[]> {
  logger.log(`🔍 Scraping and saving all cards in set: ${setCode}`);
  logger.log("=".repeat(50));

  const cards = await scrapeAllCardsInSet(setCode);

  if (saveToFiles && cards.length > 0) {
    logger.log(`\n💾 Saving ${cards.length} cards to files...`);

    for (const card of cards) {
      try {
        await saveCardToFile(card);
      } catch (error) {
        logger.error(`❌ Failed to save card ${card.id}:`, error);
      }
    }

    logger.log(
      `✅ Successfully saved ${cards.length} cards to definition files!`,
    );
  }

  return cards;
}

/**
 * Utility function to analyze trait usage across scraped cards
 * Helps identify patterns and missing trait mappings
 */
export function analyzeTraitUsage(cards: GundamitoCard[]): void {
  const traitCount = new Map<string, number>();
  const cardsByTrait = new Map<string, string[]>();

  cards.forEach((card) => {
    if ("traits" in card && Array.isArray(card.traits)) {
      card.traits.forEach((trait) => {
        traitCount.set(trait, (traitCount.get(trait) || 0) + 1);

        if (!cardsByTrait.has(trait)) {
          cardsByTrait.set(trait, []);
        }
        cardsByTrait.get(trait)!.push(`${card.id} (${card.name})`);
      });
    }
  });

  if (traitCount.size > 0) {
    logger.log("\n📊 Trait Usage Analysis");
    logger.log("=".repeat(40));

    Array.from(traitCount.entries())
      .sort(([, a], [, b]) => b - a)
      .forEach(([trait, count]) => {
        logger.log(`• ${trait}: ${count} card${count > 1 ? "s" : ""}`);
        if (count <= 3) {
          // Show examples for rare traits
          logger.log(
            `  Examples: ${cardsByTrait.get(trait)!.slice(0, 3).join(", ")}`,
          );
        }
      });
  }
}

// Example usage
if (import.meta.main) {
  const cardNumber = process.argv[2] || "ST01-006";
  scrapeAndCreateGundamitoCard(cardNumber);
}
