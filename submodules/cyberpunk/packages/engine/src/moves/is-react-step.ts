import type { MatchState } from "../types/match-state.ts";
import type { PlayerId } from "../types/branded.ts";

/**
 * Returns true when the given player is the rival (defender) in the
 * react step of an attack. Used to gate reaction moves like playing
 * QUICK cards or calling Legends.
 */
export function isReactStep(state: MatchState, playerId: PlayerId): boolean {
  return (
    state.G.gamePhase === "main" &&
    state.G.attackState !== null &&
    state.G.attackState.step === "react" &&
    state.G.attackState.rivalId === playerId
  );
}
