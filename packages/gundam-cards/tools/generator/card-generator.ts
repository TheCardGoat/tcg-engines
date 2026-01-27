/**
 * Gundam Card Definition Generator
 *
 * Generates TypeScript card definition files.
 */

import type { CardDefinition } from "@tcg/gundam-types";
import type { ParseResult } from "../parser/text-parser";
import type { ScrapedCardData } from "../scraper/card-scraper";

/**
 * Converts scraped data and parsed abilities to a card definition
 */
export function createCardDefinition(
  scraped: ScrapedCardData,
  parsed: ParseResult,
): CardDefinition | null {
  const cardType = normalizeCardType(scraped.cardType);
  const setCode = extractSetCode(scraped.cardNumber);
  const id = generateCardId(scraped.cardNumber);

  const baseCard = {
    id,
    name: scraped.name,
    cardNumber: scraped.cardNumber,
    setCode,
    cardType,
    rarity: normalizeRarity(scraped.rarity),
    color: normalizeColor(scraped.color),
    level: scraped.level ? Number.parseInt(scraped.level, 10) : undefined,
    cost: scraped.cost ? Number.parseInt(scraped.cost, 10) : undefined,
    text: scraped.effectText,
    imageUrl: scraped.imageUrl,
    sourceTitle: scraped.sourceTitle,
  };

  switch (cardType) {
    case "UNIT":
      return {
        ...baseCard,
        cardType: "UNIT",
        ap: Number.parseInt(scraped.ap || "0", 10),
        hp: Number.parseInt(scraped.hp || "0", 10),
        zones: parseZones(scraped.zone),
        traits: parseTraits(scraped.trait),
        linkRequirements: parseLinkRequirements(scraped.link),
        keywords: parsed.keywords.length > 0 ? parsed.keywords : undefined,
        effects: parsed.effects.length > 0 ? parsed.effects : undefined,
      };

    case "PILOT":
      return {
        ...baseCard,
        cardType: "PILOT",
        traits: parseTraits(scraped.trait),
        apModifier: parseModifier(scraped.ap),
        hpModifier: parseModifier(scraped.hp),
        effects: parsed.effects.length > 0 ? parsed.effects : undefined,
      };

    case "COMMAND":
      return {
        ...baseCard,
        cardType: "COMMAND",
        timing: detectCommandTiming(scraped.effectText),
        pilotProperties: detectPilotProperties(scraped),
        effects: parsed.effects.length > 0 ? parsed.effects : undefined,
      };

    case "BASE":
      return {
        ...baseCard,
        cardType: "BASE",
        ap: Number.parseInt(scraped.ap || "0", 10),
        hp: Number.parseInt(scraped.hp || "0", 10),
        zones: parseZones(scraped.zone),
        traits: parseTraits(scraped.trait),
        effects: parsed.effects.length > 0 ? parsed.effects : undefined,
      };

    case "RESOURCE":
      return {
        id,
        name: scraped.name,
        cardNumber: scraped.cardNumber,
        setCode,
        cardType: "RESOURCE",
        rarity: normalizeRarity(scraped.rarity),
        imageUrl: scraped.imageUrl,
        sourceTitle: scraped.sourceTitle,
      };

    default:
      console.error(`Unknown card type: ${scraped.cardType}`);
      return null;
  }
}

/**
 * Generates TypeScript file content for a card
 */
export function generateCardFile(card: CardDefinition): string {
  const variableName = generateVariableName(card.name);
  const typeName = getTypeImportName(card.cardType);

  // Generate imports
  const imports = `import type { ${typeName} } from "@tcg/gundam-types";\n\n`;

  // Generate card definition
  const cardDef = `export const ${variableName}: ${typeName} = ${formatCardObject(card, 0)};\n`;

  return imports + cardDef;
}

/**
 * Formats a card object as TypeScript code
 */
