import type { MatchState } from "../../../types/match-state.ts";

export function mainPhaseEndIf(state: MatchState): boolean {
  return state.ctx.status.nextTurnPlayer != null;
}
