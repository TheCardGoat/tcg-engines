import type { CardId } from "../types";

/**
 * Counter Operations Interface
 *
 * Provides API for managing counters and flags on cards without directly mutating internal state.
 * These operations handle both boolean flags (exhausted, stunned, buffed) and numeric counters (damage).
 *
 * This is the only way for moves to interact with card counters/tokens.
 */
export interface CounterOperations {
  /**
   * Set a boolean flag on a card
   *
   * @param cardId - ID of the card
   * @param flag - Name of the flag (e.g., "exhausted", "stunned", "buffed")
   * @param value - Boolean value to set
   *
   * @example
   * ```typescript
   * // Mark card as exhausted
   * counters.setFlag('card-1', 'exhausted', true);
   *
   * // Mark card as ready (not exhausted)
   * counters.setFlag('card-1', 'exhausted', false);
   * ```
   */
  setFlag(cardId: CardId, flag: string, value: boolean): void;

  /**
   * Get a boolean flag from a card
   *
   * @param cardId - ID of the card
   * @param flag - Name of the flag
   * @returns Boolean value of the flag (false if not set)
   *
   * @example
   * ```typescript
   * if (counters.getFlag('card-1', 'exhausted')) {
   *   // Card is exhausted
   * }
   * ```
   */
  getFlag(cardId: CardId, flag: string): boolean;

  /**
   * Add to a numeric counter on a card
   *
   * @param cardId - ID of the card
   * @param type - Type of counter (e.g., "damage", "plusOnePlusOne")
   * @param amount - Amount to add (must be positive)
   *
   * @example
   * ```typescript
   * // Add 3 damage to a card
   * counters.addCounter('card-1', 'damage', 3);
   * ```
   */
  addCounter(cardId: CardId, type: string, amount: number): void;

  /**
   * Remove from a numeric counter on a card
   *
   * @param cardId - ID of the card
   * @param type - Type of counter
   * @param amount - Amount to remove (must be positive, won't go below 0)
   *
   * @example
   * ```typescript
   * // Remove 2 damage from a card
   * counters.removeCounter('card-1', 'damage', 2);
   * ```
   */
  removeCounter(cardId: CardId, type: string, amount: number): void;

  /**
   * Get the value of a numeric counter on a card
   *
   * @param cardId - ID of the card
   * @param type - Type of counter
   * @returns Current counter value (0 if not set)
   *
   * @example
   * ```typescript
   * const damage = counters.getCounter('card-1', 'damage');
   * if (damage >= cardMight) {
   *   // Card has lethal damage
   * }
   * ```
   */
  getCounter(cardId: CardId, type: string): number;

  /**
   * Clear a specific counter type from a card
   *
   * @param cardId - ID of the card
   * @param type - Type of counter to clear
   *
   * @example
   * ```typescript
   * // Clear all damage from a card
   * counters.clearCounter('card-1', 'damage');
   * ```
   */
  clearCounter(cardId: CardId, type: string): void;

  /**
   * Clear all counters and flags from a card
   *
   * @param cardId - ID of the card
   *
   * @example
   * ```typescript
   * // Reset card to pristine state (e.g., when returning to hand)
   * counters.clearAllCounters('card-1');
   * ```
   */
  clearAllCounters(cardId: CardId): void;

  /**
   * Find all cards with a specific flag value
   *
   * @param flag - Name of the flag
   * @param value - Value to match
   * @returns Array of card IDs with the matching flag value
   *
   * @example
   * ```typescript
   * // Find all exhausted cards
   * const exhaustedCards = counters.getCardsWithFlag('exhausted', true);
   * ```
   */
  getCardsWithFlag(flag: string, value: boolean): CardId[];

  /**
   * Find all cards with a counter at or above a minimum value
   *
   * @param type - Type of counter
   * @param minValue - Minimum value (default 1)
   * @returns Array of card IDs with the counter at or above minValue
   *
   * @example
   * ```typescript
   * // Find all cards with damage
   * const damagedCards = counters.getCardsWithCounter('damage');
   *
   * // Find all cards with 3+ damage
   * const heavilyDamaged = counters.getCardsWithCounter('damage', 3);
   * ```
   */
  getCardsWithCounter(type: string, minValue?: number): CardId[];
}
