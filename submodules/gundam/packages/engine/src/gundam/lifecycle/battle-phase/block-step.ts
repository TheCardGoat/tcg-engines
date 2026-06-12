import type { LifecycleContext } from "../../../types/index.ts";
import type { MatchState } from "../../../types/match-state.ts";
import type { PlayerId } from "../../../types/branded.ts";
import type { GundamG } from "../../types.ts";
import { isCombatBroken } from "./combat/is-combat-broken.ts";
import { battleEndStepOnEnter } from "./battle-end-step.ts";
import { logPhaseEntered } from "../../logging.ts";

/**
 * Battle-phase block step (rule 8-3).
 *
 * Invoked from attackStepOnEnter when combat survives the attack step,
 * and as the onEnter for natural flow transitions into block-step.
 *
 * Responsibilities:
 *  - Rule 8-3-5: if the attacker or target was destroyed by an
 *    attack-step effect, short-circuit to the battle end step (handled
 *    here as a safety net; attack-step catches the common case).
 *  - Priority handoff: the standby player alone may declare a block
 *    (rule 8-3-1), so this step hands activePlayer over to them — the
 *    same pattern as end-phase/action-step.ts.
 */
export function blockStepOnEnter(ctx: LifecycleContext): void {
  logPhaseEntered(ctx.framework, { phase: "battle-phase", step: "block-step" });

  const g = ctx.G as GundamG;

  if (isCombatBroken(g, ctx.framework)) {
    battleEndStepOnEnter(ctx);
    return;
  }

  const combat = g.turnMetadata.pendingCombat;
  if (!combat) return;

  const playerIds = [...ctx.framework.state.playerIds] as string[];
  const standbyPlayer =
    playerIds.find((id) => id !== combat.attackerPlayerId) ?? (playerIds[0] as string);

  ctx.framework.status.patch({
    activePlayer: standbyPlayer as PlayerId,
    pendingDecision: [standbyPlayer as PlayerId],
  });
}

export function battlePhaseBlockStepEndIf(state: MatchState): boolean {
  const g = state.G as GundamG;
  return g.turnMetadata.pendingCombat?.stage !== "block-step";
}
