/**
 * Alpha Clash master card registry
 *
 * Imports and exports all Alpha Clash cards from all sets
 */

import type { AlphaClashCard } from "./cardTypes";
import { AC001_CARDS } from "./SET001";

/**
 * Master card registry - all Alpha Clash cards by ID
 */
export const allAlphaClashCardsById: Record<string, AlphaClashCard> = {
  ...AC001_CARDS,
};

/**
 * Helper function to get card by ID
 */
export const getAlphaClashCardById = (
  id: string,
): AlphaClashCard | undefined => {
  return allAlphaClashCardsById[id];
};

/**
 * Helper function to get all cards of a specific type
 */
export const getAlphaClashCardsByType = (
  type: AlphaClashCard["type"],
): AlphaClashCard[] => {
  return Object.values(allAlphaClashCardsById).filter(
    (card) => card.type === type,
  );
};

/**
 * Helper function to get all cards from a specific set
 */
export const getAlphaClashCardsBySet = (set: string): AlphaClashCard[] => {
  return Object.values(allAlphaClashCardsById).filter(
    (card) => card.set === set,
  );
};

/**
 * Validation function to ensure all card IDs are unique
 */
export const validateCardRegistry = (): string[] => {
  const errors: string[] = [];
  const seenIds = new Set<string>();

  for (const [id, card] of Object.entries(allAlphaClashCardsById)) {
    // Check ID consistency
    if (card.id !== id) {
      errors.push(
        `Card ID mismatch: key ${id} does not match card.id ${card.id}`,
      );
    }

    // Check for duplicates
    if (seenIds.has(card.id)) {
      errors.push(`Duplicate card ID: ${card.id}`);
    }
    seenIds.add(card.id);

    // Validate required fields
    if (!(card.name && card.type && card.set)) {
      errors.push(`Card ${card.id} missing required fields`);
    }

    // Validate colors
    if (!Array.isArray(card.colors)) {
      errors.push(`Card ${card.id} has invalid colors property`);
    }
  }

  return errors;
};

// Run validation on import
const validationErrors = validateCardRegistry();
if (validationErrors.length > 0) {
  console.error("Card registry validation errors:", validationErrors);
}
