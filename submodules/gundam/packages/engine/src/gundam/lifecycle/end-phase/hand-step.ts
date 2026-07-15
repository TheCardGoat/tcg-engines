import type { MatchState } from "../../../types/match-state.ts";

export function handStepEndIf(state: MatchState): boolean {
  const turnPlayer = state.ctx.status.turnPlayer;
  if (!turnPlayer) return true;
  const handKey = `hand:${turnPlayer}`;
  const handCount = state.ctx.zones.public.zoneSummaries[handKey]?.count ?? 0;
  return handCount <= 10;
}
