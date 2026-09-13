import type { GrandArchiveObjectId, GrandArchivePlayerId } from "./identity.ts";
import type { GrandArchiveCardInstance, GrandArchiveMatchState } from "./model.ts";

/**
 * Whether a viewer retained the identity of a currently face-down card in
 * banishment. Public vs Private Information 6.1 makes this historical: a
 * card that was public immediately before becoming private remains known.
 */
export function grandArchiveViewerRetainsBanishedIdentity(
  state: GrandArchiveMatchState,
  viewerId: GrandArchivePlayerId,
  objectId: GrandArchiveObjectId,
): boolean {
  const object = state.objects[objectId];
  if (!object || object.zone !== "banishment" || object.facing !== "face-down") return false;

  let entryIndex = -1;
  for (let index = state.eventHistory.length - 1; index >= 0; index -= 1) {
    const event = state.eventHistory[index];
    if (
      event?.type === "object-moved" &&
      event.objectId === objectId &&
      event.to === "banishment"
    ) {
      entryIndex = index;
      break;
    }
  }
  if (entryIndex < 0) return false;
  const entry = state.eventHistory[entryIndex];
  if (!entry || entry.type !== "object-moved") return false;

  const previousControllerId =
    entry.previousControllerId ?? entry.previousObject?.controllerId ?? object.controllerId;
  let known =
    entry.previousObject?.facing === "face-up" ||
    (viewerId === previousControllerId && entry.from !== "main-deck");

  for (const event of state.eventHistory.slice(entryIndex + 1)) {
    if (event.type === "card-revealed" && event.objectId === objectId) known = true;
    if (event.type === "object-facing-changed" && event.objectId === objectId) {
      if (event.facing === "face-up") known = true;
    }
    if (event.type === "object-controller-changed" && event.objectId === objectId) {
      const formerControllerId = event.previousBaseControllerId;
      if (viewerId === object.ownerId || viewerId === formerControllerId) known = false;
    }
  }
  return known;
}

/** Event-time identity knowledge for a zone change into a private facing. */
export function grandArchiveViewerKnowsMovedIdentity(
  viewerId: GrandArchivePlayerId,
  controllerId: GrandArchivePlayerId,
  event: {
    readonly from: import("@tcg/grand-archive-types").GrandArchiveZone;
    readonly to: import("@tcg/grand-archive-types").GrandArchiveZone;
    readonly entryFacing?: "face-up" | "face-down";
    readonly previousObject?: GrandArchiveCardInstance;
    readonly orderedPrivatePlacementKnowledge?: import("../kernel/events.ts").GrandArchiveOrderedPrivatePlacementKnowledge;
  },
): boolean {
  if (event.orderedPrivatePlacementKnowledge === "none") return false;
  if (event.orderedPrivatePlacementKnowledge === "owner-only") {
    return viewerId === event.previousObject?.ownerId;
  }
  if (event.previousObject?.facing === "face-up") return true;
  if (viewerId !== controllerId) return false;
  return !(
    event.from === "main-deck" &&
    event.to === "banishment" &&
    event.entryFacing === "face-down"
  );
}
