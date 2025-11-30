/**
 * File Generator
 *
 * Generates individual TypeScript files for each card, organized by set and card type.
 * Also generates index files for aggregation at each level.
 */

import fs from "node:fs";
import path from "node:path";
import type {
  ActionCard,
  CardType,
  CharacterCard,
  ItemCard,
  LocationCard,
} from "@tcg/lorcana";
import type { CanonicalCard, SetDefinition } from "../types";

const CARD_TYPES: CardType[] = ["character", "action", "item", "location"];

/**
 * Convert a string to kebab-case for file names
 */
function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Reserved words in JavaScript/TypeScript that cannot be used as identifiers
 */
const RESERVED_WORDS = new Set([
  "break",
  "case",
  "catch",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "else",
  "finally",
  "for",
  "function",
  "if",
  "in",
  "instanceof",
  "new",
  "return",
  "switch",
  "this",
  "throw",
  "try",
  "typeof",
  "var",
  "void",
  "while",
  "with",
  "class",
  "const",
  "enum",
  "export",
  "extends",
  "import",
  "super",
  "implements",
  "interface",
  "let",
  "package",
  "private",
  "protected",
  "public",
  "static",
  "yield",
]);

/**
 * Convert a string to camelCase for export names
 * Handles reserved words and identifiers starting with numbers
 */
function toCamelCase(str: string): string {
  let result = str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "") // Remove special chars except spaces
    .split(/\s+/)
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join("");

  // If starts with a number, prefix with underscore
  if (/^\d/.test(result)) {
    result = `_${result}`;
  }

  // If it's a reserved word, prefix with underscore
  if (RESERVED_WORDS.has(result)) {
    result = `${result}Card`;
  }

  return result;
}

/**
 * Generate file name for a card
 * Format: {cardNumber}-{kebab-case-name}.ts
 */
export function generateCardFileName(
  cardNumber: number,
  fullName: string,
): string {
  const paddedNumber = cardNumber.toString().padStart(3, "0");
  const kebabName = toKebabCase(fullName);
  return `${paddedNumber}-${kebabName}.ts`;
}

/**
 * Generate export name for a card
 * Format: camelCaseName
 */
export function generateExportName(fullName: string): string {
  return toCamelCase(fullName);
}

/**
 * Extract set number from set ID and convert to padded folder name
 * e.g., "set1" -> "001", "set10" -> "010"
 */
export function getSetFolderName(setId: string): string {
  const match = setId.match(/\d+/);
  const num = match ? Number.parseInt(match[0], 10) : 0;
  return num.toString().padStart(3, "0");
}

/**
 * Get plural folder name for card type
 */
function getCardTypeFolderName(cardType: CardType): string {
  const folderNames: Record<CardType, string> = {
    character: "characters",
    action: "actions",
    item: "items",
    location: "locations",
  };
  return folderNames[cardType];
}

/**
 * Calculate relative path depth for imports
 */
function getRelativeTypesImport(depth: number): string {
  const ups = "../".repeat(depth);
  return `${ups}types`;
}

/**
 * Get the type-specific interface name for a card type
 */
function getCanonicalTypeName(cardType: CardType): string {
  const typeNames: Record<CardType, string> = {
    character: "CharacterCard",
    action: "ActionCard",
    item: "ItemCard",
    location: "LocationCard",
  };
  return typeNames[cardType];
}

/**
 * Convert canonical card to LorcanaCard format
 * Reconstructs with proper property ordering: String → Numeric → Boolean → Object → Array
 * Maps printings array to set/cardNumber from first printing
 * TODO: Re-enable printing in output when requested
 */
