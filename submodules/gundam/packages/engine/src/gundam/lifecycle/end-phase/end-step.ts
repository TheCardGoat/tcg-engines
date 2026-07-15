import type { LifecycleContext } from "../../../types/index.ts";
import type { GundamG } from "../../types.ts";
import { logPhaseEntered } from "../../logging.ts";
import { getKeywordValue, hasKeyword } from "../../rules/derived-state.ts";
import { enqueueDelayedTriggers, enqueueOwnCardTriggers } from "../../effects/pending-effects.ts";

export function endStepOnEnter(ctx: LifecycleContext): void {
  logPhaseEntered(ctx.framework, { phase: "end-phase", step: "end-step" });

  const turnPlayer = ctx.framework.state.status.turnPlayer as string | undefined;
  if (!turnPlayer) return;

  const g = ctx.G as GundamG;
  const sourceIds = [
    ...ctx.framework.zones.getCards({ zone: "battleArea", playerId: turnPlayer }),
    ...ctx.framework.zones.getCards({ zone: "baseSection", playerId: turnPlayer }),
  ];
  for (const sourceId of sourceIds) {
    const event = { type: "turnEnded", cardId: sourceId, ownerId: turnPlayer };
    enqueueOwnCardTriggers(g, event, sourceId, turnPlayer, ctx.framework);
    enqueueDelayedTriggers(g, event, ctx.framework, {});
  }

  // Rule 13-1-1: <Repair> activates at the end of its controller's turn.
  // This belongs in the end step, while temporary "during this turn"
  // keyword grants are still active, rather than the turn-cycle hook that
  // runs after cleanup has removed those grants.
  for (const cardId of sourceIds) {
    if (!hasKeyword(cardId, "Repair", g, ctx.framework.cards, ctx.framework)) continue;
    const currentDamage = g.damage[cardId] ?? 0;
    if (currentDamage <= 0) continue;
    const remainingDamage =
      currentDamage - getKeywordValue(cardId, "Repair", g, ctx.framework.cards, ctx.framework);
    if (remainingDamage > 0) {
      g.damage[cardId] = remainingDamage;
    } else {
      delete g.damage[cardId];
    }
  }
}
