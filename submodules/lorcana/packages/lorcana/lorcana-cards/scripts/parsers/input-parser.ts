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
export function loadRavensburgerJson(inputPath?: string): RavensburgerInputJson {
  const filePath =
    inputPath || path.resolve(__dirname, "../../data/inputs/ravensburger-input.json");

  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData) as RavensburgerInputJson;
}

/**
 * Load and parse lorcast-input.json (Lorcast API data with symbols)
 */
export function loadLorcastJson(inputPath?: string): LorcastInputCard[] {
  const filePath = inputPath || path.resolve(__dirname, "../../data/inputs/lorcast-input.json");

  const rawData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(rawData) as LorcastInputCard[];
}

/**
 * Normalize a string for card matching (lowercase, remove special chars)
 */
export function normalizeForMatching(str: string | undefined | null): string {
  if (!str) return "";
  return str.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Create a lookup key for matching cards between sources
 * Uses name + version/subtitle
 */
export function createMatchKey(name: string, version: string | undefined | null): string {
  return `${normalizeForMatching(name)}|${normalizeForMatching(version)}`;
}

/**
 * Build a lookup map from Lorcast cards for efficient matching
 */
function buildLorcastLookup(lorcastCards: LorcastInputCard[]): Map<string, LorcastInputCard> {
  const lookup = new Map<string, LorcastInputCard>();

  for (const card of lorcastCards) {
    const key = createMatchKey(card.name, card.version);
    lookup.set(key, card);
  }

  return lookup;
}

/**
 * Build Lorcast card index for external ID lookup (lorcast id, tcgPlayer id)
 * Key format: normalized "name|version" for matching Ravensburger cards
 */
export function buildLorcastCardIndex(lorcastPath?: string): Map<string, LorcastInputCard> {
  const cards = loadLorcastJson(lorcastPath);
  return buildLorcastLookup(cards);
}

/**
 * Extract prices from Lorcast price data
 */
export function extractPrices(lorcastPrices: Record<string, string> | undefined):
  | {
      usd?: string;
      usdFoil?: string;
      usdEtched?: string;
    }
  | undefined {
  if (!lorcastPrices || Object.keys(lorcastPrices).length === 0) {
    return undefined;
  }

  const prices: { usd?: string; usdFoil?: string; usdEtched?: string } = {};

  if (lorcastPrices.usd) {
    prices.usd = lorcastPrices.usd;
  }
  if (lorcastPrices.usd_foil) {
    prices.usdFoil = lorcastPrices.usd_foil;
  }
  if (lorcastPrices.usd_etched) {
    prices.usdEtched = lorcastPrices.usd_etched;
  }

  return Object.keys(prices).length > 0 ? prices : undefined;
}

/**
 * Extract legalities from Lorcast legalities data
 */
export function extractLegalities(lorcastLegalities: Record<string, string> | undefined):
  | {
      core?: "legal" | "banned" | "not_legal" | "suspended" | "restricted";
    }
  | undefined {
  if (!lorcastLegalities || Object.keys(lorcastLegalities).length === 0) {
    return undefined;
  }

  const legalities: {
    core?: "legal" | "banned" | "not_legal" | "suspended" | "restricted";
  } = {};

  const core = lorcastLegalities.core;
  if (core && ["legal", "banned", "not_legal", "suspended", "restricted"].includes(core)) {
    legalities.core = core as "legal" | "banned" | "not_legal" | "suspended" | "restricted";
  }

  return Object.keys(legalities).length > 0 ? legalities : undefined;
}

/**
 * Merge Lorcast text into a Ravensburger card
 * Only replaces rules_text if Lorcast has data
 */
function mergeCardText(card: InputCard, lorcastLookup: Map<string, LorcastInputCard>): InputCard {
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
      characters: ravensburger.cards.characters.map((card) => mergeCardText(card, lorcastLookup)),
      locations: ravensburger.cards.locations.map((card) => mergeCardText(card, lorcastLookup)),
      items: ravensburger.cards.items.map((card) => mergeCardText(card, lorcastLookup)),
      actions: ravensburger.cards.actions.map((card) => mergeCardText(card, lorcastLookup)),
    },
  };
}

/**
 * Get all cards from input, flattened into a single array with card type added
 */
