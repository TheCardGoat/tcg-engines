import type { LifecycleContext } from "../../../types/index.ts";
import type { MatchState } from "../../../types/match-state.ts";
import type { PlayerId } from "../../../types/branded.ts";
import type { GundamG } from "../../types.ts";
import { isCombatBroken } from "./combat/is-combat-broken.ts";
import { battleEndStepOnEnter } from "./battle-end-step.ts";
import { logPhaseEntered } from "../../logging.ts";

/**
 * Battle-phase action step (rule 8-4).
 *
 * Two responsibilities:
 *  - Rule 8-3-5: if the attacker or target was destroyed during the
 *    block step, skip this step and go to battle-end-step.
 *  - Rule 8-4-1: players take turns starting with the standby player
 *    activating 【Action】 commands / 【Activate･Action】 effects.
 *    Seed pendingDecision = [standby, attacker] and hand activePlayer
 *    to the standby, mirroring end-phase/action-step.ts.
 */
export function battleActionStepOnEnter(ctx: LifecycleContext): void {
  logPhaseEntered(ctx.framework, { phase: "battle-phase", step: "action-step" });

  const g = ctx.G as GundamG;
  if (isCombatBroken(g, ctx.framework)) {
    battleEndStepOnEnter(ctx);
    return;
  }

  const playerIds = [...ctx.framework.state.playerIds] as string[];
  const turnPlayer = ctx.framework.state.status.turnPlayer as string | undefined;
  const standbyPlayer = playerIds.find((id) => id !== turnPlayer) ?? (playerIds[0] as string);

  const pendingDecision = [
    standbyPlayer as PlayerId,
    ...(playerIds.filter((id) => id !== standbyPlayer) as PlayerId[]),
  ];

  ctx.framework.status.patch({
    activePlayer: standbyPlayer as PlayerId,
    pendingDecision,
  });
}

export function battlePhaseActionStepEndIf(state: MatchState): boolean {
  return (state.ctx.status.pendingDecision?.length ?? 0) === 0;
}
