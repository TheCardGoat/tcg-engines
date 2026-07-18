import type { GundamG } from "../../../types.ts";
import {
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
  };
  enqueueOwnCardTriggers(g, event, attackerId, attackerPlayerId, ctx.framework);
  enqueueObserverTriggers(g, event, ctx.framework, attackerId);
}
