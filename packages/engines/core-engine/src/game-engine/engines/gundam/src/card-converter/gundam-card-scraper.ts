import type {
  CardColor,
  CardRarity,
  CardZones,
  GundamitoCardSet,
  GundamitoCardType,
  Traits,
} from "../../shared-types";
import type {
  GundamitoCard,
  GundamitoUnitCard,
} from "../cards/definitions/cardTypes";

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
async function scrapeCardData(
  cardNumber: string,
): Promise<ScrapedCardData | null> {
  const url = `https://www.gundam-gcg.com/en/cards/detail.php?detailSearch=${cardNumber}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    return parseCardHTML(html);
  } catch (error) {
    console.error(`Error scraping card ${cardNumber}:`, error);
    return null;
  }
}

/**
 * Parses HTML content to extract card data
 */
function parseCardHTML(html: string): ScrapedCardData | null {
  try {
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

    // Extract image URL
    const imageMatch = html.match(/<img src=\s*"([^"]+)"\s*alt="[^"]*">/);
    const imageUrl = imageMatch?.[1]?.trim() || "";

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

    // Extract effect text (overview section)
    const effectMatch = html.match(
      /<div class="cardDataRow overview">\s*<div class="dataTxt isRegular">\s*([^<]+)<br>/,
    );
    const effectText = effectMatch?.[1]?.trim() || "";

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
    console.error("Error parsing HTML:", error);
    return null;
  }
}

/**
 * Converts scraped data to GundamitoCard
 */
function convertToGundamitoCard(data: ScrapedCardData): GundamitoCard | null {
  try {
    // Parse basic info
    const cardType = convertCardType(data.type);
    const color = convertColor(data.color);
    const rarity = convertRarity(data.rarity);
    const set = extractCardSet(data.cardNumber);
    const number = extractCardNumber(data.cardNumber);

    const baseCard = {
      id: data.cardNumber,
      implemented: false,
      missingTestCase: true,
      cost: Number.parseInt(data.cost, 10) || 0,
      level: Number.parseInt(data.level, 10) || 1,
      number,
      name: data.cardName,
      color,
      set,
      rarity,
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
          abilities: [], // Will be populated later with text parsing
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
          abilities: [], // Will be populated later with text parsing
        };
      }

      case "command": {
        return {
          ...baseCard,
          type: "command",
          abilities: [], // Will be populated later with text parsing
        };
      }

      case "base": {
        const zones = parseZones(data.zone);
        const traits = parseTraits(data.trait);

        return {
          ...baseCard,
          type: "base",
          zones,
          traits,
          abilities: [], // Will be populated later with text parsing
          ap: Number.parseInt(data.ap, 10) || 0,
          hp: Number.parseInt(data.hp, 10) || 1,
        };
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
        };
      }

      default: {
        console.warn(`Unknown card type: ${data.type}`);
        return null;
      }
    }
  } catch (error) {
    console.error("Error converting to GundamitoCard:", error);
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
      console.warn(`Unknown card type: ${type}, defaulting to unit`);
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
      console.warn(`Unknown color: ${color}, defaulting to blue`);
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
      console.warn(`Unknown rarity: ${rarity}, defaulting to common`);
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
    default:
      console.warn(`Unknown set: ${setCode}, defaulting to ST01`);
      return "ST01";
  }
}

function extractCardNumber(cardId: string): number {
  const numberMatch = cardId.match(/-(\d+)$/);
  return Number.parseInt(numberMatch?.[1] || "1", 10);
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
  if (!traitText) return [];

  // Remove parentheses and split by common delimiters
  const cleanTraitText = traitText.replace(/[()]/g, "").toLowerCase();
  const traitParts = cleanTraitText
    .split(/[,\s]+/)
    .filter((part) => part.length > 0);

  const traits: Traits[] = [];

  // Map common trait patterns
  const traitMappings: Record<string, Traits> = {
    academy: "academy",
    earth: "earth federation",
    federation: "earth federation",
    zeon: "zeon",
    newtype: "newtype",
    civilian: "civilian",
    stronghold: "stronghold",
    warship: "warship",
  };

  for (const part of traitParts) {
    for (const [key, trait] of Object.entries(traitMappings)) {
      if (part.includes(key)) {
        if (!traits.includes(trait)) {
          traits.push(trait);
        }
      }
    }
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

/**
 * Main function to scrape and convert a card
 */
export async function scrapeAndCreateGundamitoCard(
  cardNumber: string,
): Promise<GundamitoCard | null> {
  console.log(`Scraping card: ${cardNumber}`);

  const scrapedData = await scrapeCardData(cardNumber);
  if (!scrapedData) {
    console.error(`Failed to scrape data for card: ${cardNumber}`);
    return null;
  }

  console.log("Scraped data:", scrapedData);

  const gundamitoCard = convertToGundamitoCard(scrapedData);
  if (!gundamitoCard) {
    console.error(
      `Failed to convert scraped data to GundamitoCard for: ${cardNumber}`,
    );
    return null;
  }

  console.log(
    "Generated GundamitoCard:",
    JSON.stringify(gundamitoCard, null, 2),
  );

  return gundamitoCard;
}

// Example usage
if (import.meta.main) {
  const cardNumber = process.argv[2] || "ST01-006";
  scrapeAndCreateGundamitoCard(cardNumber);
}
