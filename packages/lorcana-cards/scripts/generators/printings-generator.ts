/**
 * Printings Generator
 *
 * Generates printings.json from input cards.
 * Each printing represents a physical card instance with variants.
 */

import {
  generatePrintingId,
  getSpecialRarity,
  parseCardIdentifier,
} from "../parsers/input-parser";
import type {
  CardPrinting,
  CardType,
  CardVariant,
  IdMapping,
  InputCard,
  InputCardVariant,
  Rarity,
  SpecialRarity,
} from "../types";

/**
 * Map rarity string to output format
 */
function mapRarity(rarity: string): Rarity {
  const rarityMap: Record<string, Rarity> = {
    COMMON: "common",
    UNCOMMON: "uncommon",
    RARE: "rare",
    SUPER_RARE: "super_rare",
    LEGENDARY: "legendary",
    ENCHANTED: "enchanted",
    SPECIAL: "special",
  };

  return rarityMap[rarity.toUpperCase()] || "common";
}

/**
 * Transform input variant to output variant
 */
function transformVariant(inputVariant: InputCardVariant): CardVariant {
  const variant: CardVariant = {
    type: inputVariant.variant_id === "Foiled" ? "foil" : "regular",
    imageUrl: inputVariant.detail_image_url,
  };

  if (inputVariant.foil_type) {
    variant.foilType = inputVariant.foil_type;
  }

  if (inputVariant.foil_mask_url) {
    variant.foilMaskUrl = inputVariant.foil_mask_url;
  }

  return variant;
}

/**
 * Transform a single input card to a printing
 */
export function transformToPrinting(
  card: InputCard & { cardType: CardType },
  setId: string,
  idMapping: IdMapping,
): CardPrinting | null {
  const parsed = parseCardIdentifier(card.card_identifier);
  if (!parsed) return null;

  const printingId = generatePrintingId(setId, parsed.cardNumber);
  const shortId = idMapping.byDeckBuildingId[card.deck_building_id];

  if (!shortId) {
    console.warn(`No short ID found for ${card.deck_building_id}`);
    return null;
  }

  const printing: CardPrinting = {
    id: printingId,
    gameCardId: shortId,
    set: setId,
    cardNumber: parsed.cardNumber,
    cardIdentifier: card.card_identifier,
    rarity: mapRarity(card.rarity),
    variants: (card.variants || []).map(transformVariant),
  };

  // Add special rarity if applicable
  const specialRarity = getSpecialRarity(card);
  if (specialRarity) {
    printing.specialRarity = specialRarity;
  }

  // Add optional fields
  if (card.author) {
    printing.author = card.author;
  }

  if (card.flavor_text) {
    printing.flavorText = card.flavor_text;
  }

  return printing;
}

/**
 * Generate all printings from input cards
 */
export function generatePrintings(
  cards: Array<InputCard & { cardType: CardType }>,
  idMapping: IdMapping,
): Record<string, CardPrinting> {
  const printings: Record<string, CardPrinting> = {};

  for (const card of cards) {
    // Each card can appear in multiple sets
    for (const setId of card.card_sets) {
      const printing = transformToPrinting(card, setId, idMapping);
      if (printing) {
        printings[printing.id] = printing;
      }
    }
  }

  return printings;
}

/**
 * Calculate total cards per set from printings
 */
export function calculateSetTotals(
  printings: Record<string, CardPrinting>,
): Map<string, number> {
  const setTotals = new Map<string, number>();

  for (const printing of Object.values(printings)) {
    const current = setTotals.get(printing.set) || 0;
    // Only count base cards (not special rarities) for set total
    if (!printing.specialRarity) {
      setTotals.set(printing.set, Math.max(current, printing.cardNumber));
    }
  }

  return setTotals;
}
