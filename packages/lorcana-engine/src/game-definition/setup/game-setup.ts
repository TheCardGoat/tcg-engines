import type { PlayerId } from "@tcg/core";
import type { LorcanaGameState } from "../../types/move-params";

/**
 * Game Setup Function
 *
 * Initializes the Lorcana game state.
 *
 * SIMPLIFIED from old approach:
 * - No manual activePlayerId, turnNumber, gamePhase (engine handles)
 * - No manual zone management (engine handles)
 * - Only Lorcana-specific state initialization
 *
 * @param players - List of players in the game
 * @returns Initial Lorcana game state
 */
export function setupLorcanaGame(
  players: Array<{ id: string }>,
): LorcanaGameState {
  const playerIds = players.map((p) => p.id);
  const loreScores: Record<PlayerId, number> = {};

  for (const playerId of playerIds) {
    loreScores[playerId as PlayerId] = 0;
  }

  return {
    loreScores,
    effects: [],
    bag: [],
  };
}
