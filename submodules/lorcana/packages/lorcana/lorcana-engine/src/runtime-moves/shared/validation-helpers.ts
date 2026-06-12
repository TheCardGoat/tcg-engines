/**
 * Validation Helpers for Manual Moves
 *
 * Common validation patterns used across manual/debug moves.
 */

import type { RuntimeValidationResult } from "#core";

type CardsAPI = {
  require(id: string): unknown;
};

type CardsLike = CardsAPI | { cards: CardsAPI };

/**
 * Validates that a card exists in the game state.
 *
 * @param cards - The cards API from move context
 * @param cardId - The card instance ID to validate
 * @returns Validation result indicating success or failure with error details
 */
export function validateCardExists(cardsLike: CardsLike, cardId: string): RuntimeValidationResult {
  try {
    const cards = "cards" in cardsLike ? cardsLike.cards : cardsLike;
    cards.require(cardId);
    return { valid: true };
  } catch {
    return { valid: false, error: "Card not found", errorCode: "CARD_NOT_FOUND" };
  }
}
