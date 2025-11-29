/**
 * File Generator
 *
 * Generates individual TypeScript files for each card, organized by set and card type.
 * Also generates index files for aggregation at each level.
 */

import fs from "node:fs";
import path from "node:path";
import type {
  CanonicalCard,
  CardType,
  InputCardSet,
  SetDefinition,
} from "../types";

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
 * Generate content for an individual card file
 */
export function generateCardFileContent(
  card: CanonicalCard,
  exportName: string,
  depth: number,
): string {
  const typesImport = getRelativeTypesImport(depth);

  // Serialize the card object to TypeScript
  const cardJson = JSON.stringify(card, null, 2)
    .replace(/"([^"]+)":/g, "$1:") // Remove quotes from keys
    .replace(/"/g, '"'); // Use double quotes for strings

  return `import type { CanonicalCard } from "${typesImport}";

export const ${exportName}: CanonicalCard = ${cardJson};
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

  const spreadValues = cardTypes
    .map((type) => `  ...Object.values(${getCardTypeFolderName(type)}),`)
    .join("\n");

  const reExports = cardTypes
    .map((type) => `export * from "./${getCardTypeFolderName(type)}";`)
    .join("\n");

  return `import type { CanonicalCard } from "../types";
${imports}

export const all${setFolderName}Cards: CanonicalCard[] = [
${spreadValues}
];

export const all${setFolderName}CardsById: Record<string, CanonicalCard> = {};
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

  return `import type { CanonicalCard } from "./types";
${imports}

export const allCards: CanonicalCard[] = [
${cardsSpreads}
];

export const allCardsById: Record<string, CanonicalCard> = {
${byIdSpreads}
};
`;
}

/**
 * Generate content for index.ts entry point
 */
export function generateEntryPointContent(): string {
  return `import type { CanonicalCard } from "./types";

let allCardsCache: CanonicalCard[] | null = null;
let allCardsByIdCache: Record<string, CanonicalCard> | null = null;

export async function getAllCards(): Promise<CanonicalCard[]> {
  if (allCardsCache) return allCardsCache;
  const { allCards } = await import("./cards");
  allCardsCache = allCards;
  return allCardsCache;
}

export async function getAllCardsById(): Promise<Record<string, CanonicalCard>> {
  if (allCardsByIdCache) return allCardsByIdCache;
  const { allCardsById } = await import("./cards");
  allCardsByIdCache = allCardsById;
  return allCardsByIdCache;
}

export type { CanonicalCard } from "./types";
`;
}

/**
 * Generate content for types.ts
 */
export function generateTypesContent(): string {
  return `/**
 * Canonical Card Type
 *
 * Represents a unique game card with all rules-relevant information.
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

export interface CanonicalCard {
  /** Short generated ID (e.g., "a7x") */
  id: string;

  /** Card name (e.g., "Baloo") */
  name: string;

  /** Card version/subtitle (e.g., "Friend and Guardian") */
  version: string;

  /** Full name for display and deck building (e.g., "Baloo - Friend and Guardian") */
  fullName: string;

  /** Card type */
  cardType: CardType;

  /** Ink type(s) - single or dual ink */
  inkType: InkType | [InkType, InkType];

  /** Ink cost to play */
  cost: number;

  /** Can be added to inkwell */
  inkable: boolean;

  /** Strength - characters only */
  strength?: number;

  /** Willpower - characters only */
  willpower?: number;

  /** Lore value when questing - characters and locations */
  lore?: number;

  /** Move cost - locations only */
  moveCost?: number;

  /** Classifications (e.g., ["Storyborn", "Ally"]) - characters only */
  classifications?: string[];

  /** Action subtype (song, etc.) - actions only */
  actionSubtype?: "song" | null;

  /** Keywords on the card */
  keywords?: string[];

  /** Raw rules text for display (omitted for vanilla cards) */
  rulesText?: string;

  /** Parsed abilities for game logic (omitted for vanilla cards) */
  abilities?: AbilityDefinition[];

  /** References to all printings of this card */
  printings: CardPrintingRef[];

  /** True if card has no rules text (no abilities to test) */
  vanilla: boolean;

  /** Franchise the card belongs to (e.g., "Jungle Book", "Frozen") */
  franchise?: string;

  /** External IDs for cross-referencing with other systems */
  externalIds?: ExternalIds;
}

export interface ExternalIds {
  /** Ravensburger's deck building ID */
  ravensburger?: string;

  /** Ravensburger's culture invariant ID */
  cultureInvariantId?: number;

  /** TCGPlayer product ID */
  tcgPlayer?: number;

  /** Lorcast card ID */
  lorcast?: string;
}

export interface CardPrintingRef {
  /** Set ID (e.g., "set10") */
  set: string;

  /** Collector number within the set */
  collectorNumber: number;

  /** Full printing ID (e.g., "set10-001") */
  id: string;
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
 * Write a file, creating directories as needed
 */
function writeFile(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
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
  // Create set ID to folder name mapping
  const setMapping = new Map<string, string>();
  for (const set of Object.values(sets)) {
    setMapping.set(set.id, getSetFolderName(set.id));
  }

  // Organize cards for file generation
  const organized = organizeCardsForFileGeneration(canonicalCards, setMapping);

  // Track all set folder names for main aggregator
  const setFolderNames: string[] = [];

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

      // Generate individual card files
      for (const cardInfo of cards) {
        const filePath = path.join(typeDir, cardInfo.fileName);
        const content = generateCardFileContent(
          cardInfo.card,
          cardInfo.exportName,
          2, // Depth: set/type/card.ts -> types.ts is 2 levels up
        );
        writeFile(filePath, content);
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
  console.log(`  Generated ${setFolderNames.length} set index files`);
  console.log("  Generated main cards.ts, index.ts, and types.ts");
}
