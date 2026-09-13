import type { FabEffect, FabTarget } from "@tcg/flesh-and-blood-types";
import type { FabObjectSnapshot, ProposedEvent } from "../../events.ts";
import { nextFabDestinationRef, snapshotObject } from "../../snapshots.ts";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import type { FabTargetMap } from "../../targets.ts";
import {
  baseEvent,
  fabZoneForSnapshot,
  objectTargets,
  playersForFabPlayer,
  unsupported,
} from "../shared.ts";

/**
 * CR 8.5.49 Exchange — swap two objects' zones (cross-player hand/equip).
 * Hero selectors (self / opponent) exchange the top hand card of that seat
 * (leaf-contract path).
 */
export function proposeExchange(
  ctx: ProposalContext,
  effect: FabEffect & { type: "exchange" },
): FabEffectProposalResult {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;

  const first = resolveExchangeSide(ctx, effect.first, `${targetPath}:first`, effectTargets, [
    ...effectPath,
    0,
  ]);
  const second = resolveExchangeSide(ctx, effect.second, `${targetPath}:second`, effectTargets, [
    ...effectPath,
    1,
  ]);
  if (!first || !second) return { supported: true, events: [] };
  if (first.instanceId === second.instanceId) return { supported: true, events: [] };

  const fromA = fabZoneForSnapshot(first.zone);
  const fromB = fabZoneForSnapshot(second.zone);
  if (!fromA || !fromB) return unsupported(effect, "exchange zone is unknown");

  const destPlayerA = second.controllerId ?? second.ownerId;
  const destPlayerB = first.controllerId ?? first.ownerId;

  const events: ProposedEvent[] = [
    {
      ...baseEvent(layer, processId),
      name: "move-zone",
      affected: [first],
      data: {
        object: first,
        destinationRef: nextFabDestinationRef(state, first),
        from: fromA,
        to: fromB,
        reason: "rule",
        destinationPlayerId: destPlayerA,
      },
    },
    {
      ...baseEvent(layer, processId),
      name: "move-zone",
      affected: [second],
      data: {
        object: second,
        destinationRef: nextFabDestinationRef(state, second, 1),
        from: fromB,
        to: fromA,
        reason: "rule",
        destinationPlayerId: destPlayerB,
      },
    },
  ];
  return { supported: true, events };
}

function resolveExchangeSide(
  ctx: ProposalContext,
  target: FabTarget,
  path: string,
  effectTargets: FabTargetMap,
  effectPath: readonly number[],
): FabObjectSnapshot | null {
  const { state, layer } = ctx;
  if (
    target.selector === "self" ||
    target.selector === "opponent" ||
    target.selector === "controller" ||
    target.selector === "each-other-hero"
  ) {
    const player =
      target.selector === "self" || target.selector === "controller" ? "controller" : "opponent";
    const playerIds = playersForFabPlayer(state, layer.controllerId, player, layer.bindings);
    if (!playerIds || playerIds.length !== 1) return null;
    const playerId = playerIds[0]!;
    const hand = state.containers.zonesByPlayerId[playerId]?.hand ?? [];
    const topId = hand[hand.length - 1];
    if (!topId) return null;
    return snapshotObject(state, topId, playerId, "hand");
  }
  const objects = objectTargets(state, layer, target, path, effectTargets, effectPath);
  return objects && objects.length === 1 ? objects[0]! : null;
}
