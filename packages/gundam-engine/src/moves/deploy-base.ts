/**
 * Deploy Base Move Implementation
 *
 * Implements deploying base cards from hand to base section.
 * Handles:
 * - Cost validation and payment
 * - Zone capacity validation (max 1 base)
 * - Card movement from hand to base section
 * - Setting base position to active
 *
 * Rule References:
 * - Rule 5-4: Deploy bases during main phase
 * - Rule 5-5: Only one base can be in base section
 * - Rule 5-6: Pay resource cost to deploy base
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
 * Checks if a card is a base card
 * TODO: Look up actual card definition when card registry is available
 */
function isBaseCard(_cardId: CardId): boolean {
  // TODO: Look up card definition and verify cardType === "BASE"
  // For now, assume all cards are valid bases
  return true;
}

/**
 * Gets the cost of a card (placeholder - will be enhanced with card definitions)
 */
function getCardCost(_cardId: CardId): number {
  // TODO: Look up actual card cost from card definitions
  // For now, return a placeholder cost
  return 3;
}

/**
 * Deploy Base Move Definition
 *
 * Deploys a base from hand to base section, paying resource cost.
 */
export const deployBaseMove: GameMoveDefinition<GundamGameState> = {
  /**
   * Condition: Can deploy if:
   * - In main phase
   * - Card is in player's hand
   * - Player has sufficient active resources
   * - Base section is empty (max 1)
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

    // Card must be a base card
    if (!isBaseCard(cardId)) return false;

    // Check base section capacity (max 1)
    const baseSection = state.zones.baseSection[playerId];
    if (!baseSection) return false;

    const baseSectionSize = getZoneSize(baseSection);
    if (baseSectionSize >= 1) return false;

    // Check if player has sufficient resources
    const cost = getCardCost(cardId);
    const activeResources = state.gundam.activeResources[playerId] ?? 0;
    if (activeResources < cost) return false;

    return true;
  },

  /**
   * Reducer: Execute the deployment
   *
   * Moves card from hand to base section, pays cost, sets position to active.
   */
  reducer: (draft: Draft<GundamGameState>, context: MoveContext): void => {
    const { playerId } = context;
    const cardId = getCardId(context);

    // Get zones
    const hand = draft.zones.hand[playerId];
    const baseSection = draft.zones.baseSection[playerId];

    if (!(hand && baseSection)) {
      throw new Error(
        `Missing zones for player ${playerId}: hand=${!!hand}, baseSection=${!!baseSection}`,
      );
    }

    // Validate card is a base
    if (!isBaseCard(cardId)) {
      throw new Error(`Card ${cardId} is not a base card`);
    }

    // Validate base section capacity
    const baseSectionSize = getZoneSize(baseSection);
    if (baseSectionSize >= 1) {
      throw new Error("Base section is already occupied (max 1 base)");
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

    // Move card from hand to base section
    const { fromZone, toZone } = moveCard(hand, baseSection, cardId);

    // Update zones in draft
    draft.zones.hand[playerId] = fromZone;
    draft.zones.baseSection[playerId] = toZone;

    // Set base position to active (ready)
    draft.gundam.cardPositions[cardId] = "active";
  },

  metadata: {
    category: "deployment",
    tags: ["core", "main-phase-action"],
    description: "Deploy base from hand to base section",
    canBeUndone: false,
    affectsZones: ["hand", "baseSection"],
  },
};
