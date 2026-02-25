/**
 * Pass Move Implementation
 *
 * Implements passing priority to advance the game phase or end the turn.
 * Handles:
 * - Phase transitions (setup -> start -> draw -> resource -> main -> end)
 * - Turn handoff (end phase -> opponent's start phase)
 * - Turn counter increment
 * - Resource and unit state refresh at start of turn
 *
 * Rule References:
 * - Rule 2-1: Game phases progress in fixed order
 * - Rule 2-2: Turn ends after end phase, switches to opponent
 * - Rule 2-3: At start of turn, ready all units and refresh resources
 */

import type { GameMoveDefinition, MoveContext, PlayerId } from "@tcg/core";
import { getZoneSize } from "@tcg/core";
import type { Draft } from "immer";
import type { GundamGameState, GundamPhase } from "../../../types";

/**
 * Get the next phase in the game flow
 */
function getNextPhase(currentPhase: GundamPhase): GundamPhase {
  const phaseOrder: GundamPhase[] = [
    "setup",
    "start",
    "draw",
    "resource",
    "main",
    "end",
  ];

  const currentIndex = phaseOrder.indexOf(currentPhase);

  if (currentIndex === -1 || currentIndex === phaseOrder.length - 1) {
    // End phase -> start new turn
    return "start";
  }

  return phaseOrder[currentIndex + 1];
}

/**
 * Ready all cards (change from rested to active) for the given player
 * This includes units in battle area, bases in base section, and resources
 */
function readyAllCards(
  draft: Draft<GundamGameState>,
  playerId: PlayerId,
): void {
  // Ready all units in battle area
  const battleZoneId = `battleArea-${playerId}`;
  const battleZone = draft.internal.zones[battleZoneId];
  if (battleZone?.cardIds) {
    for (const cardId of battleZone.cardIds) {
      draft.external.cardPositions[cardId] = "active";
    }
  }

  // Ready base in base section
  const baseZoneId = `baseSection-${playerId}`;
  const baseZone = draft.internal.zones[baseZoneId];
  if (baseZone?.cardIds) {
    for (const cardId of baseZone.cardIds) {
      draft.external.cardPositions[cardId] = "active";
    }
  }

  // Ready all resources in resource area
  const resourceZoneId = `resourceArea-${playerId}`;
  const resourceZone = draft.internal.zones[resourceZoneId];
  if (resourceZone?.cardIds) {
    for (const cardId of resourceZone.cardIds) {
      draft.external.cardPositions[cardId] = "active";
    }
  }
}

/**
 * Refresh resources to match resource area size
 */
function refreshResources(
  draft: Draft<GundamGameState>,
  playerId: PlayerId,
): void {
  const resourceZoneId = `resourceArea-${playerId}`;
  const resourceZone = draft.internal.zones[resourceZoneId];
  if (!resourceZone?.cardIds) return;

  const resourceCount = resourceZone.cardIds.length;
  draft.external.activeResources[playerId] = resourceCount;
}

/**
 * Pass Move Definition
 *
 * Advances the game phase or ends the turn.
 */
export const passMove: GameMoveDefinition<GundamGameState> = {
  /**
   * Enumerator: Pass move has no parameters
   *
   * Always returns a single empty parameter set since pass has no options.
   */
  enumerator: (state: GundamGameState, context) => {
    const { playerId } = context;

    // Must be current player
    if (state.external.activePlayerId !== playerId) return [];

    // Cannot pass if game is over
    if (state.external.currentPhase === "gameOver") return [];

    // Return single empty parameter set
    return [{}];
  },

  /**
   * Condition: Current player can always pass
   */
  condition: (state: GundamGameState, context: MoveContext): boolean => {
    const { playerId } = context;

    // Must be current player
    if (state.external.activePlayerId !== playerId) return false;

    // Cannot pass if game is over
    if (state.external.currentPhase === "gameOver") return false;

    return true;
  },

  /**
   * Reducer: Advance phase or end turn
   *
   * Transitions to next phase. If ending turn, switches players and resets state.
   */
  reducer: (draft: Draft<GundamGameState>, context: MoveContext): void => {
    const currentPhase = draft.external.currentPhase;
    const isEndingTurn = currentPhase === "end";

    // Advance to next phase
    draft.external.currentPhase = getNextPhase(currentPhase);

    // If ending turn, handle turn handoff
    if (isEndingTurn) {
      // Switch active player
      const currentPlayerIndex = draft.external.playerIds.indexOf(
        draft.external.activePlayerId,
      );
      if (currentPlayerIndex === -1) {
        throw new Error(
          `Current player ${draft.external.activePlayerId} not found in players array`,
        );
      }
      const nextPlayerIndex =
        (currentPlayerIndex + 1) % draft.external.playerIds.length;
      const nextPlayer = draft.external.playerIds[nextPlayerIndex];
      if (!nextPlayer) {
        throw new Error(`No player found at index ${nextPlayerIndex}`);
      }
      draft.external.activePlayerId = nextPlayer;

      // Increment turn counter
      draft.external.turnNumber += 1;

      // Reset per-turn state
      draft.external.attackedThisTurn = [];
      draft.external.hasPlayedResourceThisTurn = {
        [draft.external.playerIds[0]]: false,
        [draft.external.playerIds[1]]: false,
      };

      // Ready all cards and refresh resources for new active player
      readyAllCards(draft, draft.external.activePlayerId);
      refreshResources(draft, draft.external.activePlayerId);
    }
  },

  metadata: {
    category: "phase-control",
    tags: ["core", "always-available"],
    description: "Pass priority and advance game phase",
    canBeUndone: false,
    affectsZones: [],
  },
};
