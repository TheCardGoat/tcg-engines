import type { MatchState } from "../types/match-state.ts";
import type { PlayerId } from "../types/branded.ts";

/**
 * Returns true when the given player is the rival (defender) in the
 * defensive step of an attack. Used to gate reaction moves like playing
 * QUICK cards or calling Legends.
 */
export function isDefensiveStep(state: MatchState, playerId: PlayerId): boolean {
  return (
    state.G.gamePhase === "main" &&
    state.G.attackState !== null &&
    state.G.attackState.step === "defensive" &&
    state.G.attackState.rivalId === playerId
  );
}
