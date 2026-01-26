import type { GundamGameState } from "../../types";

/**
 * Shield Victory Win Condition
 *
 * Rule 5-6-1: The player who has no Shields left in play loses the game.
 *
 * @param state - Current game state
 * @returns Win condition result or undefined if game continues
 */
export function checkVictory(
  state: GundamGameState,
):
  | { winner: string; reason: string; metadata: { finalShieldCount: number } }
  | undefined {
  for (const playerId of state.players) {
    if (state.zones.shieldSection[playerId].cards.length === 0) {
      return {
        winner: playerId,
        reason: "shield_victory",
        metadata: { finalShieldCount: 0 },
      };
    }
  }
  return undefined;
}