function convertToLorcanaCard(card: CanonicalCard): Record<string, unknown> {
  const firstPrinting = card.printings[0];

  // Build set and cardNumber from first printing
  const set = firstPrinting?.set;
  const cardNumber = firstPrinting
    ? firstPrinting.collectorNumber.toString().padStart(3, "0")
    : undefined;

  // Reconstruct object with proper property ordering
  const result: Record<string, unknown> = {
    // === STRING PROPERTIES (in order) ===
    id: card.id,
    cardType: card.cardType,
    name: card.name,
    version: card.version,
    fullName: card.fullName,
    inkType: card.inkType,
  };

  // Add optional string properties
  if (card.franchise) {
    result.franchise = card.franchise;
  }
  if (set) {
    result.set = set;
  }

  // === NUMERIC PROPERTIES ===
  result.cost = card.cost;

  // Add type-specific numeric properties
  if ("strength" in card) {
    result.strength = card.strength;
  }
  if ("willpower" in card) {
    result.willpower = card.willpower;
  }
  if ("moveCost" in card) {
    result.moveCost = card.moveCost;
  }
  if ("lore" in card) {
    result.lore = card.lore;
  }

  // === BOOLEAN PROPERTIES ===
  result.inkable = card.inkable;
  // Only output vanilla when true (non-vanilla cards omit this field)
  if (card.vanilla) {
    result.vanilla = true;
  }

  // === OBJECT PROPERTIES ===
  if (card.externalIds) {
    result.externalIds = card.externalIds;
  }

  // === ARRAY PROPERTIES ===
  // Convert keywords to proper engine format
  // Simple keywords stay as strings, parameterized/complex keywords become objects
  if (card.parsedAbilities && card.parsedAbilities.length > 0) {
    const engineKeywords: unknown[] = [];
    for (const ability of card.parsedAbilities) {
      if (ability.type === "keyword") {
        const kw = ability.keyword;
        // Simple keywords (strings)
        if (
          [
            "Bodyguard",
            "Evasive",
            "Reckless",
            "Rush",
            "Support",
            "Vanish",
            "Ward",
            "Alert",
          ].includes(kw)
        ) {
          engineKeywords.push(kw);
        }
        // Parameterized keywords (objects with value)
        else if (kw === "Challenger" || kw === "Resist") {
          engineKeywords.push({ type: kw, value: ability.value ?? 0 });
        }
        // Singer keyword (object with value)
        else if (kw === "Singer") {
          engineKeywords.push({ type: "Singer", value: ability.value ?? 0 });
        }
        // Note: Shift is more complex - requires targetName, skip for now
      }
    }
    if (engineKeywords.length > 0) {
      result.keywords = engineKeywords;
    }
  }

  // Output raw rules text as 'text' field
  if (card.rulesText) {
    result.text = card.rulesText;
  }

  // Output abilities with proper AbilityDefinition format
  // AbilityDefinition requires: id, text, type (triggered|activated|static|keyword)
  if (card.rulesText && !card.vanilla) {
    const abilityTexts = card.rulesText.split("\n").filter((t) => t.trim());
    const engineAbilities: Array<{
      id: string;
      name?: string;
      text: string;
      type: "triggered" | "activated" | "static" | "keyword";
      keyword?: string;
      value?: number;
    }> = [];

    // Simple keywords (no value)
    const simpleKeywords = [
      "bodyguard",
      "evasive",
      "reckless",
      "rush",
      "support",
      "vanish",
      "ward",
      "alert",
    ];
    // Parameterized keywords (have a +N value)
    const parameterizedKeywords = ["challenger", "resist", "singer"];

    for (let i = 0; i < abilityTexts.length; i++) {
      const rawText = abilityTexts[i].trim();
      const abilityId = `${card.id}-${i + 1}`;

      // Remove reminder text (parenthetical explanations)
      // Note: In Lorcana, reminder text always appears in parentheses after keywords/abilities
      // e.g., "Challenger +2 (While challenging, this character gets +2.)"
      const text = rawText.replace(/\s*\([^)]*\)/g, "").trim();

      // Try to extract ability name (all caps at start)
      // Pattern requires at least 3 uppercase letters - all Lorcana ability names are 4+ chars
      // e.g., "RUSH", "WARD", "CHALLENGER", "FRESH INK"
      const namedMatch = text.match(/^([A-Z][A-Z\s]+[A-Z])\s+(.+)$/);
      const name = namedMatch ? namedMatch[1].trim() : undefined;

      // Determine ability type
      let abilityType: "triggered" | "activated" | "static" | "keyword" =
        "static";
      const lower = text.toLowerCase();
      let keyword: string | undefined;
      let value: number | undefined;

      // Check for simple keywords
      const simpleKeywordMatch = simpleKeywords.find((kw) =>
        lower.startsWith(kw),
      );
      if (simpleKeywordMatch) {
        abilityType = "keyword";
        keyword =
          simpleKeywordMatch.charAt(0).toUpperCase() +
          simpleKeywordMatch.slice(1);
      }
      // Check for parameterized keywords (e.g., "Challenger +3", "Resist +2", "Singer 5")
      else if (parameterizedKeywords.some((kw) => lower.startsWith(kw))) {
        const paramMatch = text.match(
          /^(Challenger|Resist|Singer)\s*\+?(\d+)/i,
        );
        if (paramMatch) {
          abilityType = "keyword";
          keyword =
            paramMatch[1].charAt(0).toUpperCase() +
            paramMatch[1].slice(1).toLowerCase();
          value = Number.parseInt(paramMatch[2], 10);
        }
      }
      // Check for Shift keyword (e.g., "Shift 5")
      else if (lower.startsWith("shift")) {
        const shiftMatch = text.match(/^Shift\s+(\d+)/i);
        if (shiftMatch) {
          abilityType = "keyword";
          keyword = "Shift";
          value = Number.parseInt(shiftMatch[1], 10);
        }
      }
      // Not a keyword - check for triggered/activated
      else {
        // Triggered abilities
        if (
          lower.includes("whenever") ||
          lower.includes("when you play") ||
          lower.includes("when this") ||
          lower.includes("at the start") ||
          lower.includes("at the end")
        ) {
          abilityType = "triggered";
        }
        // Activated abilities (have exert cost)
        else if (lower.includes("{e}") || lower.includes("⬡")) {
          abilityType = "activated";
        }
      }

      engineAbilities.push({
        id: abilityId,
        ...(name && { name }),
        text,
        type: abilityType,
        ...(keyword && { keyword }),
        ...(value !== undefined && { value }),
      });
    }

    if (engineAbilities.length > 0) {
      result.abilities = engineAbilities;
    }
  }
  if ("classifications" in card && card.classifications?.length) {
    result.classifications = card.classifications;
  }
  if ("actionSubtype" in card && card.actionSubtype) {
    result.actionSubtype = card.actionSubtype;
  }

  // Add cardNumber at the end with string properties
  if (cardNumber) {
    // Need to re-order to put cardNumber with strings - reconstruct
    const finalResult: Record<string, unknown> = {};
    const keys = Object.keys(result);

    // Copy string properties first
    for (const key of keys) {
      if (
        typeof result[key] === "string" ||
        key === "inkType" ||
        key === "cardType"
      ) {
        finalResult[key] = result[key];
      }
    }
    finalResult.cardNumber = cardNumber;

    // Copy numeric properties
    for (const key of keys) {
      if (
        typeof result[key] === "number" &&
        key !== "cardNumber" &&
        !["cost", "strength", "willpower", "lore", "moveCost"].includes(key)
      ) {
        finalResult[key] = result[key];
      }
    }
    // Add known numeric properties in order
    if ("cost" in result) finalResult.cost = result.cost;
    if ("strength" in result) finalResult.strength = result.strength;
    if ("willpower" in result) finalResult.willpower = result.willpower;
    if ("moveCost" in result) finalResult.moveCost = result.moveCost;
    if ("lore" in result) finalResult.lore = result.lore;

    // Copy boolean properties
    for (const key of keys) {
      if (typeof result[key] === "boolean") {
        finalResult[key] = result[key];
      }
    }

    // Copy remaining properties
    for (const key of keys) {
      if (!(key in finalResult)) {
        finalResult[key] = result[key];
      }
    }

    return finalResult;
  }

  return result;
}

