import type { PlayerId } from "@tcg/core";
import { createInitialLorcanaState, type LorcanaGameState } from "../../types";

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
  // Default to first player starting if not specified
  // In a real game, this would be determined by coin flip or similar
  return createInitialLorcanaState(playerIds[0], playerIds[1], playerIds[0]);
}
