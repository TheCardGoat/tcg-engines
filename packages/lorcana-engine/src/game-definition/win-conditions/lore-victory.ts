import type { LorcanaGameState } from "../../types";

/**
 * Lore Victory Win Condition
 *
 * Rule 1.9.1.1: First player to reach 20 lore wins the game
 *
 * @param state - Current game state
 * @returns Win condition result or undefined if game continues
 */
export function checkLoreVictory(
  state: LorcanaGameState,
):
  | { winner: string; reason: string; metadata: { finalLore: number } }
  | undefined {
  for (const [playerId, lore] of Object.entries(state.external.loreScores)) {
    if (lore >= 20) {
      return {
        winner: playerId,
        reason: "lore_victory",
        metadata: { finalLore: lore },
      };
    }
  }
  return undefined;
}
