/**
 * Deck Validation (Rule 2.1)
 *
 * Validates a deck against Lorcana deck building rules:
 * - Minimum 60 cards (Rule 2.1.1.1)
 * - Maximum 2 ink types (Rule 2.1.1.2)
 * - Maximum 4 copies per full name (Rule 2.1.1.3)
 */

import type {
  DeckStats,
  DeckValidationError,
  DeckValidationResult,
  InkType,
  LorcanaCardDefinition,
} from "@tcg/lorcana-types";
import {
  MAX_COPIES_PER_CARD,
  MAX_INK_TYPES,
  MIN_DECK_SIZE,
  getFullName,
  getInkTypes,
} from "@tcg/lorcana-types";

/**
 * Validate a deck against Lorcana rules
 *
 * @param cards - Array of card definitions in the deck
 * @returns Validation result with any errors
 */
export function validateDeck(cards: LorcanaCardDefinition[]): DeckValidationResult {
  const errors: DeckValidationError[] = [];

  // Rule 2.1.1.1: Minimum 60 cards
  if (cards.length < MIN_DECK_SIZE) {
    errors.push({
      count: cards.length,
      minimum: MIN_DECK_SIZE,
      type: "TOO_FEW_CARDS",
    });
  }

  // Rule 2.1.1.2: Maximum 2 ink types
  const inkTypes = getUniqueInkTypes(cards);
  if (inkTypes.length > MAX_INK_TYPES) {
    errors.push({
      inkTypes,
      maximum: MAX_INK_TYPES,
      type: "TOO_MANY_INK_TYPES",
    });
  }

  // Rule 2.1.1.3: Maximum copies per full name (default 4, can be overridden)
  const cardCounts = getCardCounts(cards);
  const copyLimits = getCardCopyLimits(cards);

  for (const [fullName, count] of cardCounts.entries()) {
    const limit = copyLimits.get(fullName);

    // Skip validation for cards with no limit
    if (limit === "no-limit") {
      continue;
    }

    const maxCopies = limit ?? MAX_COPIES_PER_CARD;
    if (count > maxCopies) {
      errors.push({
        count,
        fullName,
        maximum: maxCopies,
        type: "TOO_MANY_COPIES",
      });
    }
  }

  return {
    errors,
    valid: errors.length === 0,
  };
}

/**
 * Get all unique ink types in a deck
 */
export function getUniqueInkTypes(cards: LorcanaCardDefinition[]): InkType[] {
  const inkSet = new Set<InkType>();
  for (const card of cards) {
    for (const ink of getInkTypes(card)) {
      inkSet.add(ink);
    }
  }
  return [...inkSet];
}

/**
 * Count cards by full name
 */
export function getCardCounts(cards: LorcanaCardDefinition[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const card of cards) {
    const fullName = getFullName(card);
    counts.set(fullName, (counts.get(fullName) ?? 0) + 1);
  }
  return counts;
}

/**
 * Get card copy limits by full name
 * Returns undefined for default limit (4), number for custom limit, or "no-limit" for unlimited
 */
export function getCardCopyLimits(
  cards: LorcanaCardDefinition[],
): Map<string, number | "no-limit" | undefined> {
  const limits = new Map<string, number | "no-limit" | undefined>();
  for (const card of cards) {
    const fullName = getFullName(card);
    if (card.cardCopyLimit !== undefined && !limits.has(fullName)) {
      limits.set(fullName, card.cardCopyLimit);
    }
  }
  return limits;
}

/**
 * Calculate deck statistics
 */
export function getDeckStats(cards: LorcanaCardDefinition[]): DeckStats {
  const cardCounts = getCardCounts(cards);
  const inkTypes = getUniqueInkTypes(cards);

  const cardTypeBreakdown = {
    actions: 0,
    characters: 0,
    items: 0,
    locations: 0,
  };

  let inkableCards = 0;
  let totalCost = 0;

  for (const card of cards) {
    switch (card.cardType) {
      case "character": {
        cardTypeBreakdown.characters++;
        break;
      }
      case "action": {
        cardTypeBreakdown.actions++;
        break;
      }
      case "item": {
        cardTypeBreakdown.items++;
        break;
      }
      case "location": {
        cardTypeBreakdown.locations++;
        break;
      }
    }

    if (card.inkable) {
      inkableCards++;
    }
    totalCost += card.cost;
  }

  return {
    averageCost: cards.length > 0 ? totalCost / cards.length : 0,
    cardCounts,
    cardTypeBreakdown,
    inkTypes,
    inkableCards,
    totalCards: cards.length,
  };
}