/**
 * Generate content for an individual card file
 */
export function generateCardFileContent(
  card: CanonicalCard,
  exportName: string,
  depth: number,
): string {
  const typeName = getCanonicalTypeName(card.cardType);

  // Convert canonical card to lorcana format
  const lorcanaCard = convertToLorcanaCard(card);

  // Serialize the card object to TypeScript
  const cardJson = JSON.stringify(lorcanaCard, null, 2)
    .replace(/"([^"]+)":/g, "$1:") // Remove quotes from keys
    .replace(/"/g, '"'); // Use double quotes for strings

  return `import type { ${typeName} } from "@tcg/lorcana";

export const ${exportName}: ${typeName} = ${cardJson};
`;
}

/**
 * Generate content for a card type index file (e.g., characters/index.ts)
 */
export function generateCardTypeIndexContent(
  cards: Array<{ fileName: string; exportName: string }>,
): string {
  if (cards.length === 0) {
    return "// No cards in this category\n";
  }

  const exports = cards
    .map(
      ({ fileName, exportName }) =>
        `export { ${exportName} } from "./${fileName.replace(".ts", "")}";`,
    )
    .join("\n");

  return `${exports}\n`;
}

/**
 * Generate content for a set index file (e.g., 001/index.ts)
 */
export function generateSetIndexContent(
  setFolderName: string,
  cardTypes: CardType[],
): string {
  const imports = cardTypes
    .map((type) => {
      const folder = getCardTypeFolderName(type);
      return `import * as ${folder} from "./${folder}";`;
    })
    .join("\n");

  const typeUnion = cardTypes
    .map((type) => {
      const typeName = getCanonicalTypeName(type);
      return typeName;
    })
    .join(" | ");

  const spreadValues = cardTypes
    .map((type) => `  ...Object.values(${getCardTypeFolderName(type)}),`)
    .join("\n");

  const reExports = cardTypes
    .map((type) => `export * from "./${getCardTypeFolderName(type)}";`)
    .join("\n");

  const importedTypes = typeUnion.split(" | ").join(", ");
  return `import type { ${importedTypes} } from "@tcg/lorcana";
${imports}

export const all${setFolderName}Cards: (${typeUnion})[] = [
${spreadValues}
];

export const all${setFolderName}CardsById: Record<string, ${typeUnion}> = {};
for (const card of all${setFolderName}Cards) {
  all${setFolderName}CardsById[card.id] = card;
}

${reExports}
`;
}

