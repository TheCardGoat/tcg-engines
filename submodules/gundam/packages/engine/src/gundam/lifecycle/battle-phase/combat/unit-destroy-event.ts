import type { GundamG } from "../../../types.ts";
import {
  enqueueDelayedTriggers,
  enqueueObserverTriggers,
  enqueueOwnCardTriggers,
} from "../../../effects/pending-effects.ts";
import type { BattleEffCtx } from "./types.ts";

/**
 * Publish the event for an attacking Unit whose battle damage destroys the
 * defending Unit, including a Unit that entered the battle as a Blocker.
 * Capture the defeated Unit's paired Pilot before destruction cleanup and
 * pass it explicitly when the caller publishes the event afterward.
 */
export function enqueueAttackerDestroyedDefenderTrigger(
  g: GundamG,
  attackerId: string,
  defenderId: string,
  attackerPlayerId: string,
  ctx: BattleEffCtx,
  defeatedPairedPilotId = g.pilotAssignments[defenderId],
): void {
  const event = {
    type: "attackerDestroyedDefender" as const,
    cardId: attackerId,
    sourceCardId: attackerId,
    defeatedCardId: defenderId,
    defeatedPairedPilotId,
    ownerId: attackerPlayerId,
    playerId: attackerPlayerId,
    damageType: "battle" as const,
  };
  enqueueOwnCardTriggers(g, event, attackerId, attackerPlayerId, ctx.framework);
  enqueueObserverTriggers(g, event, ctx.framework, attackerId);
  enqueueEnemyCardDestroyedByBattleTrigger(g, attackerId, defenderId, attackerPlayerId, ctx);
}

/**
 * Publish the card-type-agnostic battle-destruction event used by delayed
 * effects whose printed text says "destroys an enemy card with battle
 * damage." Standard Unit-only 【Destroyed】 observers keep using
 * `attackerDestroyedDefender`; this event is intentionally delayed-trigger
 * only so Base and Shield destruction cannot activate Unit-only observers.
 */
export function enqueueEnemyCardDestroyedByBattleTrigger(
  g: GundamG,
  attackerId: string,
  destroyedCardId: string,
  attackerPlayerId: string,
  ctx: BattleEffCtx,
): void {
  enqueueDelayedTriggers(
    g,
    {
      type: "enemyCardDestroyedByBattle",
      cardId: attackerId,
      sourceCardId: attackerId,
      destroyedCardId,
      ownerId: attackerPlayerId,
      playerId: attackerPlayerId,
    },
    ctx.framework,
    {},
  );
}
