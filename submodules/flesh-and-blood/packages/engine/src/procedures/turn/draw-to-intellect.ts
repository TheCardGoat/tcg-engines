import type { FabMatchState } from "../../state.ts";
import type { FabProcessId, ProposedEvent } from "../../rules/events.ts";
import { libraryPlayerId } from "../../rules/shared-library.ts";
import { effectivePlayerIntellect } from "../../rules/state-rules-view.ts";
import { nextFabDestinationRef, snapshotObject } from "../../rules/snapshots.ts";

type FabDrawEvent = Extract<ProposedEvent, { name: "draw" }>;

/**
 * CR 4.4.3f draw-to-intellect is one end-of-turn procedure step. The
 * turn-player draws every turn; on turn 1, each non-turn player also draws.
 *
 * Events are planned in rules order before the transaction starts. Reserving
 * cards per deck owner is required for shared-library games so two drawing
 * seats cannot propose the same top card.
 */
export function planFabEndPhaseDraws(
  state: FabMatchState,
  processId: FabProcessId,
  turnPlayerId: string,
): readonly FabDrawEvent[] {
  const drawingPlayerIds =
    state.turnNumber === 1
      ? [turnPlayerId, ...state.playerIds.filter((playerId) => playerId !== turnPlayerId)]
      : [turnPlayerId];
  const consumedByDeckOwner = new Map<string, number>();
  const events: FabDrawEvent[] = [];

  for (const playerId of drawingPlayerIds) {
    const deckOwnerId = libraryPlayerId(state, playerId, "deck");
    const deck = state.containers.zonesByPlayerId[deckOwnerId]!.deck;
    const alreadyReserved = consumedByDeckOwner.get(deckOwnerId) ?? 0;
    const targetHandSize = effectivePlayerIntellect(state, playerId);
    const currentHandSize = state.containers.zonesByPlayerId[playerId]!.hand.length;
    const drawCount = Math.min(
      Math.max(0, targetHandSize - currentHandSize),
      Math.max(0, deck.length - alreadyReserved),
    );
    const drawIds = deck
      .slice(deck.length - alreadyReserved - drawCount, deck.length - alreadyReserved)
      .reverse();
    consumedByDeckOwner.set(deckOwnerId, alreadyReserved + drawCount);

    for (const instanceId of drawIds) {
      const object = snapshotObject(state, instanceId, deckOwnerId, "deck");
      events.push({
        name: "draw",
        processId,
        cause: {
          kind: "rule",
          rule: "end-phase-draw-to-intellect",
          controllerId: playerId,
        },
        controllerId: playerId,
        source: null,
        affected: [object],
        bindings: {},
        data: {
          object,
          playerId,
          destinationRef: nextFabDestinationRef(state, object, events.length),
        },
      });
    }
  }

  return events;
}
