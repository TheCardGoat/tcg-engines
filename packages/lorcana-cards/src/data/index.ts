/**
 * Card Data Module
 *
 * This module exports card data and provides lookup utilities:
 * - Canonical cards (unique game cards)
 * - Printings (physical card instances)
 * - Sets (card set metadata)
 * - ID mappings (short ID <-> deck_building_id)
 *
 * @module data
 */

// Type definitions
export type CardType = "character" | "action" | "item" | "location";

export type InkType =
  | "amber"
  | "amethyst"
  | "emerald"
  | "ruby"
  | "sapphire"
  | "steel";

export type Rarity =
  | "common"
  | "uncommon"
  | "rare"
  | "super_rare"
  | "legendary"
  | "enchanted"
  | "special";

export type SpecialRarity = "enchanted" | "epic" | "iconic" | "promo";

export interface AbilityDefinition {
  id?: string;
  name?: string | null;
  text: string;
  type: "triggered" | "activated" | "static" | "keyword";
}

export interface CanonicalCard {
  id: string;
  deckBuildingId: string;
  name: string;
  version: string;
  fullName: string;
  cardType: CardType;
  inkType: InkType | [InkType, InkType];
  cost: number;
  inkable: boolean;
  strength?: number;
  willpower?: number;
  lore?: number;
  moveCost?: number;
  classifications?: string[];
  actionSubtype?: "song" | null;
  keywords?: string[];
  rulesText: string;
  abilities?: AbilityDefinition[];
  printings: string[];
}

export interface CardVariant {
  type: "regular" | "foil";
  imageUrl: string;
  thumbnailUrl?: string;
  foilType?: string;
  foilMaskUrl?: string;
}

export interface CardPrinting {
  id: string;
  gameCardId: string;
  set: string;
  cardNumber: number;
  cardIdentifier: string;
  rarity: Rarity;
  specialRarity?: SpecialRarity;
  author?: string;
  flavorText?: string;
  variants: CardVariant[];
}

export interface SetDefinition {
  id: string;
  name: string;
  code: string;
  sortNumber: number;
  type: "EXPANSION" | "QUEST";
  totalCards?: number;
  thumbnailUrl?: string;
}

export interface IdMapping {
  byShortId: Record<string, string>;
  byDeckBuildingId: Record<string, string>;
}

// Import generated data
// These will be populated after running the generate script
import canonicalCardsData from "./canonical-cards.json";
import idMappingData from "./id-mapping.json";
import printingsData from "./printings.json";
import setsData from "./sets.json";

// Type assertions for imported JSON
// Using `as unknown as` because JSON inference can't express tuple types correctly
export const canonicalCards = canonicalCardsData as unknown as Record<
  string,
  CanonicalCard
>;
export const printings = printingsData as unknown as Record<
  string,
  CardPrinting
>;
export const sets = setsData as unknown as Record<string, SetDefinition>;
export const idMapping = idMappingData as unknown as IdMapping;

// Computed collections
// Internal-only: allCanonicalCards should not be exported - use allCards from @tcg/lorcana-cards/cards instead
const allCanonicalCards: CanonicalCard[] = Object.values(canonicalCards);
export const allPrintings: CardPrinting[] = Object.values(printings);
export const allSets: SetDefinition[] = Object.values(sets).sort(
  (a, b) => a.sortNumber - b.sortNumber,
);

// ============================================================================
// Lookup Utilities
// ============================================================================

/**
 * Get a canonical card by its short ID
 */
export function getCanonicalCard(shortId: string): CanonicalCard | undefined {
  return canonicalCards[shortId];
}

/**
 * Get a canonical card by its deck_building_id
 */
export function getCanonicalCardByDeckBuildingId(
  deckBuildingId: string,
): CanonicalCard | undefined {
  const shortId = idMapping.byDeckBuildingId[deckBuildingId];
  if (!shortId) return undefined;
  return canonicalCards[shortId];
}

/**
 * Get a printing by its ID (e.g., "set10-001")
 */
export function getPrinting(printingId: string): CardPrinting | undefined {
  return printings[printingId];
}

/**
 * Get all printings for a canonical card
 */
export function getPrintingsForCard(shortId: string): CardPrinting[] {
  const card = canonicalCards[shortId];
  if (!card) return [];

  return card.printings
    .map((id) => printings[id])
    .filter((p): p is CardPrinting => p !== undefined);
}

/**
 * Get the canonical card for a printing
 */
export function getCardForPrinting(
  printingId: string,
): CanonicalCard | undefined {
  const printing = printings[printingId];
  if (!printing) return undefined;

  return canonicalCards[printing.gameCardId];
}

/**
 * Get a set by its ID
 */
export function getSet(setId: string): SetDefinition | undefined {
  return sets[setId];
}

/**
 * Get all cards in a set (as printings)
 */
export function getCardsInSet(setId: string): CardPrinting[] {
  return allPrintings.filter((p) => p.set === setId);
}

/**
 * Get all reprints of a card (other printings of the same game card)
 */
export function getReprintIds(shortId: string): string[] {
  const card = canonicalCards[shortId];
  if (!card || card.printings.length <= 1) return [];

  return card.printings;
}

/**
 * Search cards by name (case-insensitive)
 */
export function searchCardsByName(query: string): CanonicalCard[] {
  const lowerQuery = query.toLowerCase();
  return allCanonicalCards.filter(
    (card) =>
      card.name.toLowerCase().includes(lowerQuery) ||
      card.fullName.toLowerCase().includes(lowerQuery),
  );
}

/**
 * Get cards by type
 */
export function getCardsByType(cardType: CardType): CanonicalCard[] {
  return allCanonicalCards.filter((card) => card.cardType === cardType);
}

/**
 * Get cards by ink type
 */
export function getCardsByInkType(inkType: InkType): CanonicalCard[] {
  return allCanonicalCards.filter((card) => {
    if (Array.isArray(card.inkType)) {
      return card.inkType.includes(inkType);
    }
    return card.inkType === inkType;
  });
}

/**
 * Convert short ID to deck_building_id
 */
export function shortIdToDeckBuildingId(shortId: string): string | undefined {
  return idMapping.byShortId[shortId];
}

/**
 * Convert deck_building_id to short ID
 */
export function deckBuildingIdToShortId(
  deckBuildingId: string,
): string | undefined {
  return idMapping.byDeckBuildingId[deckBuildingId];
}
