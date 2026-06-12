import type { LifecycleContext } from "../../../types/index.ts";
import type { PlayerId } from "../../../types/branded.ts";
import type { GundamG } from "../../types.ts";
import { emitGundamEvent } from "../../events.ts";
import { logCombatResolved, logPhaseEntered } from "../../logging.ts";

export function battleEndStepOnEnter(ctx: LifecycleContext): void {
  logPhaseEntered(ctx.framework, { phase: "battle-phase", step: "battle-end-step" });

  const g = ctx.G as GundamG;

  const combat = g.turnMetadata.pendingCombat;
  g.turnMetadata.pendingCombat = undefined;

  // Rule 8-6-1: all effects worded "during this battle" lose effect.
  g.continuousEffects = g.continuousEffects.filter((e) => e.duration !== "this-battle");

  const turnPlayer = ctx.framework.state.status.turnPlayer as string | undefined;
  if (turnPlayer) {
    ctx.framework.status.setPhase("main-phase");
    ctx.framework.status.setStep();
    ctx.framework.status.patch({
      activePlayer: turnPlayer as PlayerId,
      pendingDecision: [],
    });
  }

  emitGundamEvent(ctx.framework.events, {
    kind: "COMBAT_RESOLVED",
    payload: combat
      ? {
          attackerId: combat.attackerId,
          target: combat.target,
          blockerId: combat.blockerId,
        }
      : {},
  });
  if (combat) {
    logCombatResolved(ctx.framework, {
      attackerId: combat.attackerId,
      targetId: combat.target as string,
      blockerId: combat.blockerId,
    });
  }
}
