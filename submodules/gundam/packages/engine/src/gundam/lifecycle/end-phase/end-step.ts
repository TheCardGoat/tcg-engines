import type { LifecycleContext } from "../../../types/index.ts";
import type { GundamG } from "../../types.ts";
import { emitGundamLog, logPhaseEntered } from "../../logging.ts";
import { getKeywordValue, hasKeyword } from "../../rules/derived-state.ts";
import {
  enqueueDelayedTriggers,
  enqueueObserverTriggers,
  enqueueOwnCardTriggers,
} from "../../effects/pending-effects.ts";

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
    const event = {
      type: "turnEnded",
      cardId: sourceId,
      ownerId: turnPlayer,
      pairedPilotId: g.pilotAssignments[sourceId],
    };
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
    const repairAmount = getKeywordValue(cardId, "Repair", g, ctx.framework.cards, ctx.framework);
    const recoveredAmount = Math.min(currentDamage, repairAmount);
    if (recoveredAmount <= 0) continue;
    const remainingDamage = currentDamage - recoveredAmount;
    if (remainingDamage > 0) {
      g.damage[cardId] = remainingDamage;
    } else {
      delete g.damage[cardId];
    }
    emitGundamLog(
      ctx.framework,
      {
        type: "gundam.effect.hpRecovered",
        values: { cardId, amount: recoveredAmount },
        visibility: { mode: "PUBLIC" },
        category: "action",
      },
      ctx.framework.cards.getController(cardId),
    );
    // <Repair> is HP recovery (rules 5-6-1 and 13-1-1-1), so it must
    // publish the same event as an explicit recoverHP action. This lets
    // "when this Unit recovers HP" effects observe keyword recovery.
    const ownerId = ctx.framework.cards.getOwner(cardId);
    if (!ownerId) continue;
    const event = { type: "unitHealed", cardId, ownerId: String(ownerId) } as const;
    enqueueOwnCardTriggers(g, event, cardId, String(ownerId), ctx.framework);
    enqueueObserverTriggers(g, event, ctx.framework, cardId);
  }
}
