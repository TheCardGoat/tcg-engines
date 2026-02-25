import type { GundamGameState } from "../../types";

/**
 * Shield Victory Win Condition
 *
 * Rule 5-6-1: The player who has no Shields left in play loses the game.
 *
 * In the IState pattern, zones are keyed by zoneId which includes player info.
 * Shield zones would be like "shieldSection-{playerId}".
 *
 * @param state - Current game state
 * @returns Win condition result or undefined if game continues
 */
export function checkVictory(
  state: GundamGameState,
):
  | { winner: string; reason: string; metadata: { finalShieldCount: number } }
  | undefined {
  // Get players from the hasPlayedResourceThisTurn record
  const playerIds = Object.keys(state.external.hasPlayedResourceThisTurn);

  for (const playerId of playerIds) {
    // Zone IDs are typically "{zoneName}-{playerId}" format
    const shieldZoneId = `shieldSection-${playerId}`;
    const shieldZone = state.internal.zones[shieldZoneId];

    if (shieldZone && shieldZone.cardIds.length === 0) {
      // This player has no shields - the OTHER player wins
      const winner = playerIds.find((id) => id !== playerId);
      if (winner) {
        return {
          winner,
          reason: "shield_victory",
          metadata: { finalShieldCount: 0 },
        };
      }
    }
  }
  return undefined;
}
