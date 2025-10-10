import type { CardId, PlayerId } from "../types";

/**
 * Card Operations Interface
 *
 * Provides API for managing card metadata without directly mutating internal state.
 * These operations are the only way for moves to interact with card properties.
 *
 * Card metadata includes:
 * - Dynamic properties (damage, counters, effects)
 * - Gained/lost abilities
 * - Temporary modifications
 * - Status effects
 *
 * @template TCardMeta - Game-specific card metadata type
 */
export interface CardOperations<TCardMeta = any> {
  /**
   * Get card metadata (dynamic properties)
   *
   * @param cardId - ID of the card
   * @returns Card metadata object (may be partial or empty)
   *
   * @example
   * ```typescript
   * const meta = cards.getCardMeta('card-1');
   * if (meta.damage && meta.damage > 0) {
   *   // Card is damaged
   * }
   * ```
   */
  getCardMeta(cardId: CardId): Partial<TCardMeta>;

  /**
   * Update card metadata (merge with existing)
   *
   * Merges the provided metadata with existing metadata.
   * Use this to modify specific properties without affecting others.
   *
   * @param cardId - ID of the card
   * @param meta - Partial metadata to merge
   *
   * @example
   * ```typescript
   * // Add 2 damage without affecting other properties
   * const current = cards.getCardMeta('card-1');
   * cards.updateCardMeta('card-1', {
   *   damage: (current.damage || 0) + 2
   * });
   * ```
   */
  updateCardMeta(cardId: CardId, meta: Partial<TCardMeta>): void;

  /**
   * Set card metadata (replace completely)
   *
   * Replaces all existing metadata with the provided metadata.
   * Use this for complete state replacement.
   *
   * @param cardId - ID of the card
   * @param meta - Complete metadata to set
   *
   * @example
   * ```typescript
   * // Reset card to pristine state
   * cards.setCardMeta('card-1', {
   *   damage: 0,
   *   exerted: false,
   *   effects: []
   * });
   * ```
   */
  setCardMeta(cardId: CardId, meta: TCardMeta): void;

  /**
   * Get card owner
   *
   * @param cardId - ID of the card
   * @returns Player ID of the owner, or undefined if card doesn't exist
   *
   * @example
   * ```typescript
   * const owner = cards.getCardOwner('card-1');
   * if (owner === context.playerId) {
   *   // Player owns this card
   * }
   * ```
   */
  getCardOwner(cardId: CardId): PlayerId | undefined;

  /**
   * Query cards by metadata criteria
   *
   * Finds all cards matching a predicate function.
   * Useful for complex queries involving multiple metadata properties.
   *
   * @param predicate - Function that returns true for matching cards
   * @returns Array of card IDs that match the predicate
   *
   * @example
   * ```typescript
   * // Find all exerted cards with damage
   * const damagedExerted = cards.queryCards((cardId, meta) =>
   *   meta.exerted === true && (meta.damage || 0) > 0
   * );
   *
   * // Find all cards with a specific effect
   * const poisoned = cards.queryCards((cardId, meta) =>
   *   meta.effects?.includes('poisoned')
   * );
   * ```
   */
  queryCards(
    predicate: (cardId: CardId, meta: Partial<TCardMeta>) => boolean,
  ): CardId[];
}
