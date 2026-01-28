/**
 * Riftbound Victory Conditions
 *
 * Win condition logic for the game.
 */

import type { PlayerId, RiftboundState } from "../../types";

/**
 * Check if a player has won the game
 *
 * @param state - Current game state
 * @returns The winning player ID, or null if no winner
 */
export function checkVictory(state: RiftboundState): PlayerId | null {
  const playerIds = Object.keys(state.players);

  for (const playerId of playerIds) {
    const player = state.players[playerId];
    if (player.health <= 0) {
      // Return the opponent as the winner
      const opponent = playerIds.find((id) => id !== playerId);
      return opponent ?? null;
    }
  }

  return null;
}

/**
 * Check if the game has ended
 *
 * @param state - Current game state
 * @returns true if the game has ended
 */
export function isGameOver(state: RiftboundState): boolean {
  return state.status === "finished" || checkVictory(state) !== null;
}
