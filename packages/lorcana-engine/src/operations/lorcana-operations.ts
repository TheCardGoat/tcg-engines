/**
 * Lorcana Operations Layer
 *
 * Domain-specific operations for Disney Lorcana.
 * Provides high-level Lorcana semantics on top of generic engine operations.
 *
 * These operations encapsulate Lorcana rules and can be used across multiple moves.
 * Each operation is pure and operates through the MoveContext API.
 */

import type { CardId, MoveContext, PlayerId } from "@tcg/core";
import type { Draft } from "immer";
import type { LorcanaCardMeta, LorcanaGameState } from "../types";

/**
 * Lorcana Operations Type
 *
 * Extension of MoveContext with Lorcana-specific operations.
 * This type can be used in move reducers for cleaner code.
 */
export interface LorcanaOperations {
  /**
   * Exert a card (turn sideways)
   *
   * Rule 5.1.2: Exerted cards are turned sideways
   *
   * @param cardId - Card to exert
   */
  exertCard(cardId: CardId): void;

  /**
   * Ready a card (return to upright position)
   *
   * Rule 4.2.1.1: Cards are readied at start of turn
   *
   * @param cardId - Card to ready
   */
  readyCard(cardId: CardId): void;

  /**
   * Add lore to a player's total
   *
   * Rule 4.3.5.8: Gain lore from questing
   * Rule 1.9.1.1: Win condition - first to 20 lore
   *
   * @param draft - Game state draft
   * @param playerId - Player gaining lore
   * @param amount - Amount of lore to add
   * @returns New lore total
   */
  addLore(draft: Draft<LorcanaGameState>, playerId: PlayerId, amount: number): number;

  /**
   * Get lore total for a player
   *
   * @param state - Game state
   * @param playerId - Player to check
   * @returns Current lore total
   */
  getLore(state: LorcanaGameState, playerId: PlayerId): number;

  /**
   * Add damage to a card
   *
   * Rule 9.1: Each counter represents 1 damage
   * Rule 1.9.1.3: Banished when damage >= Willpower
   *
   * @param cardId - Card taking damage
   * @param amount - Damage amount
   * @returns New damage total
   */
  addDamage(cardId: CardId, amount: number): number;

  /**
   * Get damage on a card
   *
   * @param cardId - Card to check
   * @returns Current damage amount
   */
  getDamage(cardId: CardId): number;

  /**
   * Remove damage from a card
   *
   * @param cardId - Card to heal
   * @param amount - Amount to heal (default: all damage)
   * @returns New damage total
   */
  removeDamage(cardId: CardId, amount?: number): number;

  /**
   * Mark a card as "drying" (played this turn)
   *
   * Rule 4.2.2.1: Characters are "drying" the turn they're played
   *
   * @param cardId - Card that was played
   */
  markAsDrying(cardId: CardId): void;

  /**
   * Mark a card as "dry" (ready to act)
   *
   * Rule 4.2.2.1: Becomes dry at Set step of next turn
   *
   * @param cardId - Card to mark as dry
   */
  markAsDry(cardId: CardId): void;

  /**
   * Check if a card is "drying"
   *
   * @param cardId - Card to check
   * @returns True if card was played this turn
   */
  isDrying(cardId: CardId): boolean;

  /**
   * Check if a card is exerted
   *
   * @param cardId - Card to check
   * @returns True if card is exerted
   */
  isExerted(cardId: CardId): boolean;

  /**
   * Get card type from registry
   *
   * @param cardId - Card to check
   * @returns Card type (character, action, item, location)
   */
  getCardType(cardId: CardId): string | undefined;

  /**
   * Move a character to a location
   *
   * Rule 6.5: Characters can move to locations
   *
   * @param characterId - Character to move
   * @param locationId - Target location
   */
  moveToLocation(characterId: CardId, locationId: CardId): void;

  /**
   * Remove a character from a location
   *
   * @param characterId - Character to move
   */
  leaveLocation(characterId: CardId): void;

