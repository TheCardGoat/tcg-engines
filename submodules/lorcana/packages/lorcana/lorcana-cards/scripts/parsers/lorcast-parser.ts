/**
 * Lorcast Parser
 *
 * Parses lorcast-input.json and provides a lookup index for card text.
 * Lorcast data contains proper symbols ({S}, {I}, {D}) in the text field
 * that Ravensburger data lacks.
 */

import fs from "node:fs";
import path from "node:path";
import { createMatchKey } from "./input-parser";

/**
 * Lorcast card structure (relevant fields only)
 */
export interface LorcastCard {
  id: string;
  name: string;
  version: string;
  set: {
    id: string;
    code: string;
    name: string;
  };
  collector_number: string;
  text: string | null;
  keywords: string[];
}

/**
 * Lorcast text index - maps card key to text
 * Key format: "{setCode}-{cardNumber}-{name}-{version}"
 */
export type LorcastTextIndex = Map<string, string>;

/**
 * Full Lorcast card index - maps card key to full card data
 * Used for accessing prices, legalities, image URIs, etc.
 */
export type LorcastFullIndex = Map<string, LorcastCard>;

/**
 * Full Lorcast card data interface (extends LorcastCard with additional fields)
 */
export interface LorcastFullCard extends LorcastCard {
  tcgplayer_id?: number;
  legalities: Record<string, string>;
  prices: Record<string, string>;
  image_uris: {
    digital: {
      small: string;
      normal: string;
      large: string;
    };
  };
  lang: string;
  released_at: string;
  illustrators: string[];
}

/**
 * Load and parse lorcast-input.json with full card data
 */
export function loadLorcastInput(inputPath?: string): LorcastFullCard[] {
  const filePath = inputPath || path.resolve(__dirname, "../../data/inputs/lorcast-input.json");

  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData) as LorcastFullCard[];
}

/**
 * Normalize set code for matching
 * Lorcast uses "10" but Ravensburger uses "set10", so we normalize to just the number
 */
function normalizeSetCode(code: string): string {
  // Remove "set" prefix if present, convert to lowercase
  return code.replace(/^set/i, "").toLowerCase();
}

/**
 * Generate lookup key for a card
 */
function generateLookupKey(
  setCode: string,
  cardNumber: string,
  name: string,
  version: string | null | undefined,
): string {
  const normalizedSetCode = normalizeSetCode(setCode);
  const normalizedName = (name || "").toLowerCase().trim();
  const normalizedVersion = (version || "").toLowerCase().trim();
  return `${normalizedSetCode}-${cardNumber}-${normalizedName}-${normalizedVersion}`;
}

/**
 * Build a lookup index from Lorcast cards
 * This allows fast text lookup by set code, card number, name, and version
 */
export function buildLorcastIndex(cards: LorcastCard[]): LorcastTextIndex {
  const index: LorcastTextIndex = new Map();

  for (const card of cards) {
    if (!card.text) continue;

    const key = generateLookupKey(card.set.code, card.collector_number, card.name, card.version);

    // Handle potential duplicates (shouldn't happen, but log if it does)
    if (index.has(key)) {
      console.warn(`Duplicate Lorcast key: ${key}`);
    }

    index.set(key, card.text);
  }

  return index;
}

/**
 * Get card text from Lorcast index
 * Returns null if no match found
 */
export function getLorcastText(
  index: LorcastTextIndex,
  setCode: string,
  cardNumber: number | string,
  name: string,
  version: string | null | undefined,
): string | null {
  const key = generateLookupKey(setCode, String(cardNumber), name, version);

  return index.get(key) || null;
}

/**
 * Extract set code from Ravensburger card_identifier
 * Format: "1/204 EN 10" -> "10"
 */
export function extractSetCodeFromIdentifier(identifier: string): string | null {
  // Match pattern: "1/204 EN 10" -> capture "10"
  const match = identifier.match(/\d+\/\d+\s+\w+\s+(\d+)/);
  return match ? match[1] : null;
}

/**
 * Extract card number from Ravensburger card_identifier
 * Format: "1/204 EN 10" -> 1
 */
export function extractCardNumberFromIdentifier(identifier: string): number | null {
  // Match pattern: "1/204 EN 10" -> capture "1"
  const match = identifier.match(/^(\d+)\//);
  return match ? Number.parseInt(match[1], 10) : null;
}

/**
 * Build a full lookup index from Lorcast cards (includes all data)
 * Key format: normalized "name|version" for matching Ravensburger cards
 */
export function buildLorcastFullIndex(cards: LorcastFullCard[]): LorcastFullIndex {
  const index: LorcastFullIndex = new Map();
  let collisionCount = 0;
  const sampleKeys: string[] = [];

  for (const card of cards) {
    const key = createMatchKey(card.name, card.version);
    if (index.has(key)) {
      collisionCount++;
      if (sampleKeys.length < 5 && !sampleKeys.includes(key)) {
        sampleKeys.push(key);
      }
    }
    index.set(key, card);
  }

  if (collisionCount > 0) {
    console.warn(
      `  Lorcast full index: ${collisionCount} duplicate name|version key(s); last Lorcast row wins (metadata may not match every printing). Sample keys: ${sampleKeys.join("; ")}`,
    );
  }

  return index;
}

/**
 * Get full Lorcast card data by name and version
 */
export function getLorcastCardData(
  index: LorcastFullIndex,
  name: string,
  version: string | undefined | null,
): LorcastFullCard | undefined {
  const key = createMatchKey(name, version);
  return index.get(key);
}

/**
 * Load Lorcast data and build both indexes in a single read.
 * Use this instead of calling loadAndBuildLorcastIndex and loadAndBuildLorcastFullIndex separately.
 */
export function loadLorcastAndBuildIndexes(inputPath?: string): {
  textIndex: LorcastTextIndex;
  fullIndex: LorcastFullIndex;
} {
  const cards = loadLorcastInput(inputPath);
  console.log(`  Loaded ${cards.length} Lorcast cards`);

  const textIndex = buildLorcastIndex(cards);
  const fullIndex = buildLorcastFullIndex(cards);
  console.log(
    `  Built text index (${textIndex.size} entries) and full index (${fullIndex.size} entries)`,
  );

  return { textIndex, fullIndex };
}

/**
 * Load Lorcast data and build the text index
 */
export function loadAndBuildLorcastIndex(inputPath?: string): LorcastTextIndex {
  const cards = loadLorcastInput(inputPath);
  console.log(`  Loaded ${cards.length} Lorcast cards`);

  const index = buildLorcastIndex(cards);
  console.log(`  Built text index with ${index.size} entries`);

  return index;
}

/**
 * Load Lorcast data and build the full card index
 */
export function loadAndBuildLorcastFullIndex(inputPath?: string): LorcastFullIndex {
  const cards = loadLorcastInput(inputPath);
  console.log(`  Loaded ${cards.length} Lorcast cards`);

  const index = buildLorcastFullIndex(cards);
  console.log(`  Built full card index with ${index.size} entries`);

  return index;
}
