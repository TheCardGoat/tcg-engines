import type { GrandArchiveZone } from "@tcg/grand-archive-types";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "./identity.ts";
import type { GrandArchiveMatchState } from "./model.ts";

const SHARED_CONTROLLED_ZONES = new Set<GrandArchiveZone>(["field", "effects-stack"]);
const HOST_CONTROLLED_ZONES = new Set<GrandArchiveZone>(["intent"]);

function physicallyStoredZoneIds(
  state: GrandArchiveMatchState,
  zone: GrandArchiveZone,
): readonly GrandArchiveObjectId[] {
  return state.turnOrder.flatMap((ownerId) => state.zones[ownerId][zone]);
}

function effectsStackCardOrder(
  state: GrandArchiveMatchState,
  physicalIds: readonly GrandArchiveObjectId[],
): readonly GrandArchiveObjectId[] {
  const ordered = state.stack.flatMap((item) =>
    item.kind === "card-activation" || item.kind === "materialization" || item.kind === "bestowment"
      ? [item.cardId]
      : [],
  );
  const onStack = new Set(ordered);
  return [...physicalIds.filter((objectId) => !onStack.has(objectId)), ...ordered];
}

/**
 * Rules-facing contents of a player's zone.
 *
 * Physical storage stays partitioned by immutable card owner so every zone
 * change can be routed deterministically. Field and Effects Stack are instead
 * shared zones whose relevant player is the current controller. Intent
 * follows the controller of its field host.
 */
export function grandArchivePlayerZoneObjectIds(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  zone: GrandArchiveZone,
): readonly GrandArchiveObjectId[] {
  if (!SHARED_CONTROLLED_ZONES.has(zone) && !HOST_CONTROLLED_ZONES.has(zone)) {
    return state.zones[playerId][zone];
  }

  const physicalIds = physicallyStoredZoneIds(state, zone);
  const orderedIds =
    zone === "effects-stack" ? effectsStackCardOrder(state, physicalIds) : physicalIds;
  return orderedIds.filter((objectId) => {
    const object = state.objects[objectId];
    if (!object) return false;
    if (SHARED_CONTROLLED_ZONES.has(zone)) return object.controllerId === playerId;
    const host = object.hostId ? state.objects[object.hostId] : undefined;
    return host?.zone === "field" && host.controllerId === playerId;
  });
}
