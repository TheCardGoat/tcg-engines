import type { MatchState } from "../types/match-state.ts";

/** v3 stores fight-result continuations and last-valid defeat event facts. */
export const COMBAT_STATE_VERSION = 3;

export function restoreCombatState(state: MatchState, version: number): MatchState {
  if (version !== COMBAT_STATE_VERSION) {
    throw new Error(`Unsupported Cyberpunk combat snapshot version: ${version}`);
  }
  const restored = structuredClone(state);
  for (const player of Object.values(restored.G.players)) {
    if (player.combatPriority !== "automatic" && player.combatPriority !== "hold") {
      throw new Error("Invalid combat priority in snapshot");
    }
  }
  return restored;
}
