/**
 * Migration File Writer
 *
 * Handles writing converted cards to files with proper formatting
 * and directory structure.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type {
  ActionCard,
  CharacterCard,
  ItemCard,
  LocationCard,
} from "@tcg/lorcana-types";

/**
 * Write card to file
 *
 * @param card - Converted card object
 * @param targetDir - Target directory (e.g., "src/cards/001")
 * @param dryRun - If true, don't actually write files
 * @returns Path where file was written
 */
export function writeCardToFile(
  card: CharacterCard | ActionCard | ItemCard | LocationCard,
  targetDir: string,
  dryRun = false,
): string {
  // Determine subdirectory based on card type
  const subDir = getSubdirectoryForCardType(card.cardType);
  const fullPath = join(targetDir, subDir);

  // Generate filename
  const filename = generateFilename(card);
  const filePath = join(fullPath, filename);

  // Generate file content
  const content = generateCardFileContent(card);

  if (dryRun) {
    return filePath;
  }

  // Create directory if it doesn't exist
  if (!existsSync(fullPath)) {
    mkdirSync(fullPath, { recursive: true });
  }

  // Write file
  writeFileSync(filePath, content, "utf-8");

  return filePath;
}

/**
 * Write index.ts file for a directory
 *
 * @param cards - Cards to export
 * @param targetDir - Target directory
 * @param dryRun - If true, don't actually write files
 */
export function writeIndexFile(
  cards: (CharacterCard | ActionCard | ItemCard | LocationCard)[],
  targetDir: string,
  subDir: string,
  dryRun = false,
): void {
  const indexPath = join(targetDir, subDir, "index.ts");
  const content = generateIndexContent(cards);

  if (dryRun) {
    return;
  }

  writeFileSync(indexPath, content, "utf-8");
}

/**
 * Get subdirectory for card type
 */
function getSubdirectoryForCardType(
  cardType: "character" | "action" | "item" | "location",
): string {
  switch (cardType) {
    case "character":
      return "characters";
    case "action":
      return "actions";
    case "item":
      return "items";
    case "location":
      return "locations";
    default:
      throw new Error(`Unknown card type: ${cardType}`);
  }
}

/**
 * Generate filename from card
 */
function generateFilename(
  card: CharacterCard | ActionCard | ItemCard | LocationCard,
): string {
  // Format: {cardNumber}-{name-in-kebab-case}.ts
  const cardNumber = String(card.cardNumber).padStart(3, "0");
  const nameKebab = toKebabCase(card.name);

  // For characters and items with versions, include version
  let suffix = "";
  if ("version" in card && card.version && card.version !== "") {
    const versionKebab = toKebabCase(card.version);
    suffix = `-${versionKebab}`;
  }

  return `${cardNumber}-${nameKebab}${suffix}.ts`;
}

/**
 * Convert string to kebab-case
 */
function toKebabCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Generate card file content
 */
function generateCardFileContent(
  card: CharacterCard | ActionCard | ItemCard | LocationCard,
): string {
  // Generate variable name from card name
  const varName = toCamelCase(card.name);

  // Check if this is a song (action with actionSubtype: "song")
  const isSong =
    card.cardType === "action" &&
    "actionSubtype" in card &&
    card.actionSubtype === "song";

  // Start with imports
  let content = `import type { ${
    isSong
      ? "ActionCard"
      : card.cardType === "character"
        ? "CharacterCard"
        : card.cardType === "item"
          ? "ItemCard"
          : "ActionCard"
  } } from "@tcg/lorcana-types/cards/card-types";\n\n`;

  // Add card export
  content += `export const ${varName}: ${
    isSong
      ? "ActionCard"
      : card.cardType === "character"
        ? "CharacterCard"
        : card.cardType === "item"
          ? "ItemCard"
          : "ActionCard"
  } = {\n`;

  // Add card properties (alphabetically, with certain order exceptions)
  const orderedKeys = getOrderedKeys(
    card as unknown as Record<string, unknown>,
  );
  for (const key of orderedKeys) {
    if (key === "abilities") {
      // Add abilities last
      continue;
    }
    content += formatCardProperty(
      key,
      (card as unknown as Record<string, unknown>)[key],
    );
  }

  // Add abilities
  if (card.abilities && card.abilities.length > 0) {
    content += "  abilities: [\n";
    for (const ability of card.abilities) {
      content += formatAbility(ability as unknown as Record<string, unknown>);
    }
    content += "  ],\n";
  }

  content += "};\n";

  return content;
}

