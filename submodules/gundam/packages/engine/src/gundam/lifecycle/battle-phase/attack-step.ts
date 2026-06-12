import type { LifecycleContext } from "../../../types/index.ts";
import type { GundamG } from "../../types.ts";
import {
  drainPendingEffects,
  enqueueObserverTriggers,
  enqueueOwnCardTriggers,
} from "../../effects/pending-effects.ts";
import { isCombatBroken } from "./combat/is-combat-broken.ts";
import { battleEndStepOnEnter } from "./battle-end-step.ts";
import { blockStepOnEnter } from "./block-step.ts";
import { logPhaseEntered } from "../../logging.ts";

/**
 * Battle-phase attack step (rule 8-2).
 *
 * Invoked by enter-battle.ts after it sets phase=battle-phase,
 * step=attack-step. Fires 【Attack】 triggered effects (rule 8-2-2),
 * then checks rule 8-2-4: if the attacker or target was destroyed or
 * moved by an attack-step effect, route straight to the battle end
 * step. Otherwise advances to the block step.
 *
 * Not invoked automatically by the flow engine because enter-battle
 * sets the phase/step via StatusAPI directly (no findNextStep path).
 */
export function attackStepOnEnter(ctx: LifecycleContext): void {
  logPhaseEntered(ctx.framework, { phase: "battle-phase", step: "attack-step" });

  const g = ctx.G as GundamG;
  const combat = g.turnMetadata.pendingCombat;
  if (!combat) return;

  const { attackerId, attackerPlayerId, target } = combat;

  // Rule 8-2-2: 【Attack】 and "when this unit attacks" effects activate.
  // Enqueue own-card triggers + observer scan, then drain inline so the
  // 8-2-4 interrupt below reflects the post-trigger state. Effects that
  // need a player decision stay on the queue and will halt the flow at
  // the next transition boundary.
  const event = {
    type: "attackDeclared",
    attackerId,
    sourceCardId: attackerId,
    targetId: target,
    playerId: attackerPlayerId,
  };
  enqueueOwnCardTriggers(g, event, attackerId, attackerPlayerId, ctx.framework);
  enqueueObserverTriggers(g, event, ctx.framework, attackerId);
  drainPendingEffects(ctx);

  // Rule 8-2-4: if combat was broken by attack-step effects, skip block/
  // action/damage steps and clean up via battle-end-step.
  if (isCombatBroken(g, ctx.framework)) {
    battleEndStepOnEnter(ctx);
    return;
  }

  // Advance to block-step. Priority is handed off to the standby player
  // by blockStepOnEnter (rule 8-3-1).
  ctx.framework.status.setStep("block-step");
  g.turnMetadata.pendingCombat!.stage = "block-step";
  blockStepOnEnter(ctx);
}