/**
 * Generate content for main cards.ts aggregator
 */
export function generateMainCardsContent(setFolderNames: string[]): string {
  const imports = setFolderNames
    .map(
      (name) =>
        `import { all${name}Cards, all${name}CardsById } from "./${name}";`,
    )
    .join("\n");

  const cardsSpreads = setFolderNames
    .map((name) => `  ...all${name}Cards,`)
    .join("\n");

  const byIdSpreads = setFolderNames
    .map((name) => `  ...all${name}CardsById,`)
    .join("\n");

  return `import type { CharacterCard, ActionCard, ItemCard, LocationCard } from "@tcg/lorcana";
${imports}

export const allCards: (CharacterCard | ActionCard | ItemCard | LocationCard)[] = [
${cardsSpreads}
];

export const allCardsById: Record<string, CharacterCard | ActionCard | ItemCard | LocationCard> = {
${byIdSpreads}
};
`;
}

/**
 * Generate content for index.ts entry point
 */
export function generateEntryPointContent(): string {
  return `import type { CharacterCard, ActionCard, ItemCard, LocationCard } from "@tcg/lorcana";

let allCardsCache: (CharacterCard | ActionCard | ItemCard | LocationCard)[] | null = null;
let allCardsByIdCache: Record<string, CharacterCard | ActionCard | ItemCard | LocationCard> | null = null;

export async function getAllCards(): Promise<(CharacterCard | ActionCard | ItemCard | LocationCard)[]> {
  if (allCardsCache) return allCardsCache;
  const { allCards } = await import("./cards");
  allCardsCache = allCards;
  return allCardsCache;
}

export async function getAllCardsById(): Promise<Record<string, CharacterCard | ActionCard | ItemCard | LocationCard>> {
  if (allCardsByIdCache) return allCardsByIdCache;
  const { allCardsById } = await import("./cards");
  allCardsByIdCache = allCardsById;
  return allCardsByIdCache;
}

// Export all types
export type {
  AbilityDefinition,
  CanonicalActionCard,
  CanonicalCard,
  CanonicalCardMetadata,
  CanonicalCharacterCard,
  CanonicalItemCard,
  CanonicalLocationCard,
  CardPrintingRef,
  CardType,
  ExternalIds,
  InkType,
} from "./types";

// Export type guards
export {
  isCanonicalAction,
  isCanonicalCharacter,
  isCanonicalItem,
  isCanonicalLocation,
} from "./types";
`;
}

