/**
 * Deploy Unit Move Implementation
 *
 * Implements deploying units from hand to battle area.
 * Handles:
 * - Cost validation and payment
 * - Zone capacity validation (max 6 units)
 * - Card movement from hand to battle area
 * - Setting unit position to active
 *
 * Rule References:
 * - Rule 5-1: Deploy units during main phase
 * - Rule 5-2: Pay resource cost to deploy
 * - Rule 5-3: Battle area capacity is 6 units maximum
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
 * Checks if a card is a unit card
 * TODO: Look up actual card definition when card registry is available
 */
function isUnitCard(_cardId: CardId): boolean {
  // TODO: Look up card definition and verify cardType === "UNIT"
  // For now, assume all cards are valid units
  return true;
}

/**
 * Gets the cost of a card (placeholder - will be enhanced with card definitions)
 */
function getCardCost(_cardId: CardId): number {
  // TODO: Look up actual card cost from card definitions
  // For now, return a placeholder cost
  return 2;
}

/**
 * Deploy Unit Move Definition
 *
 * Deploys a unit from hand to battle area, paying resource cost.
 */
export const deployUnitMove: GameMoveDefinition<GundamGameState> = {
  /**
   * Condition: Can deploy if:
   * - In main phase
   * - Card is in player's hand
   * - Player has sufficient active resources
   * - Battle area has space (max 6)
   */
  condition: (state: GundamGameState, context: MoveContext): boolean => {
    const { playerId } = context;

    // Must be in main phase
    if (state.phase !== "main") return false;

    // Must be current player
    if (state.currentPlayer !== playerId) return false;

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

    // Card must be a unit card
    if (!isUnitCard(cardId)) return false;

    // Check battle area capacity (max 6)
    const battleArea = state.zones.battleArea[playerId];
    if (!battleArea) return false;

    const battleAreaSize = getZoneSize(battleArea);
    if (battleAreaSize >= 6) return false;

    // Check if player has sufficient resources
    const cost = getCardCost(cardId);
    const activeResources = state.gundam.activeResources[playerId] ?? 0;
    if (activeResources < cost) return false;

    return true;
  },

  /**
   * Reducer: Execute the deployment
   *
   * Moves card from hand to battle area, pays cost, sets position to active.
   */
  reducer: (draft: Draft<GundamGameState>, context: MoveContext): void => {
    const { playerId } = context;
    const cardId = getCardId(context);

    // Get zones
    const hand = draft.zones.hand[playerId];
    const battleArea = draft.zones.battleArea[playerId];

    if (!(hand && battleArea)) {
      throw new Error(
        `Missing zones for player ${playerId}: hand=${!!hand}, battleArea=${!!battleArea}`,
      );
    }

    // Validate card is a unit
    if (!isUnitCard(cardId)) {
      throw new Error(`Card ${cardId} is not a unit card`);
    }

    // Validate battle area capacity
    const battleAreaSize = getZoneSize(battleArea);
    if (battleAreaSize >= 6) {
      throw new Error("Battle area is at maximum capacity (6 units)");
    }

    // Pay cost
    const cost = getCardCost(cardId);
    const activeResources = draft.gundam.activeResources[playerId] ?? 0;

    if (activeResources < cost) {
      throw new Error(
        `Insufficient resources: need ${cost}, have ${activeResources}`,
      );
    }

    // Deduct resources
    draft.gundam.activeResources[playerId] = activeResources - cost;

    // Move card from hand to battle area
    const { fromZone, toZone } = moveCard(hand, battleArea, cardId);

    // Update zones in draft
    draft.zones.hand[playerId] = fromZone;
    draft.zones.battleArea[playerId] = toZone;

    // Set unit position to active (ready)
    draft.gundam.cardPositions[cardId] = "active";
  },

  metadata: {
    category: "deployment",
    tags: ["core", "main-phase-action"],
    description: "Deploy unit from hand to battle area",
    canBeUndone: false,
    affectsZones: ["hand", "battleArea"],
  },
};
