import type { LifecycleContext } from "../../../types/index.ts";
import type { MatchState } from "../../../types/match-state.ts";
import type { PlayerId } from "../../../types/branded.ts";
import { logPhaseEntered } from "../../logging.ts";

/**
 * Hand Step is performed by the turn player (rule 7-6-5-1). The end-phase
 * Action Step deliberately leaves priority with whichever player took the
 * final action; reset it here so a required hand-limit discard is executable
 * by the player who owns the oversized hand.
 */
export function handStepOnEnter(ctx: LifecycleContext): void {
  logPhaseEntered(ctx.framework, { phase: "end-phase", step: "hand-step" });
  const turnPlayer = ctx.framework.state.status.turnPlayer;
  if (!turnPlayer) return;
  ctx.framework.status.patch({
    activePlayer: turnPlayer as PlayerId,
    pendingDecision: [],
  });
}

export function handStepEndIf(state: MatchState): boolean {
  const turnPlayer = state.ctx.status.turnPlayer;
  if (!turnPlayer) return true;
  const handKey = `hand:${turnPlayer}`;
  const handCount = state.ctx.zones.public.zoneSummaries[handKey]?.count ?? 0;
  return handCount <= 10;
}