/**
 * Generate content for types.ts
 */
export function generateTypesContent(): string {
  return `/**
 * Canonical Card Types - Discriminated Union
 *
 * Type-safe card definitions for generated Lorcana cards.
 * Uses discriminated unions to provide type-safe access to card-type-specific properties.
 */

export type CardType = "character" | "action" | "item" | "location";

export type InkType =
  | "amber"
  | "amethyst"
  | "emerald"
  | "ruby"
  | "sapphire"
  | "steel";

export interface AbilityDefinition {
  id?: string;
  name?: string | null;
  text: string;
  type: "triggered" | "activated" | "static" | "keyword";
}

export interface ExternalIds {
  ravensburger?: string;
  cultureInvariantId?: number;
  tcgPlayer?: number;
  lorcast?: string;
}

export interface CardPrintingRef {
  set: string;
  collectorNumber: number;
  id: string;
}

/**
 * Base properties for all canonical cards
 */
export interface CanonicalCardMetadata {
  id: string;
  name: string;
  version: string;
  fullName: string;
  inkType: InkType | [InkType, InkType];
  cost: number;
  inkable: boolean;
  keywords?: string[];
  rulesText?: string;
  abilities?: AbilityDefinition[];
  printings: CardPrintingRef[];
  vanilla: boolean;
  franchise?: string;
  externalIds?: ExternalIds;
}

/**
 * Character Card - has strength, willpower, lore, and classifications
 */
export interface CanonicalCharacterCard extends CanonicalCardMetadata {
  cardType: "character";
  strength: number;
  willpower: number;
  lore: number;
  classifications?: string[];
}

/**
 * Action Card - has optional actionSubtype for Songs
 */
export interface CanonicalActionCard extends CanonicalCardMetadata {
  cardType: "action";
  actionSubtype?: "song" | null;
}

/**
 * Item Card - permanent cards with ongoing effects
 */
export interface CanonicalItemCard extends CanonicalCardMetadata {
  cardType: "item";
}

/**
 * Location Card - has moveCost and lore
 */
export interface CanonicalLocationCard extends CanonicalCardMetadata {
  cardType: "location";
  moveCost: number;
  lore: number;
}

/**
 * Canonical Card - discriminated union of all card types
 */
export type CanonicalCard =
  | CanonicalCharacterCard
  | CanonicalActionCard
  | CanonicalItemCard
  | CanonicalLocationCard;

/**
 * Type guard for character cards
 */
export function isCanonicalCharacter(card: CanonicalCard): card is CanonicalCharacterCard {
  return card.cardType === "character";
}

/**
 * Type guard for action cards
 */
export function isCanonicalAction(card: CanonicalCard): card is CanonicalActionCard {
  return card.cardType === "action";
}

/**
 * Type guard for item cards
 */
export function isCanonicalItem(card: CanonicalCard): card is CanonicalItemCard {
  return card.cardType === "item";
}

/**
 * Type guard for location cards
 */
export function isCanonicalLocation(card: CanonicalCard): card is CanonicalLocationCard {
  return card.cardType === "location";
}
`;
}

/**
 * Card info needed for file generation
 */
export interface CardFileInfo {
  card: CanonicalCard;
  cardNumber: number;
  setFolderName: string;
  cardType: CardType;
  fileName: string;
  exportName: string;
}

/**
 * Keyword to TestEngine property mapping
 * Maps keyword names to the corresponding `has*` property on the card model
 */
const KEYWORD_TO_PROPERTY: Record<string, string> = {
  Bodyguard: "hasBodyguard",
  Evasive: "hasEvasive",
  Reckless: "hasReckless",
  Rush: "hasRush",
  Support: "hasSupport",
  Vanish: "hasVanish",
  Ward: "hasWard",
  Alert: "hasAlert",
  Challenger: "hasChallenger",
  Resist: "hasResist",
  Singer: "hasSinger",
  Shift: "hasShift",
};

/**
 * Extract keywords from a card's abilities
 * Returns an array of { keyword, value? } objects
 */
