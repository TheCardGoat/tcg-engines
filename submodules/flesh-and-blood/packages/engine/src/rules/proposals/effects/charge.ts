import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { ProposedEvent } from "../../events.ts";
import { nextFabDestinationRef, snapshotObject } from "../../snapshots.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, fabZoneForSnapshot, objectTargets, unsupported } from "../shared.ts";

/**
 * CR 8.5.29 Charge (as a resolution effect): put a hand card into the
 * controller's soul and stamp `history.turn.charged` via the charge observation.
 *
 * Play-time optional charge costs use `play/charge.ts`; this leaf covers
 * printed "Charge" resolution text (and the leaf-contract path where the
 * attack source is `self` — a different hand card is charged).
 */
export function proposeCharge(
  ctx: ProposalContext,
  effect: FabEffect & { type: "charge" },
): FabEffectProposalResult {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;

  // Printed "charge your hero's soul" often targets controller (player). That
  // means put a hand card into soul — resolve via at-resolution hand picks or
  // auto-select a distinct hand card (leaf-contract / single-card hands).
  let objects =
    effect.target.selector === "controller"
      ? null
      : objectTargets(state, layer, effect.target, targetPath, effectTargets, effectPath);

  if (effect.target.selector === "controller") {
    const handPick =
      effectTargets[effectPath.join(".")] ??
      effectTargets[`${targetPath}:target`] ??
      effectTargets[targetPath];
    if (handPick && handPick.length > 0) {
      objects = handPick.flatMap((target) => {
        if (target.kind !== "object") return [];
        const instanceId = target.ref.instanceId;
        const live = state.objects[instanceId];
        if (!live || live.incarnation !== target.ref.incarnation) return [];
        const snap = snapshotObject(state, instanceId, layer.controllerId, "hand");
        return state.containers.zonesByPlayerId[layer.controllerId]?.hand.includes(instanceId)
          ? [snap]
          : [];
      });
      if (objects.length === 0) return { supported: true, events: [] };
    } else {
      const handIds = state.containers.zonesByPlayerId[layer.controllerId]?.hand ?? [];
      const handCardId = handIds.find((id) => id !== layer.source.instanceId);
      if (!handCardId) return { supported: true, events: [] };
      objects = [snapshotObject(state, handCardId, layer.controllerId, "hand")];
    }
  }

  if (!objects) return unsupported(effect, "charge target is unresolved");
  if (objects.length === 0) return { supported: true, events: [] };

  const events: ProposedEvent[] = [];
  for (const object of objects) {
    let charged = object;
    // Self on a resolving attack is not a hand card — charge another hand card.
    if (object.instanceId === layer.source.instanceId || object.zone !== "hand") {
      if (object.zone === "soul" && object.instanceId !== layer.source.instanceId) {
        events.push(chargeObservation(layer, processId, object));
        continue;
      }
      const handIds = state.containers.zonesByPlayerId[layer.controllerId]?.hand ?? [];
      const handCardId = handIds.find((id) => id !== layer.source.instanceId);
      if (!handCardId) {
        return unsupported(effect, "charge requires a hand card distinct from the source");
      }
      charged = snapshotObject(state, handCardId, layer.controllerId, "hand");
    }

    const from = fabZoneForSnapshot(charged.zone);
    if (!from) return unsupported(effect, "charge source zone is unknown");
    if (from !== "soul") {
      events.push({
        ...baseEvent(layer, processId),
        name: "move-zone",
        affected: [charged],
        data: {
          object: charged,
          destinationRef: nextFabDestinationRef(state, charged, events.length),
          from,
          to: "soul",
          reason: "rule",
        },
      });
    }
    events.push(chargeObservation(layer, processId, charged));
  }
  return { supported: true, events };
}

function chargeObservation(
  layer: ProposalContext["layer"],
  processId: ProposalContext["processId"],
  charged: import("../../events.ts").FabObjectSnapshot,
): ProposedEvent {
  return {
    ...baseEvent(layer, processId),
    name: "charge",
    affected: [layer.source, charged],
    bindings: {
      charged: layer.source,
      chargedCard: charged,
      "charged-this-way": charged,
    },
    data: {
      actorId: layer.controllerId,
      object: layer.source,
      charged,
    },
  };
}
