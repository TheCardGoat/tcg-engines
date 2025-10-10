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
import type { GundamGameState } from "../types";

/**
 * Get the next phase in the game flow
 */
function getNextPhase(
  currentPhase: GundamGameState["phase"],
): GundamGameState["phase"] {
  const phaseOrder: Array<GundamGameState["phase"]> = [
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
  const battleArea = draft.zones.battleArea[playerId];
  if (battleArea) {
    for (const cardId of battleArea.cards) {
      draft.gundam.cardPositions[cardId] = "active";
    }
  }

  // Ready base in base section
  const baseSection = draft.zones.baseSection[playerId];
  if (baseSection) {
    for (const cardId of baseSection.cards) {
      draft.gundam.cardPositions[cardId] = "active";
    }
  }

  // Ready all resources in resource area
  const resourceArea = draft.zones.resourceArea[playerId];
  if (resourceArea) {
    for (const cardId of resourceArea.cards) {
      draft.gundam.cardPositions[cardId] = "active";
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
  const resourceArea = draft.zones.resourceArea[playerId];
  if (!resourceArea) return;

  const resourceCount = getZoneSize(resourceArea);
  draft.gundam.activeResources[playerId] = resourceCount;
}

/**
 * Pass Move Definition
 *
 * Advances the game phase or ends the turn.
 */
export const passMove: GameMoveDefinition<GundamGameState> = {
  /**
   * Condition: Current player can always pass
   */
  condition: (state: GundamGameState, context: MoveContext): boolean => {
    const { playerId } = context;

    // Must be current player
    if (state.currentPlayer !== playerId) return false;

    // Cannot pass if game is over
    if (state.phase === "gameOver") return false;

    return true;
  },

  /**
   * Reducer: Advance phase or end turn
   *
   * Transitions to next phase. If ending turn, switches players and resets state.
   */
  reducer: (draft: Draft<GundamGameState>, context: MoveContext): void => {
    const currentPhase = draft.phase;
    const isEndingTurn = currentPhase === "end";

    // Advance to next phase
    draft.phase = getNextPhase(currentPhase);

    // If ending turn, handle turn handoff
    if (isEndingTurn) {
      // Switch active player
      const currentPlayerIndex = draft.players.indexOf(draft.currentPlayer);
      if (currentPlayerIndex === -1) {
        throw new Error(
          `Current player ${draft.currentPlayer} not found in players array`,
        );
      }
      const nextPlayerIndex = (currentPlayerIndex + 1) % draft.players.length;
      const nextPlayer = draft.players[nextPlayerIndex];
      if (!nextPlayer) {
        throw new Error(`No player found at index ${nextPlayerIndex}`);
      }
      draft.currentPlayer = nextPlayer;

      // Increment turn counter
      draft.turn += 1;

      // Reset per-turn state
      draft.gundam.attackedThisTurn = [];
      draft.gundam.hasPlayedResourceThisTurn = {
        [draft.players[0]]: false,
        [draft.players[1]]: false,
      };

      // Ready all cards and refresh resources for new active player
      readyAllCards(draft, draft.currentPlayer);
      refreshResources(draft, draft.currentPlayer);
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
