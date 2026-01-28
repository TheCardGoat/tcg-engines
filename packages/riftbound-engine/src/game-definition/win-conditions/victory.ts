/**
 * Riftbound Victory Conditions
 *
 * Win condition logic for the tabletop simulator.
 * Victory is achieved by reaching the victory score (8 points for 1v1).
 */

import type { PlayerId, RiftboundGameState } from "../../types";

/**
 * Check if a player has won the game
 *
 * @param state - Current game state
 * @returns The winning player ID, or null if no winner
 */
export function checkVictory(state: RiftboundGameState): PlayerId | null {
  const playerIds = Object.keys(state.players) as PlayerId[];

  for (const playerId of playerIds) {
    const player = state.players[playerId];
    if (player && player.victoryPoints >= state.victoryScore) {
      return playerId;
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
export function isGameOver(state: RiftboundGameState): boolean {
  return state.status === "finished" || checkVictory(state) !== null;
}

/**
 * Get the current score for a player
 *
 * @param state - Current game state
 * @param playerId - Player to check
 * @returns Victory points for the player
 */
export function getPlayerScore(
  state: RiftboundGameState,
  playerId: PlayerId,
): number {
  return state.players[playerId]?.victoryPoints ?? 0;
}

/**
 * Check if a player is one point away from victory
 *
 * @param state - Current game state
 * @param playerId - Player to check
 * @returns true if player needs only one more point to win
 */
export function isAtMatchPoint(
  state: RiftboundGameState,
  playerId: PlayerId,
): boolean {
  const score = getPlayerScore(state, playerId);
  return score === state.victoryScore - 1;
}
