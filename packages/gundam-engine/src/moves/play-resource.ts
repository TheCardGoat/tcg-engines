/**
 * Play Resource Move Implementation
 *
 * Implements playing resource cards from hand to resource area.
 * Handles:
 * - Zone capacity validation (max 15 resources)
 * - Card movement from hand to resource area
 * - Incrementing active resources count
 * - Setting resource position to active
 *
 * Rule References:
 * - Rule 4-1: Play resource during resource phase
 * - Rule 4-2: Resource area capacity is 15 maximum
 * - Rule 4-3: Playing a resource increases active resources by 1
 */

import type { CardId, GameMoveDefinition, MoveContext } from "@tcg/core";
import { getZoneSize, isCardInZone, moveCard } from "@tcg/core";
import type { Draft } from "immer";
import type { GundamGameState } from "../types";

/**
 * Extracts and validates card ID from move context
 */
function getCardId(context: MoveContext): CardId {
  const cardId = context.data?.cardId;

  if (!cardId || typeof cardId !== "string") {
    throw new Error(`Invalid card ID: ${cardId}`);
  }

  return cardId as CardId;
}

/**
 * Play Resource Move Definition
 *
 * Plays a resource card from hand to resource area, increasing available resources.
 */
export const playResourceMove: GameMoveDefinition<GundamGameState> = {
  /**
   * Condition: Can play resource if:
   * - In resource phase
   * - Card is in player's hand
   * - Resource area has space (max 15)
   */
  condition: (state: GundamGameState, context: MoveContext): boolean => {
    const { playerId } = context;

    // Must be in resource phase
    if (state.phase !== "resource") return false;

    // Must be current player
    if (state.currentPlayer !== playerId) return false;

    // Check if player has already played a resource this turn
    const hasPlayedResource =
      state.gundam.hasPlayedResourceThisTurn[playerId] ?? false;
    if (hasPlayedResource) return false;

    // Get and validate card ID
    let cardId: CardId;
    try {
      cardId = getCardId(context);
    } catch {
      return false;
    }

    // Card must be in player's hand
    const hand = state.zones.hand[playerId];
    if (!(hand && isCardInZone(hand, cardId))) return false;

    // Check resource area capacity (max 15)
    const resourceArea = state.zones.resourceArea[playerId];
    if (!resourceArea) return false;

    const resourceAreaSize = getZoneSize(resourceArea);
    if (resourceAreaSize >= 15) return false;

    return true;
  },

  /**
   * Reducer: Execute the resource play
   *
   * Moves card from hand to resource area and increments active resources.
   */
  reducer: (draft: Draft<GundamGameState>, context: MoveContext): void => {
    const { playerId } = context;
    const cardId = getCardId(context);

    // Get zones
    const hand = draft.zones.hand[playerId];
    const resourceArea = draft.zones.resourceArea[playerId];

    if (!(hand && resourceArea)) {
      throw new Error(
        `Missing zones for player ${playerId}: hand=${!!hand}, resourceArea=${!!resourceArea}`,
      );
    }

    // Validate resource area capacity
    const resourceAreaSize = getZoneSize(resourceArea);
    if (resourceAreaSize >= 15) {
      throw new Error("Resource area is at maximum capacity (15 resources)");
    }

    // Move card from hand to resource area
    const { fromZone, toZone } = moveCard(hand, resourceArea, cardId);

    // Update zones in draft
    draft.zones.hand[playerId] = fromZone;
    draft.zones.resourceArea[playerId] = toZone;

    // Increment active resources
    const currentResources = draft.gundam.activeResources[playerId] ?? 0;
    draft.gundam.activeResources[playerId] = currentResources + 1;

    // Set resource position to active (ready)
    draft.gundam.cardPositions[cardId] = "active";

    // Mark that player has played a resource this turn
    draft.gundam.hasPlayedResourceThisTurn[playerId] = true;
  },

  metadata: {
    category: "resource",
    tags: ["core", "resource-phase-action"],
    description: "Play resource card from hand to resource area",
    canBeUndone: false,
    affectsZones: ["hand", "resourceArea"],
  },
};
