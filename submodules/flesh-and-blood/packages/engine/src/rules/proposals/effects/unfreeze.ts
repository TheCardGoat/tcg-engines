import type { FabEffect } from "@tcg/flesh-and-blood-types";
import type { FabEffectProposalResult, ProposalContext } from "../shared.ts";
import { baseEvent, heroTargets, objectTargets, unsupported } from "../shared.ts";
import { snapshotObject } from "../../snapshots.ts";

/**
 * CR 8.5.37 Unfreeze — clear the frozen marker from targeted objects.
 * Hero selectors expand to all frozen objects controlled by that seat.
 * Emits set-status `"unfrozen"`; the reducer clears the frozen marker.
 */
export function proposeUnfreeze(
  ctx: ProposalContext,
  effect: FabEffect & { type: "unfreeze" },
): FabEffectProposalResult {
  const { state, layer, processId, effectTargets, effectPath, targetPath } = ctx;
  const target = effect.target;

  let objects = objectTargets(state, layer, target, targetPath, effectTargets, effectPath) ?? null;

  // Hero seat → all frozen objects that player controls.
  if (
    !objects &&
    (target.selector === "opponent" ||
      target.selector === "controller" ||
      target.selector === "each-hero" ||
      target.selector === "each-other-hero")
  ) {
    const playerIds = heroTargets(state, layer, target, targetPath);
    if (!playerIds) return unsupported(effect, "unfreeze hero target is unresolved");
    const collected = [];
    for (const playerId of playerIds) {
      const player = state.players[playerId];
      if (!player) continue;
      for (const [zone, ids] of Object.entries(state.containers.zonesByPlayerId[playerId]!)) {
        for (const instanceId of ids) {
          const object = state.objects[instanceId];
          if (!object?.markers.some((marker) => marker.kind === "frozen")) continue;
          collected.push(
            snapshotObject(
              state,
              instanceId,
              playerId,
              zone as import("../../../state.ts").FabZoneKind,
            ),
          );
        }
      }
    }
    objects = collected;
  }

  if (!objects) return unsupported(effect, "unfreeze target is unresolved");
  if (objects.length === 0) return { supported: true, events: [] };

  return {
    supported: true,
    events: objects.map((object) => ({
      ...baseEvent(layer, processId),
      name: "set-status" as const,
      affected: [object],
      data: { object, status: "unfrozen" },
    })),
  };
}