/**
 * Get ordered keys for card properties
 */
function getOrderedKeys(card: Record<string, unknown>): string[] {
  const keys = Object.keys(card);

  // Preferred order for common properties
  const preferredOrder = [
    "id",
    "cardType",
    "name",
    "version",
    "fullName",
    "inkType",
    "franchise",
    "set",
    "text",
    "cost",
    "strength",
    "willpower",
    "lore",
    "cardNumber",
    "inkable",
    "rarity",
    "externalIds",
    "classifications",
  ];

  // Sort keys: preferred order first, then alphabetically
  const sortedKeys = keys.sort((a, b) => {
    const aIndex = preferredOrder.indexOf(a);
    const bIndex = preferredOrder.indexOf(b);

    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex;
    }
    if (aIndex !== -1) {
      return -1;
    }
    if (bIndex !== -1) {
      return 1;
    }

    return a.localeCompare(b);
  });

  return sortedKeys;
}

/**
 * Format card property as string
 */
function formatCardProperty(key: string, value: unknown): string {
  if (value === undefined || value === null) {
    return "";
  }

  const formattedValue = formatValue(value, 2);
  return `  ${key}: ${formattedValue},\n`;
}

/**
 * Format a value for output
 */
function formatValue(value: unknown, indent: number): string {
  if (typeof value === "string") {
    return `"${value}"`;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }

    const innerIndent = indent + 2;
    const items = value.map(
      (v) => " ".repeat(innerIndent) + formatValue(v, innerIndent),
    );

    return `[\n${items.join(",\n")},\n${" ".repeat(indent)}]`;
  }

  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return "{}";
    }

    const innerIndent = indent + 2;
    const props = entries.map(([k, v]) => {
      return " ".repeat(innerIndent) + k + ": " + formatValue(v, innerIndent);
    });

    return `{\n${props.join(",\n")},\n${" ".repeat(indent)}}`;
  }

  return String(value);
}

/**
 * Format ability for output
 */
function formatAbility(ability: Record<string, unknown>, indent = 4): string {
  const spaces = " ".repeat(indent);
  let content = spaces + "{\n";

  const keys = Object.keys(ability);
  for (const key of keys) {
    content +=
      spaces +
      "  " +
      key +
      ": " +
      formatValue(ability[key], indent + 4) +
      ",\n";
  }

  content += spaces + "},\n";
  return content;
}

/**
 * Convert string to camelCase
 */
function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
}

/**
 * Generate index file content
 */
function generateIndexContent(
  cards: (CharacterCard | ActionCard | ItemCard | LocationCard)[],
): string {
  // Generate exports for each card
  const exports = cards.map((card) => {
    const varName = toCamelCase(card.name);
    const filename = generateFilename(card).replace(".ts", "");
    return `export { ${varName} } from "./${filename}";`;
  });

  return exports.join("\n") + "\n";
}

/**
 * Create directory structure for a set
 *
 * @param targetDir - Target directory (e.g., "src/cards/001")
 * @param dryRun - If true, don't actually create directories
 */
export function createDirectoryStructure(
  targetDir: string,
  dryRun = false,
): void {
  const subDirs = ["characters", "actions", "items", "songs"];

  for (const subDir of subDirs) {
    const fullPath = join(targetDir, subDir);

    if (!(dryRun || existsSync(fullPath))) {
      mkdirSync(fullPath, { recursive: true });
    }
  }
}
