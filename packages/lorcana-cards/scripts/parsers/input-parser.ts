/**
 * Input Parser
 *
 * Parses ravensburger-input.json and lorcast-input.json and provides utilities
 * for accessing card data. Merges both data sources with:
 * - Card text from Lorcast (has symbols like {S}, {I})
 * - All other data from Ravensburger
 */

import fs from "node:fs";
import path from "node:path";
import type {
  CardType,
  InputCard,
  InputCardSet,
  LorcanaInputJson,
  LorcastInputCard,
  RavensburgerInputJson,
} from "../types";

/**
 * Load and parse ravensburger-input.json (official Ravensburger API data)
 */
export function loadRavensburgerJson(
  inputPath?: string,
): RavensburgerInputJson {
  const filePath =
    inputPath ||
    path.resolve(__dirname, "../../data/inputs/ravensburger-input.json");

  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData) as RavensburgerInputJson;
}

/**
 * Load and parse lorcast-input.json (Lorcast API data with symbols)
 */
export function loadLorcastJson(inputPath?: string): LorcastInputCard[] {
  const filePath =
    inputPath ||
    path.resolve(__dirname, "../../data/inputs/lorcast-input.json");

  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData) as LorcastInputCard[];
}

/**
 * Normalize a string for card matching (lowercase, remove special chars)
 */
function normalizeForMatching(str: string | undefined | null): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

/**
 * Create a lookup key for matching cards between sources
 * Uses name + version/subtitle
 */
function createMatchKey(
  name: string,
  version: string | undefined | null,
): string {
  return `${normalizeForMatching(name)}|${normalizeForMatching(version)}`;
}

/**
 * Build a lookup map from Lorcast cards for efficient matching
 */
function buildLorcastLookup(
  lorcastCards: LorcastInputCard[],
): Map<string, LorcastInputCard> {
  const lookup = new Map<string, LorcastInputCard>();

  for (const card of lorcastCards) {
    const key = createMatchKey(card.name, card.version);
    lookup.set(key, card);
  }

  return lookup;
}

/**
 * Merge Lorcast text into a Ravensburger card
 * Only replaces rules_text if Lorcast has data
 */
function mergeCardText(
  card: InputCard,
  lorcastLookup: Map<string, LorcastInputCard>,
): InputCard {
  const key = createMatchKey(card.name, card.subtitle);
  const lorcastCard = lorcastLookup.get(key);

  if (lorcastCard?.text) {
    return {
      ...card,
      rules_text: lorcastCard.text,
    };
  }

  return card;
}

/**
 * Load merged input data from both sources
 * - Card text from Lorcast (has symbols like {S}, {I})
 * - All other data from Ravensburger
 */
export function loadMergedInput(
  ravensburgerPath?: string,
  lorcastPath?: string,
): RavensburgerInputJson {
  const ravensburger = loadRavensburgerJson(ravensburgerPath);
  const lorcastCards = loadLorcastJson(lorcastPath);
  const lorcastLookup = buildLorcastLookup(lorcastCards);

  // Merge Lorcast text into Ravensburger cards
  return {
    ...ravensburger,
    cards: {
      characters: ravensburger.cards.characters.map((card) =>
        mergeCardText(card, lorcastLookup),
      ),
      locations: ravensburger.cards.locations.map((card) =>
        mergeCardText(card, lorcastLookup),
      ),
      items: ravensburger.cards.items.map((card) =>
        mergeCardText(card, lorcastLookup),
      ),
      actions: ravensburger.cards.actions.map((card) =>
        mergeCardText(card, lorcastLookup),
      ),
    },
  };
}

/**
 * Load and parse input JSON - uses merged data by default
 * @deprecated Use loadMergedInput() for new code
 */
export function loadInputJson(inputPath?: string): LorcanaInputJson {
  // For backwards compatibility, if a specific path is provided,
  // load that file directly
  if (inputPath) {
    const rawData = fs.readFileSync(inputPath, "utf-8");
    return JSON.parse(rawData) as LorcanaInputJson;
  }

  // Otherwise, use the merged data source
  return loadMergedInput();
}

/**
 * Get all cards from input, flattened into a single array with card type added
 */
export function getAllCards(
  input: LorcanaInputJson,
): Array<InputCard & { cardType: CardType }> {
  const cards: Array<InputCard & { cardType: CardType }> = [];

  for (const card of input.cards.characters || []) {
    cards.push({ ...card, cardType: "character" });
  }

  for (const card of input.cards.locations || []) {
    cards.push({ ...card, cardType: "location" });
  }

  for (const card of input.cards.items || []) {
    cards.push({ ...card, cardType: "item" });
  }

  for (const card of input.cards.actions || []) {
    cards.push({ ...card, cardType: "action" });
  }

  return cards;
}

/**
 * Group cards by deck_building_id (same game card across printings)
 */
export function groupByDeckBuildingId(
  cards: Array<InputCard & { cardType: CardType }>,
): Map<string, Array<InputCard & { cardType: CardType }>> {
  const groups = new Map<string, Array<InputCard & { cardType: CardType }>>();

  for (const card of cards) {
    if (!card.deck_building_id) continue;

    const existing = groups.get(card.deck_building_id) || [];
    existing.push(card);
    groups.set(card.deck_building_id, existing);
  }

  return groups;
}

/**
 * Parse card_identifier to extract set and card number
 * Format: "1/204 EN 10" -> { cardNumber: 1, totalCards: 204, setNumber: 10 }
 */
export interface ParsedCardIdentifier {
  cardNumber: number;
  totalCards: number;
  setNumber: number | null;
  language: string;
}

export function parseCardIdentifier(
  identifier: string,
): ParsedCardIdentifier | null {
  // Match pattern: "1/204 EN 10" or "205/204 EN 10"
  const match = identifier.match(/^(\d+)\/(\d+)\s+(\w+)(?:\s+(\d+))?$/);

  if (!match) return null;

  return {
    cardNumber: Number.parseInt(match[1], 10),
    totalCards: Number.parseInt(match[2], 10),
    language: match[3],
    setNumber: match[4] ? Number.parseInt(match[4], 10) : null,
  };
}

/**
 * Get unique deck_building_ids from all cards
 */
export function getUniqueDeckBuildingIds(
  cards: Array<InputCard & { cardType: CardType }>,
): string[] {
  const ids = new Set<string>();

  for (const card of cards) {
    if (card.deck_building_id) {
      ids.add(card.deck_building_id);
    }
  }

  return Array.from(ids);
}

/**
 * Get all card sets from input
 */
export function getCardSets(input: LorcanaInputJson): InputCardSet[] {
  return input.card_sets || [];
}

/**
 * Determine if a card is a special rarity variant (Enchanted, Epic, Iconic, Promo)
 */
export function getSpecialRarity(
  card: InputCard,
): "enchanted" | "epic" | "iconic" | "promo" | null {
  if (card.rarity === "ENCHANTED") return "enchanted";
  if (card.special_rarity_id === "PROMO") return "promo";

  // Check card number vs set size for Epic/Iconic detection
  const parsed = parseCardIdentifier(card.card_identifier);
  if (parsed && parsed.cardNumber > parsed.totalCards) {
    // Cards above set size are special variants
    // Epic: typically 205-240 range
    // Iconic: typically 241+ range
    if (parsed.cardNumber >= 241) return "iconic";
    if (parsed.cardNumber >= 205) return "epic";
  }

  return null;
}

/**
 * Generate printing ID from set and card number
 */
export function generatePrintingId(setId: string, cardNumber: number): string {
  const paddedNumber = cardNumber.toString().padStart(3, "0");
  return `${setId}-${paddedNumber}`;
}