  /**
   * Get the location a character is at
   *
   * @param characterId - Character to check
   * @returns Location ID, or undefined if not at a location
   */
  getLocation(characterId: CardId): CardId | undefined;
}

/**
 * Create Lorcana operations from a MoveContext
 *
 * Factory function that creates Lorcana-specific operations
 * using the provided context's zones, cards, and other APIs.
 *
 * @param context - Move context
 * @returns Lorcana operations object
 *
 * @example
 * ```typescript
 * // In a move reducer:
 * const ops = createLorcanaOperations(context);
 * ops.exertCard(cardId);
 * ops.addLore(draft, playerId, 2);
 * ```
 */
export function createLorcanaOperations<TParams>(
  context: MoveContext<TParams, LorcanaCardMeta>,
): LorcanaOperations {
  return {
    addDamage(cardId: CardId, amount: number): number {
      const current = context.cards.getCardMeta(cardId)?.damage ?? 0;
      const newDamage = current + amount;
      context.cards.updateCardMeta(cardId, { damage: newDamage });
      return newDamage;
    },

    addLore(draft: Draft<LorcanaGameState>, playerId: PlayerId, amount: number): number {
      const current = draft.external.loreScores[playerId] ?? 0;
      const newTotal = current + amount;
      draft.external.loreScores[playerId] = newTotal;

      // Check win condition (Rule 1.9.1.1)
      if (newTotal >= 20 && context.endGame) {
        context.endGame({
          metadata: { finalLore: newTotal },
          reason: "lore_victory",
          winner: playerId,
        });
      }

      return newTotal;
    },

    exertCard(cardId: CardId): void {
      context.cards.updateCardMeta(cardId, { state: "exerted" });
    },

    getCardType(cardId: CardId): string | undefined {
      const card = context.registry?.getCard(cardId);
      return card?.type;
    },

    getDamage(cardId: CardId): number {
      return context.cards.getCardMeta(cardId)?.damage ?? 0;
    },

    getLocation(characterId: CardId): CardId | undefined {
      return context.cards.getCardMeta(characterId)?.atLocationId;
    },

    getLore(state: LorcanaGameState, playerId: PlayerId): number {
      return state.external.loreScores[playerId] ?? 0;
    },

    isDrying(cardId: CardId): boolean {
      return context.cards.getCardMeta(cardId)?.isDrying ?? false;
    },

    isExerted(cardId: CardId): boolean {
      return context.cards.getCardMeta(cardId)?.state === "exerted";
    },

    leaveLocation(characterId: CardId): void {
      context.cards.updateCardMeta(characterId, { atLocationId: undefined });
    },

    markAsDry(cardId: CardId): void {
      context.cards.updateCardMeta(cardId, { isDrying: false });
    },

    markAsDrying(cardId: CardId): void {
      context.cards.updateCardMeta(cardId, { isDrying: true });
    },

    moveToLocation(characterId: CardId, locationId: CardId): void {
      context.cards.updateCardMeta(characterId, { atLocationId: locationId });
    },

    readyCard(cardId: CardId): void {
      context.cards.updateCardMeta(cardId, { state: "ready" });
    },

    removeDamage(cardId: CardId, amount?: number): number {
      const current = context.cards.getCardMeta(cardId)?.damage ?? 0;
      const newDamage = amount === undefined ? 0 : Math.max(0, current - amount);
      context.cards.updateCardMeta(cardId, { damage: newDamage });
      return newDamage;
    },
  };
}

/**
 * Helper function to use in move reducers
 *
 * Provides a shorthand for creating operations in reducers.
 *
 * @param context - Move context
 * @returns Lorcana operations
 *
 * @example
 * ```typescript
 * reducer: (draft, context) => {
 *   const ops = useLorcanaOps(context);
 *   ops.exertCard(context.params.cardId);
 *   ops.addLore(draft, context.playerId, 2);
 * }
 * ```
 */
export const useLorcanaOps = createLorcanaOperations;
