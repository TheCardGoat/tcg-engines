import type { FabMatchState } from "../../state.ts";
import { appendFabEventGroup } from "../../kernel/event-journal.ts";
import type { FabRulesProcess } from "../../rules/process.ts";
import { nextFabDestinationRef, snapshotObject } from "../../rules/snapshots.ts";
import type { FabEvaluatedObject } from "../../rules/rules-view.ts";

/**
 * MON Charge (CR 8.5.29): optional additional cost — put a card from hand into
 * the hero's soul. Emits move-zone hand→soul and a `charge` observation that
 * stamps `history.turn.charged` for "if you've charged this turn" gates.
 */
export function appendChargeEventGroups(
  process: FabRulesProcess,
  procedure: Extract<FabRulesProcess["procedure"], { readonly kind: "play-card" }>,
  preview: FabMatchState,
  currentObject: FabEvaluatedObject | null,
  resetOffset: number,
): string | null {
  const chargeId = procedure.chargeInstanceId;
  if (!chargeId) return null;
  // Only cards that print an optional charge additional-cost may charge.
  const hasChargeCost =
    currentObject?.current.abilities.some(
      (ability) =>
        ability.kind === "static" &&
        ability.playEffect?.role === "additional-cost" &&
        ability.playEffect.cost?.class === "effect" &&
        ability.playEffect.cost.type === "charge",
    ) ?? false;
  if (!hasChargeCost) return "This card cannot charge.";
  const hand = preview.containers.zonesByPlayerId[procedure.actorId]!.hand ?? [];
  if (!hand.includes(chargeId) || chargeId === procedure.object.instanceId) {
    return "The charge cost requires a different hand card.";
  }
  const charged = snapshotObject(preview, chargeId, procedure.actorId, "hand");
  const priorCharged = procedure.costBindings?.["charged-this-way"];
  const chargedThisWay = [
    ...(Array.isArray(priorCharged) ? priorCharged : priorCharged ? [priorCharged] : []),
    charged,
  ];
  procedure.costBindings = {
    ...procedure.costBindings,
    chargedCard: charged,
    "charged-this-way": chargedThisWay,
  };
  appendFabEventGroup(process, [
    {
      name: "move-zone",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [charged],
      bindings: { chargedCard: charged, "charged-this-way": chargedThisWay },
      data: {
        object: charged,
        destinationRef: nextFabDestinationRef(preview, charged, resetOffset),
        from: "hand",
        to: "soul",
        reason: "rule",
      },
    },
  ]);
  appendFabEventGroup(process, [
    {
      name: "charge",
      processId: process.processId,
      cause: { kind: "player-command", actorId: procedure.actorId, command: "begin-play" },
      controllerId: procedure.actorId,
      source: procedure.object,
      affected: [procedure.object, charged],
      bindings: {
        charged: procedure.object,
        chargedCard: charged,
        "charged-this-way": chargedThisWay,
      },
      data: {
        actorId: procedure.actorId,
        object: procedure.object,
        charged,
      },
    },
  ]);
  return null;
}