export function getAllCards(input: LorcanaInputJson): Array<InputCard & { cardType: CardType }> {
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
 * Group cards by full name (same game card across printings)
 */
export function groupByFullName(
  cards: Array<InputCard & { cardType: CardType }>,
): Map<string, Array<InputCard & { cardType: CardType }>> {
  const groups = new Map<string, Array<InputCard & { cardType: CardType }>>();

  for (const card of cards) {
    const fullName = getFullNameFromCard(card);
    const existing = groups.get(fullName) || [];
    existing.push(card);
    groups.set(fullName, existing);
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
  /**
   * Promo sheet denominator (e.g. "P3" for "43/P3 EN 12"). When set, totalCards is not a set size.
   */
  promoSheetCode?: string;
}

export function parseCardIdentifier(identifier: string): ParsedCardIdentifier | null {
  // Match pattern: "1/204 EN 10" or "205/204 EN 10"
  const standard = identifier.match(/^(\d+)\/(\d+)\s+(\w+)(?:\s+(\d+))?$/);
  if (standard) {
    return {
      cardNumber: Number.parseInt(standard[1], 10),
      totalCards: Number.parseInt(standard[2], 10),
      language: standard[3],
      setNumber: standard[4] ? Number.parseInt(standard[4], 10) : null,
    };
  }

  // Promo / challenge sheet: "43/P3 EN 12" (denominator is a sheet code, not set size)
  const promo = identifier.match(/^(\d+)\/(P\d+)\s+(\w+)(?:\s+(\d+))?$/i);
  if (promo) {
    return {
      cardNumber: Number.parseInt(promo[1], 10),
      totalCards: 0,
      language: promo[3],
      setNumber: promo[4] ? Number.parseInt(promo[4], 10) : null,
      promoSheetCode: promo[2].toUpperCase(),
    };
  }

  return null;
}

/**
 * Get unique full names from all cards
 */
export function getUniqueFullNames(cards: Array<InputCard & { cardType: CardType }>): string[] {
  const names = new Set<string>();

  for (const card of cards) {
    names.add(getFullNameFromCard(card));
  }

  return Array.from(names);
}

/**
 * Get all card sets from input
 */
export function getCardSets(input: LorcanaInputJson): InputCardSet[] {
  return input.card_sets || [];
}

/**
 * Full name for identity: name + " - " + subtitle when subtitle exists.
 */
export function getFullNameFromCard(card: InputCard): string {
  return card.subtitle ? `${card.name} - ${card.subtitle}` : card.name;
}

/**
 * Determine if a card is a special rarity variant (Enchanted, Epic, Iconic, Promo, Challenge).
 * special_rarity_id from Ravensburger is the source of truth when present; card number heuristic is fallback.
 */
export function getSpecialRarity(
  card: InputCard,
): "enchanted" | "epic" | "iconic" | "promo" | "challenge" | null {
  if (card.rarity === "ENCHANTED") return "enchanted";
  if (card.special_rarity_id === "PROMO") return "promo";
  if (card.special_rarity_id === "EPIC") return "epic";
  if (card.special_rarity_id === "ICONIC") return "iconic";
  if (card.special_rarity_id === "CHALLENGE") return "challenge";

  // Fallback: check card number vs set size for Epic/Iconic when special_rarity_id is not set
  const parsed = parseCardIdentifier(card.card_identifier);
  if (parsed?.promoSheetCode) {
    return null;
  }
  if (parsed && parsed.cardNumber > parsed.totalCards) {
    if (parsed.cardNumber >= 241) return "iconic";
    if (parsed.cardNumber >= 205) return "epic";
  }

  return null;
}

/**
 * Generate printing ID from set and card number.
 * Optional specialRarity suffix ensures unique ids for alternate arts (e.g. set1-098-enchanted).
 * When promoSheetCode is set (e.g. "P3"), the id uses set{N}-p3-NNN so promo numbers never collide with main-set slots.
 */
export function generatePrintingId(
  setId: string,
  cardNumber: number,
  specialRarity?: string | null,
  promoSheetCode?: string | null,
): string {
  const paddedNumber = cardNumber.toString().padStart(3, "0");
  const base = promoSheetCode
    ? `${setId}-${promoSheetCode.toLowerCase()}-${paddedNumber}`
    : `${setId}-${paddedNumber}`;
  if (specialRarity) {
    return `${base}-${specialRarity}`;
  }
  return base;
}

/**
 * One (card, set) pair = one printing to emit.
 * Used to expand input so we produce one CardDefinition per printing.
 */
export interface PrintingItem {
  card: InputCard & { cardType: CardType };
  setId: string;
}

/**
 * Expand all cards to one item per printing (per set in card_sets).
 * Only includes sets in expansionSetIds. Used for "one CardDefinition per printing" pipeline.
 */
export function expandToPrintingItems(
  cards: Array<InputCard & { cardType: CardType }>,
  expansionSetIds: Set<string>,
): PrintingItem[] {
  const items: PrintingItem[] = [];
  for (const card of cards) {
    for (const setId of card.card_sets) {
      if (expansionSetIds.has(setId)) {
        items.push({ card, setId });
      }
    }
  }
  return items;
}
