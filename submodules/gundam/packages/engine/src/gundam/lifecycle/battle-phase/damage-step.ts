import type { LifecycleContext } from "../../../types/index.ts";
import type { GundamG } from "../../types.ts";
import { resolveDirectBattle } from "./combat/resolve-direct.ts";
import { resolveBlockedBattle } from "./combat/resolve-blocked.ts";
import { isCombatBroken } from "./combat/is-combat-broken.ts";
import { battleEndStepOnEnter } from "./battle-end-step.ts";
import { logPhaseEntered } from "../../logging.ts";

export function battlePhaseDamageStepOnEnter(ctx: LifecycleContext): void {
  logPhaseEntered(ctx.framework, { phase: "battle-phase", step: "damage-step" });

  const g = ctx.G as GundamG;

  // Rule 8-4-2: if attacker or target was destroyed/moved during the
  // action step, skip damage resolution and proceed to battle-end-step.
  if (isCombatBroken(g, ctx.framework)) {
    battleEndStepOnEnter(ctx);
    return;
  }

  const combat = g.turnMetadata.pendingCombat;
  if (!combat) return;

  const { attackerId, attackerPlayerId, target, blockerId, blockerPlayerId } = combat;
  const effCtx = {
    G: g,
    sourcePlayerId: attackerPlayerId,
    sourceCardId: attackerId,
    framework: ctx.framework,
  };

  if (target === "direct" || (!blockerId && target !== "direct")) {
    resolveDirectBattle(g, attackerId, attackerPlayerId, target, effCtx);
  } else if (blockerId && blockerPlayerId) {
    resolveBlockedBattle(g, attackerId, attackerPlayerId, blockerId, blockerPlayerId, effCtx);
  }
}