function extractKeywordsFromCard(
  card: CanonicalCard,
): Array<{ keyword: string; value?: number }> {
  const keywords: Array<{ keyword: string; value?: number }> = [];

  if (!card.parsedAbilities || card.parsedAbilities.length === 0) {
    return keywords;
  }

  for (const ability of card.parsedAbilities) {
    if (ability.type === "keyword" && ability.keyword) {
      keywords.push({
        keyword: ability.keyword,
        value: ability.value,
      });
    }
  }

  return keywords;
}

/**
 * Generate the test file name for a card
 * Format: {cardNumber}-{kebab-case-name}.test.ts
 */
export function generateTestFileName(
  cardNumber: number,
  fullName: string,
): string {
  const paddedNumber = cardNumber.toString().padStart(3, "0");
  const kebabName = toKebabCase(fullName);
  return `${paddedNumber}-${kebabName}.test.ts`;
}

/**
 * Generate test file content for a card with keywords
 */
export function generateTestFileContent(
  card: CanonicalCard,
  exportName: string,
  cardFileName: string,
): string | null {
  // Don't generate tests for vanilla cards
  if (card.vanilla) {
    return null;
  }

  const keywords = extractKeywordsFromCard(card);

  // Don't generate tests if no keywords found
  if (keywords.length === 0) {
    return null;
  }

  // Build the import path (relative from test file to card file)
  const importPath = `./${cardFileName.replace(".ts", "")}`;

  // Generate test cases for each keyword
  const testCases: string[] = [];

  for (const { keyword, value } of keywords) {
    const propertyName = KEYWORD_TO_PROPERTY[keyword];
    if (!propertyName) {
      // Skip unknown keywords
      continue;
    }

    if (value !== undefined) {
      // Parameterized keyword test (e.g., Challenger +3, Singer 5)
      testCases.push(`  it("should have ${keyword} ${value} ability", () => {
    const testEngine = new TestEngine({
      play: [${exportName}],
    });
    const cardUnderTest = testEngine.getCardModel(${exportName});
    expect(cardUnderTest.${propertyName}).toBe(true);
  });`);
    } else {
      // Simple keyword test (e.g., Bodyguard, Rush)
      testCases.push(`  it("should have ${keyword} ability", () => {
    const testEngine = new TestEngine({
      play: [${exportName}],
    });
    const cardUnderTest = testEngine.getCardModel(${exportName});
    expect(cardUnderTest.${propertyName}).toBe(true);
  });`);
    }
  }

  // If no valid test cases were generated, return null
  if (testCases.length === 0) {
    return null;
  }

  return `import { describe, expect, it } from "bun:test";
import { ${exportName} } from "${importPath}";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

describe("${card.fullName}", () => {
${testCases.join("\n\n")}
});
`;
}

/**
 * Organize cards into file info grouped by set and card type
 */
export function organizeCardsForFileGeneration(
  canonicalCards: Record<string, CanonicalCard>,
  setMapping: Map<string, string>, // setId -> setFolderName
): Map<string, Map<CardType, CardFileInfo[]>> {
  // Map: setFolderName -> cardType -> CardFileInfo[]
  const organized = new Map<string, Map<CardType, CardFileInfo[]>>();

  for (const card of Object.values(canonicalCards)) {
    // Get set info from first printing
    const firstPrinting = card.printings[0];
    if (!firstPrinting) continue;

    // Printing is now an object with set, collectorNumber, id
    const setId = firstPrinting.set;
    const cardNumber = firstPrinting.collectorNumber;

    const setFolderName = setMapping.get(setId);
    if (!setFolderName) continue;

    const fileName = generateCardFileName(cardNumber, card.fullName);
    const exportName = generateExportName(card.fullName);

    const cardInfo: CardFileInfo = {
      card,
      cardNumber,
      setFolderName,
      cardType: card.cardType,
      fileName,
      exportName,
    };

    // Initialize nested maps if needed
    if (!organized.has(setFolderName)) {
      organized.set(setFolderName, new Map());
    }
    const setMap = organized.get(setFolderName)!;

    if (!setMap.has(card.cardType)) {
      setMap.set(card.cardType, []);
    }
    setMap.get(card.cardType)!.push(cardInfo);
  }

  // Sort cards within each type by card number
  for (const setMap of organized.values()) {
    for (const cards of setMap.values()) {
      cards.sort((a, b) => a.cardNumber - b.cardNumber);
    }
  }

  return organized;
}

