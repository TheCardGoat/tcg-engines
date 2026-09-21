import type { AnimationPlanV2 } from "@tcg/protocol/animations";
import type { GrandArchiveServerEngine } from "./server-engine.ts";

/** Small display data, using exactly the adapter's authorized resource set. */
export function projectGrandArchiveNative(engine: GrandArchiveServerEngine, actorId: string) {
  const viewer = { role: "player" as const, actorId };
  const state = engine.getViewerState(viewer);
  const resources = engine.getViewerResources(viewer);
  const cards = Object.fromEntries(
    Object.entries(resources.cardsById).map(([id, card]) => {
      const face = card.layout.kind === "single-faced" ? card.layout.face : card.layout.defaultFace;
      return [id, { name: face.name, rulesText: face.rulesText }];
    }),
  );
  const authorized = Object.fromEntries(
    state.players.flatMap((player) =>
      Object.values(player.zones).flatMap((zone) =>
        (zone.visibility === "visible" ? zone.objects : zone.revealedObjects).map((object) => [
          object.id,
          object.activeDefinitionId ?? object.definitionId,
        ]),
      ),
    ),
  );
  Object.assign(authorized, resources.authorizedCardDefinitionIds);
  const objects = Object.fromEntries(
    Object.entries(authorized).map(([id, definitionId]) => [
      id,
      {
        definitionId,
        ...(engine.art.printingIdByObjectId[id]
          ? { printingId: engine.art.printingIdByObjectId[id] }
          : {}),
        ...(resources.cardImageUrls?.[id] ? { imageUrl: resources.cardImageUrls[id] } : {}),
      },
    ]),
  );
  const cardResources = new Map(Object.entries(resources.cardsById));
  const displayState = {
    schemaVersion: state.schemaVersion,
    stateVersion: state.stateVersion,
    mode: state.mode,
    status: state.status,
    winnerIds: state.winnerIds,
    selfId: state.selfId,
    pregamePlayerId: state.pregamePlayerId,
    turn: state.turn,
    opportunityHolderId: state.opportunityHolderId,
    // Public field identities for the native champion anchors; no client card-type inference.
    championIds: Object.fromEntries(
      state.players.map((player) => {
        const field = player.zones.field;
        const visible = field.visibility === "visible" ? field.objects : field.revealedObjects;
        return [
          player.id,
          visible
            .filter((object) => {
              const card = cardResources.get(object.activeDefinitionId ?? object.definitionId);
              if (!card) return false;
              const face =
                card.layout.kind === "single-faced" ? card.layout.face : card.layout.defaultFace;
              return face.typeLine.types.includes("CHAMPION");
            })
            .map((object) => object.id),
        ];
      }),
    ),
    players: state.players,
    stack: state.stack.map((item) => ({
      id: item.id,
      kind: item.kind,
      presentation: item.presentation,
    })),
  };
  return {
    state: displayState,
    interaction: engine.getInteractionView(actorId),
    display: { catalog: engine.art.catalog, cards, objects },
  };
}

/** Conservative optional animation: identities must survive in both authorized snapshots.
 * Draws expose public zone endpoints, with opaque animation-only IDs for hidden cards.
 * Other newly visible cards use only their destination; other hidden transfers use counts.
 * Never derive events from prose or publish the engine journal.
 */
export function projectGrandArchiveNativeAnimation(
  engine: GrandArchiveServerEngine,
  before: ReturnType<typeof projectGrandArchiveNative>,
  after: ReturnType<typeof projectGrandArchiveNative>,
  eventOffset: number,
): AnimationPlanV2 {
  const steps: AnimationPlanV2["steps"] = [];
  for (const event of engine.runtime.state.eventHistory.slice(eventOffset)) {
    if (
      event.type === "object-moved" &&
      event.from === "main-deck" &&
      event.to === "hand" &&
      event.cause?.kind === "rule" &&
      (event.cause.rule === "draw-effect" || event.cause.rule === "draw-turn-based-action")
    ) {
      const ownerId = engine.runtime.state.objects[event.objectId]?.ownerId;
      if (!ownerId) continue;
      const visible = Boolean(after.display.objects[event.objectId]);
      steps.push({
        id: event.eventId,
        type: "entityTransfer",
        // Never serialize an opponent's hidden instance or printing identity.
        entity: { kind: "entity", id: visible ? event.objectId : `hidden-draw-${event.eventId}` },
        from: { kind: "zone", id: "main-deck", ownerId },
        to: { kind: "zone", id: "hand", ownerId },
        sourceFace: "hidden",
        destinationFace: visible ? "public" : "hidden",
        audioCue: "card.draw",
        durationMs: 650,
      });
    } else if (event.type === "object-moved" && after.display.objects[event.objectId]) {
      const knownBefore = Boolean(before.display.objects[event.objectId]);
      const ownerId = after.state.players.find((player) =>
        Object.values(player.zones).some((zone) =>
          (zone.visibility === "visible" ? zone.objects : zone.revealedObjects).some(
            (object) => object.id === event.objectId,
          ),
        ),
      )?.id;
      steps.push({
        id: event.eventId,
        type: "entityTransfer",
        entity: { kind: "entity", id: event.objectId },
        ...(knownBefore ? { from: { kind: "zone" as const, id: event.from, ownerId } } : {}),
        to: { kind: "zone", id: event.to, ownerId },
        sourceFace: knownBefore ? "public" : "hidden",
        destinationFace: "public",
      });
    } else if (event.type === "card-revealed" && after.display.objects[event.objectId]) {
      steps.push({
        id: event.eventId,
        type: "entityStateChange",
        entity: { kind: "entity", id: event.objectId },
        at: { kind: "entity", id: event.objectId },
        change: "face",
        sourceFace: "hidden",
        destinationFace: "public",
      });
    } else if (
      event.type === "stack-item-removed" &&
      event.outcome === "resolved" &&
      !event.internal &&
      before.state.stack.some((item) => item.id === event.itemId)
    ) {
      steps.push({
        id: event.eventId,
        type: "effect",
        source: { kind: "entity", id: event.itemId },
        targets: [],
        label: "Resolved",
      });
    }
  }
  return { id: `native-${engine.getStateID()}`, version: 2, steps };
}
