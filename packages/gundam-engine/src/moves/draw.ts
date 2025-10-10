/**
 * Draw Move Implementation
 *
 * Implements the draw move for Gundam Card Game using @tcg/core patterns.
 * Handles:
 * - Drawing cards from deck to hand
 * - Validation to prevent drawing from empty/insufficient deck
 * - Proper error propagation for invalid draws
 *
 * Rule References:
 * - Rule 3-1: During Draw Phase, active player draws exactly 1 card
 * - Rule 2-3: If a player must draw but has no cards in deck, they lose immediately
 * - Rule 4-7: Some card effects may draw multiple cards
 */

import type { GameMoveDefinition, MoveContext } from "@tcg/core";
import { draw, getZoneSize } from "@tcg/core";
import type { Draft } from "immer";
import type { GundamGameState } from "../types";

/**
 * Extracts and validates the draw count from move context
 * @param context - Move context
 * @returns Validated draw count
 * @throws {Error} If count is invalid
 */
function getDrawCount(context: MoveContext): number {
  const count = context.data?.count;

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
 * Draw Move Definition
 *
 * Draws cards from a player's deck to their hand.
 * If the deck doesn't have enough cards, the move is rejected via condition.
 * The loss condition is checked separately by the endIf function.
 */
export const drawMove: GameMoveDefinition<GundamGameState> = {
  /**
   * Condition: Can draw if deck has sufficient cards
   *
   * @param state - Current game state (readonly)
   * @param context - Move context with playerId and optional count
   * @returns True if the player's deck has enough cards
   */
  condition: (state: GundamGameState, context: MoveContext): boolean => {
    const { playerId } = context;

    // Get and validate count
    let count: number;
    try {
      count = getDrawCount(context);
    } catch {
      return false; // Invalid count means move is illegal
    }

    // Drawing 0 cards is technically valid but unusual
    if (count === 0) return true;

    // Check if player's deck exists
    const deck = state.zones.deck[playerId];
    if (!deck) return false;

    // Can only draw if deck has enough cards
    const deckSize = getZoneSize(deck);
    return deckSize >= count;
  },

  /**
   * Reducer: Execute the draw
   *
   * Draws cards from deck to hand using @tcg/core's draw function.
   * Assumes condition has already validated the move is legal.
   *
   * @param draft - Immer draft of game state (mutable)
   * @param context - Move context
   * @throws {Error} If zones don't exist or draw fails
   */
  reducer: (draft: Draft<GundamGameState>, context: MoveContext): void => {
    const { playerId } = context;
    const count = getDrawCount(context);

    // Get player's zones
    const deck = draft.zones.deck[playerId];
    const hand = draft.zones.hand[playerId];

    // Validate zones exist (should never fail if condition passed)
    if (!(deck && hand)) {
      throw new Error(
        `Missing zones for player ${playerId}: deck=${!!deck}, hand=${!!hand}`,
      );
    }

    // Handle no-op case
    if (count === 0) return;

    // Use @tcg/core's draw function to move cards
    // This will throw if trying to draw more cards than available
    const { fromZone, toZone } = draw(deck, hand, count);

    // Update zones in draft
    draft.zones.deck[playerId] = fromZone;
    draft.zones.hand[playerId] = toZone;
  },

  metadata: {
    category: "draw",
    tags: ["core", "mandatory", "phase-action"],
    description: "Draw cards from deck to hand",
    canBeUndone: false,
    affectsZones: ["deck", "hand"],
  },
};