function formatCardObject(obj: unknown, indent: number): string {
  if (obj === null || obj === undefined) {
    return "undefined";
  }

  if (typeof obj === "string") {
    // Escape special characters in strings
    const escaped = obj
      .replace(/\\/g, "\\\\") // Escape backslashes first
      .replace(/"/g, '\\"') // Escape quotes
      .replace(/\n/g, "\\n") // Escape newlines
      .replace(/\r/g, "\\r") // Escape carriage returns
      .replace(/\t/g, "\\t"); // Escape tabs
    return `"${escaped}"`;
  }

  if (typeof obj === "number" || typeof obj === "boolean") {
    return String(obj);
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) {
      return "[]";
    }

    const items = obj.map((item) => formatCardObject(item, indent + 1));
    const indentStr = "  ".repeat(indent + 1);
    return `[\n${indentStr}${items.join(`,\n${indentStr}`)},\n${"  ".repeat(indent)}]`;
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj).filter(([_, v]) => v !== undefined);

    if (entries.length === 0) {
      return "{}";
    }

    const indentStr = "  ".repeat(indent + 1);
    const lines = entries.map(([key, value]) => {
      return `${indentStr}${key}: ${formatCardObject(value, indent + 1)}`;
    });

    return `{\n${lines.join(",\n")},\n${"  ".repeat(indent)}}`;
  }

  return String(obj);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function normalizeCardType(type: string): CardDefinition["cardType"] {
  const normalized = type.toUpperCase();
  if (["UNIT", "PILOT", "COMMAND", "BASE", "RESOURCE"].includes(normalized)) {
    return normalized as CardDefinition["cardType"];
  }
  return "UNIT"; // Default
}

function normalizeRarity(rarity: string): CardDefinition["rarity"] {
  const map: Record<string, CardDefinition["rarity"]> = {
    C: "common",
    U: "uncommon",
    R: "rare",
    SR: "super-rare",
    LR: "legendary",
  };
  return map[rarity.toUpperCase()] || "common";
}

function normalizeColor(
  color?: string,
): "blue" | "red" | "green" | "white" | undefined {
  if (!color) return undefined;
  const normalized = color.toLowerCase();
  if (["blue", "red", "green", "white"].includes(normalized)) {
    return normalized as "blue" | "red" | "green" | "white";
  }
  return undefined;
}

function parseZones(zoneText?: string): Array<"space" | "earth"> {
  if (!zoneText) return [];
  const zones: Array<"space" | "earth"> = [];
  if (zoneText.toLowerCase().includes("space")) zones.push("space");
  if (zoneText.toLowerCase().includes("earth")) zones.push("earth");
  return zones;
}

function parseTraits(traitText?: string): string[] {
  if (!traitText || traitText === "-") return [];
  return traitText
    .replace(/[()]/g, "")
    .split(/\s+/)
    .map((t) => t.toLowerCase().replace(/\s+/g, "-"))
    .filter((t) => t.length > 0 && t !== "-");
}

function parseLinkRequirements(linkText?: string): string[] | undefined {
  if (!linkText) return undefined;
  return linkText
    .replace(/[[\]]/g, "")
    .split(",")
    .map((link) => link.trim().toLowerCase().replace(/\s+/g, "-"))
    .filter((link) => link.length > 0);
}

function parseModifier(modText?: string): number {
  if (!modText) return 0;
  return Number.parseInt(modText.replace("+", ""), 10) || 0;
}

function detectCommandTiming(effectText: string): "MAIN" | "ACTION" | "BURST" {
  if (effectText.includes("【Main】")) return "MAIN";
  if (effectText.includes("【Action】")) return "ACTION";
  if (effectText.includes("【Burst】")) return "BURST";
  return "MAIN"; // Default
}

function detectPilotProperties(scraped: ScrapedCardData): any {
  const pilotMatch = scraped.effectText.match(/【Pilot】\[([^\]]+)\]/);
  if (!pilotMatch) return undefined;

  return {
    name: pilotMatch[1],
    traits: parseTraits(scraped.trait),
    apModifier: parseModifier(scraped.ap),
    hpModifier: parseModifier(scraped.hp),
  };
}

function extractSetCode(cardNumber: string): string {
  const match = cardNumber.match(/^([A-Z0-9]+)-/);
  return match ? match[1] : "UNKNOWN";
}

function generateCardId(cardNumber: string): string {
  return cardNumber.toLowerCase();
}

function generateVariableName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9\s]/g, "")
    .split(/\s+/)
    .map((word, index) => {
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

function getTypeImportName(cardType: string): string {
  const map: Record<string, string> = {
    UNIT: "UnitCardDefinition",
    PILOT: "PilotCardDefinition",
    COMMAND: "CommandCardDefinition",
    BASE: "BaseCardDefinition_Structure",
    RESOURCE: "ResourceCardDefinition",
  };
  return map[cardType] || "CardDefinition";
}

function toKebabCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9\s-]/g, "")
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Generates filename for a card
 */
export function generateFilename(card: CardDefinition): string {
  const numberMatch = card.cardNumber.match(/-(\d+)$/);
  const number = numberMatch ? numberMatch[1].padStart(3, "0") : "000";
  const name = toKebabCase(card.name);
  return `${number}-${name}.ts`;
}