/**
 * Cache for created directories to avoid repeated filesystem checks
 */
const createdDirs = new Set<string>();

/**
 * Write a file, creating directories as needed
 * Uses caching to reduce filesystem operations
 */
function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  if (!createdDirs.has(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    createdDirs.add(dir);
  }
  fs.writeFileSync(filePath, content, "utf-8");
}

/**
 * Generate all card files and index files
 */
export function generateCardFiles(
  outputDir: string,
  canonicalCards: Record<string, CanonicalCard>,
  sets: Record<string, SetDefinition>,
): void {
  // Reset directory cache for fresh run
  createdDirs.clear();

  // Create set number to folder name mapping
  // Printings now use numeric set format (e.g., "001") instead of "set1"
  const setMapping = new Map<string, string>();
  for (const set of Object.values(sets)) {
    const setFolderName = getSetFolderName(set.id);
    setMapping.set(setFolderName, setFolderName);
  }

  // Organize cards for file generation
  const organized = organizeCardsForFileGeneration(canonicalCards, setMapping);

  // Track all set folder names for main aggregator
  const setFolderNames: string[] = [];
  let totalTestFilesGenerated = 0;

  // Generate files for each set
  for (const [setFolderName, cardTypeMap] of organized) {
    setFolderNames.push(setFolderName);
    const setDir = path.join(outputDir, setFolderName);
    const cardTypesWithCards: CardType[] = [];

    // Generate files for each card type
    for (const cardType of CARD_TYPES) {
      const cards = cardTypeMap.get(cardType) || [];
      if (cards.length === 0) continue;

      cardTypesWithCards.push(cardType);
      const typeFolder = getCardTypeFolderName(cardType);
      const typeDir = path.join(setDir, typeFolder);

      // Generate individual card files and test files
      let testFilesGenerated = 0;
      for (const cardInfo of cards) {
        const filePath = path.join(typeDir, cardInfo.fileName);
        const content = generateCardFileContent(
          cardInfo.card,
          cardInfo.exportName,
          2, // Depth: set/type/card.ts -> types.ts is 2 levels up
        );
        writeFile(filePath, content);

        // Generate test file for non-vanilla cards with keywords
        const testContent = generateTestFileContent(
          cardInfo.card,
          cardInfo.exportName,
          cardInfo.fileName,
        );
        if (testContent) {
          const testFileName = generateTestFileName(
            cardInfo.cardNumber,
            cardInfo.card.fullName,
          );
          const testFilePath = path.join(typeDir, testFileName);
          writeFile(testFilePath, testContent);
          testFilesGenerated++;
          totalTestFilesGenerated++;
        }
      }

      // Generate card type index file
      const indexContent = generateCardTypeIndexContent(
        cards.map((c) => ({ fileName: c.fileName, exportName: c.exportName })),
      );
      writeFile(path.join(typeDir, "index.ts"), indexContent);
    }

    // Generate set index file
    const setIndexContent = generateSetIndexContent(
      setFolderName,
      cardTypesWithCards,
    );
    writeFile(path.join(setDir, "index.ts"), setIndexContent);
  }

  // Sort set folder names numerically
  setFolderNames.sort(
    (a, b) => Number.parseInt(a, 10) - Number.parseInt(b, 10),
  );

  // Generate main cards.ts aggregator
  const mainCardsContent = generateMainCardsContent(setFolderNames);
  writeFile(path.join(outputDir, "cards.ts"), mainCardsContent);

  // Generate entry point index.ts
  const entryPointContent = generateEntryPointContent();
  writeFile(path.join(outputDir, "index.ts"), entryPointContent);

  // Generate types.ts
  const typesContent = generateTypesContent();
  writeFile(path.join(outputDir, "types.ts"), typesContent);

  console.log(`  Generated ${Object.keys(canonicalCards).length} card files`);
  console.log(`  Generated ${totalTestFilesGenerated} test files`);
  console.log(`  Generated ${setFolderNames.length} set index files`);
  console.log("  Generated main cards.ts, index.ts, and types.ts");
}
