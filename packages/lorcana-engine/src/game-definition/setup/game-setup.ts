import type { PlayerId } from "@tcg/core";
import type { LorcanaGameState } from "../../types";

/**
 * Game Setup Function
 *
 * Initializes the Lorcana game state.
 *
 * @param players - List of players in the game
 * @returns Initial Lorcana game state
 */
export function setupLorcanaGame(
  players: Array<{ id: string }>,
): LorcanaGameState {
  const playerIds = players.map((p) => p.id as PlayerId);
  const loreScores: Record<PlayerId, number> = {};

  for (const playerId of playerIds) {
    loreScores[playerId] = 0;
  }

  const startingPlayerId = playerIds[0];

  return {
    loreScores,
    effects: [],
    bag: [],
    characterStates: {},
    turnNumber: 1,
    activePlayerId: startingPlayerId,
    hasInkedThisTurn: false,
    startingPlayerId,
    currentPhase: "beginning",
    currentStep: "ready",
    isGameOver: false,
  };
}
