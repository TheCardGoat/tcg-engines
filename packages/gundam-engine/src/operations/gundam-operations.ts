/**
 * Gundam Operations Layer
 *
 * Domain-specific operations for Gundam.
 * Provides high-level Gundam semantics on top of generic engine operations.
 *
 * These operations encapsulate Gundam rules and can be used across multiple moves.
 * Each operation is pure and operates through the MoveContext API.
 */

import {
  type CardId,
  draw,
  type MoveContext,
  type PlayerId,
  type ZoneId,
} from "@tcg/core";
import type { GundamCardMeta } from "../types";

/**
 * Extracts and validates the draw count from move context
 * @param context - Move context
 * @returns Validated draw count
 * @throws {Error} If count is invalid
 */
function getDrawCount(context: MoveContext): number {
  const count = context.params?.count;

  // Default to 1 if not specified
  if (count === undefined) return 1;

  // Validate type and value
  if (typeof count !== "number" || count < 0 || !Number.isInteger(count)) {
    throw new Error(
      `Invalid draw count: ${count}. Must be a non-negative integer.`,
    );
  }

  return count;
}

/**
 * Gundam Operations Type
 *
 * Extension of MoveContext with Gundam-specific operations.
 * This type can be used in move reducers for cleaner code.
 */
export type GundamOperations = {
  /**
   * Rest a card (turn sideways)
   *
   * Rule 5-4-1-2. Rested: the card is placed horizontally.
   *
   * @param cardId - Card to rest
   */
  restCard(cardId: CardId): void;

  /**
   * Activate a card (turn upright)
   *
   * Rule 5-4-1-1. Active: the card is placed vertically.
   *
   * When a card is placed into the battle area, resource area, or base section, it is generally set as active.
   *
   * @param cardId - Card to activate
   */
  activateCard(cardId: CardId): void;

  /**
   * Add damage to a card
   *
   * Rule 5-5-1. When damage is dealt to a Unit, Base, or Shield, the dealt damage is shown with counters
   * Rule 5-5-1-1. Show the current amount of damage a card has received by placing a number of counters equal to that damage on top of it.
   * 5-5-2. A card that receives damage equal to or greater than its HP is destroyed as a result of rules management.
   * 5-5-3. Units, Bases, Shields, and players can receive damage as a result of battle.
   * Attacking Units and Units being attacked deal damage equal to their AP to each other during the damage step. This damage is called battle damage.
   * 5-5-4. Units, Bases, Shields, and players can receive damage from effects on cards.
   * This damage is called effect damage.
   * 5-5-5. Damage is not dealt when the amount of damage dealt would be zero.
   * 5-5-6. When damage received by a Base or Shield exceeds its HP, the excess damage is not dealt to another Shield.
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
   * 5-6-1. When a Unit or Base recovers from received damage for any reason, remove
   * a number of damage counters from it equal to the amount it recovers.
   * 5-6-2. If the amount recovered exceeds the amount of damage the card has currently received, remove all of its counters. HP does not increase by the amount exceeded.
   * 5-6-3. A Unit that has not received damage cannot recover HP.
   *
   * @param cardId - Card to heal
   * @param amount - Amount to heal (default: all damage)
   * @returns New damage total
   */
  removeDamage(cardId: CardId, amount?: number): number;
  /**
   * Check if a card is rested
   *
   * @param cardId - Card to check
   * @returns True if card is rested
   */
  isRested(cardId: CardId): boolean;

  /**
   * Get card type from registry
   *
   * @param cardId - Card to check
   * @returns Card type (unit, pilot, base, shield, resource)
   */
  getCardType(cardId: CardId): string | undefined;

  drawCard(playerId: PlayerId): void;
};

/**
 * Create Gundam operations from a MoveContext
 *
 * Factory function that creates Gundam-specific operations
 * using the provided context's zones, cards, and other APIs.
 *
 * @param context - Move context
 * @returns Gundam operations object
 *
 * @example
 * ```typescript
 * // In a move reducer:
 * const ops = createGundamOperations(context);
 * ops.restCard(cardId);
 * ops.addDamage(cardId, 2);
 * ```
 */
export function createGundamOperations<TParams>(
  context: MoveContext<TParams, GundamCardMeta>,
): GundamOperations {
  return {
    restCard(cardId: CardId): void {
      context.cards.updateCardMeta(cardId, { isRested: true });
    },

    activateCard(cardId: CardId): void {
      context.cards.updateCardMeta(cardId, { isRested: false });
    },
    addDamage(cardId: CardId, amount: number): number {
      const current = context.cards.getCardMeta(cardId)?.damage ?? 0;
      const newDamage = current + amount;
      context.cards.updateCardMeta(cardId, { damage: newDamage });
      return newDamage;
    },

    getDamage(cardId: CardId): number {
      return context.cards.getCardMeta(cardId)?.damage ?? 0;
    },

    removeDamage(cardId: CardId, amount?: number): number {
      const current = context.cards.getCardMeta(cardId)?.damage ?? 0;
      const newDamage =
        amount === undefined ? 0 : Math.max(0, current - amount);
      context.cards.updateCardMeta(cardId, { damage: newDamage });
      return newDamage;
    },
    drawCard(playerId: PlayerId): void {
      const drawCount = getDrawCount(context);

      // Get player's zones
      const deck = context.zones.getCardsInZone(
        "deck" as ZoneId,
        playerId as PlayerId,
      );
      const hand = context.zones.getCardsInZone(
        "hand" as ZoneId,
        playerId as PlayerId,
      );

      // Validate zones exist (should never fail if condition passed)
      if (!(deck && hand)) {
        throw new Error(
          `Missing zones for player ${playerId}: deck=${!!deck}, hand=${!!hand}`,
        );
      }

      // Handle no-op case
      if (drawCount === 0) return;

      context.zones.drawCards({
        from: "deck" as ZoneId,
        to: "hand" as ZoneId,
        playerId,
        count: drawCount,
      });
    },
    isRested(cardId: CardId): boolean {
      return context.cards.getCardMeta(cardId)?.isRested ?? false;
    },

    getCardType(cardId: CardId): string | undefined {
      const card = context.registry?.getCard(cardId);
      return card?.type;
    },
  };
}

/**
 * Helper function to use in move reducers
 *
 * Provides a shorthand for creating operations in reducers.
 *
 * @param context - Move context
 * @returns Gundam operations
 *
 * @example
 * ```typescript
 * reducer: (draft, context) => {
 *   const ops = useGundamOps(context);
 *   ops.restCard(context.params.cardId);
 *   ops.addDamage(context.params.cardId, 2);
 * }
 * ```
 */
export const useGundamOps = createGundamOperations;
