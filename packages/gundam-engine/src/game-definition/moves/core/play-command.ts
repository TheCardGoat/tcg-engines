/**
 * Play Command Move Implementation
 *
 * Implements playing COMMAND cards from hand.
 * Handles:
 * - Validation of command card plays (main phase only)
 * - Card type validation (must be COMMAND)
 * - Resource cost payment
 * - Level requirement validation
 * - Moving COMMAND cards to limbo zone
 * - Enqueueing effects onto the effect stack
 * - Effect stack must be empty (per Rule 6-1-3)
 *
 * Rule References:
 * - Rule 6-1-3: Only one effect can resolve at a time (stack must be empty)
 * - Rule 6-1-4: Command cards have timing restrictions (main phase or action step)
 * - Rule 6-1-5: Level requirements must be met to play commands
 */

import type {
  CardId,
  GameMoveDefinition,
  MoveContext,
  PlayerId,
} from "@tcg/core";
import { isCardInZone } from "@tcg/core";
import type { Draft } from "immer";
import { getCardDefinition } from "../../../effects/action-handlers";
import { enqueueEffect } from "../../../effects/effect-stack";
import type { GundamGameState } from "../../../types";

/**
 * Gets total resource count for a player
 *
 * Counts all cards in the player's resource area.
 *
 * @param state - Current game state
 * @param playerId - Player to get resources for
 * @returns Total resource count
 */
function getTotalResources(state: GundamGameState, playerId: PlayerId): number {
  const resourceArea = state.zones.resourceArea[playerId];
  return resourceArea?.cards.length ?? 0;
}

/**
 * Rests specified number of resources for a player
 *
 * Changes the orientation of active resources to rested.
 *
 * @param draft - Immer draft state
 * @param playerId - Player to rest resources for
 * @param count - Number of resources to rest
 */
function restResources(
  draft: GundamGameState,
  playerId: PlayerId,
  count: number,
): void {
  if (count <= 0) return;

  const resourceArea = draft.zones.resourceArea[playerId];
  if (!resourceArea) return;

  // Rest the first 'count' active resources
  let rested = 0;
  for (const cardId of resourceArea.cards) {
    if (rested >= count) break;

    const currentPosition = draft.gundam.cardPositions[cardId];
    if (currentPosition === "active") {
      draft.gundam.cardPositions[cardId] = "rested";
      rested++;
    }
  }

  // Update active resources count
  const activeCount = resourceArea.cards.filter(
    (cardId: CardId) => draft.gundam.cardPositions[cardId] === "active",
  ).length;
  draft.gundam.activeResources[playerId] = activeCount;
}

/**
 * Extracts and validates card ID from move context
 */
function getCardId(context: MoveContext): CardId {
  const cardId = context.params?.cardId;

  if (!cardId || typeof cardId !== "string") {
    throw new Error(`Invalid card ID: ${cardId}`);
  }

  return cardId as CardId;
}

/**
 * Play Command Move Definition
 *
 * Plays a COMMAND card from hand, paying costs and enqueueing its effect.
 */
export const playCommandMove: GameMoveDefinition<GundamGameState> = {
  /**
   * Enumerator: Generate all possible command card plays
   *
   * Enumerates all COMMAND cards in player's hand that can be played.
   * Validates card type, cost, and level requirements.
   */
  enumerator: (state: GundamGameState, context) => {
    const { playerId } = context;

    // Must be in main phase
    if (state.phase !== "main") return [];

    // Must be current player
    if (state.currentPlayer !== playerId) return [];

    // Effect stack must be empty (per Rule 6-1-3)
    if (state.gundam.effectStack.stack.length > 0) return [];

    const options = [];
    const hand = state.zones.hand[playerId];

    if (!hand) return [];

    // Check each card in hand - only COMMAND cards can be played
    for (const cardId of hand.cards) {
      // Load card definition and validate card type, cost, and level
      const def = getCardDefinition(cardId);
      if (def?.cardType !== "COMMAND") continue;

      // Check cost requirements - player must have sufficient active resources
      const cost = def.cost ?? 0;
      const activeResources = state.gundam.activeResources[playerId] ?? 0;
      if (activeResources < cost) continue;

      // Check level requirements - player must have enough total resources
      const level = def.level ?? 0;
      const totalResources = getTotalResources(state, playerId);
      if (totalResources < level) continue;

      options.push({ cardId });
    }

    return options;
  },

  /**
   * Condition: Can play command if:
   * - In main phase
   * - Is current player
   * - Card is in player's hand
   * - Card type is COMMAND
   * - Player has sufficient resources for cost
   * - Level requirements are met
   * - Effect stack is empty
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

    // Effect stack must be empty (per Rule 6-1-3)
    if (state.gundam.effectStack.stack.length > 0) return false;

    // Load card definition and validate card type is COMMAND
    const cardDef = getCardDefinition(cardId);
    if (!cardDef || cardDef.cardType !== "COMMAND") return false;

    // Validate cost requirements - player must have sufficient active resources
    const cost = cardDef.cost ?? 0;
    const activeResources = state.gundam.activeResources[playerId] ?? 0;
    if (activeResources < cost) return false;

    // Validate level requirements - player must have enough total resources
    const level = cardDef.level ?? 0;
    const totalResources = getTotalResources(state, playerId);
    if (totalResources < level) return false;

    return true;
  },

  /**
   * Reducer: Execute the play command
   *
   * Pays resource cost, moves card to limbo, and enqueues effect.
   */
  reducer: (draft: Draft<GundamGameState>, context: MoveContext): void => {
    const { playerId } = context;
    const cardId = getCardId(context);

    // Validate card is in hand
    const hand = draft.zones.hand[playerId];
    if (!(hand && isCardInZone(hand, cardId))) {
      throw new Error(`Card ${cardId} is not in player's hand`);
    }

    // Pay resource cost by resting required number of resources
    const def = getCardDefinition(cardId);
    const cost = def?.cost ?? 0;
    restResources(draft, playerId, cost);

    // Move card from hand to limbo zone
    const limbo = draft.zones.limbo[playerId];
    if (!limbo) {
      throw new Error(`Limbo zone not found for player ${playerId}`);
    }

    // Remove from hand and add to limbo
    const cardIndex = hand.cards.indexOf(cardId);
    if (cardIndex === -1) {
      throw new Error(`Card ${cardId} not found in hand`);
    }
    hand.cards.splice(cardIndex, 1);
    limbo.cards.push(cardId);

    // Load effect definition from card
    // For T4, use a placeholder effect ID
    // In T5, we'll load the actual effect from the card definition
    const effectId = `effect-${cardId}`;

    // Enqueue the effect onto the stack
    enqueueEffect(draft, cardId, { effectId }, playerId);

    // Effect is now pending on stack and will be resolved by resolveEffectStack
  },

  metadata: {
    category: "card-play",
    tags: ["main-phase-action", "action-step"],
    description: "Play COMMAND card from hand",
    canBeUndone: false,
    affectsZones: ["hand", "limbo"],
  },
};
