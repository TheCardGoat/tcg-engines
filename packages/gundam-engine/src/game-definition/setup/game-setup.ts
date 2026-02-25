import type { PlayerId } from "@tcg/core";
import { createInitialGundamState, type GundamGameState } from "../../types";

/**
 * Game Setup Function
 *
 * Initializes the Gundam game state.
 * Uses the IState pattern where:
 * - internal.zones is initialized by the framework zone manager
 * - internal.cards is initialized by the framework
 * - internal.cardMetas is initialized as cards are created
 * - external state is initialized here with game-specific values
 *
 * @param players - List of players in the game
 * @returns Initial Gundam game state
 */
export function setupGundamGame(
  players: Array<{ id: string }>,
): GundamGameState {
  const playerIds = players.map((p) => p.id as PlayerId);
  // Default to first player starting if not specified
  // In a real game, this would be determined by coin flip or similar
  return createInitialGundamState(playerIds[0], playerIds[1], playerIds[0]);
}
