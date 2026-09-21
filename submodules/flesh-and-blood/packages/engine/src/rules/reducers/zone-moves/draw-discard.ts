import type { FabMatchState } from "../../../state.ts";
import { nextRandom } from "../../../random.ts";
import type { ProposedEvent } from "../../events.ts";
import type { FabEventReduction } from "../../../kernel/transaction-kernel.ts";
import { libraryPlayerId } from "../../shared-library.ts";
import { moveKnownObject } from "../shared.ts";
import { fabPlayerLogCard } from "../../../player-log.ts";

type FamilyEvent = Extract<ProposedEvent, { name: "discard" | "draw" | "reveal" | "look" | "opt" }>;

/** Zone-move reduction for: discard, draw, reveal, look, opt */
export function reduceDrawDiscard(
  state: FabMatchState,
  event: FamilyEvent,
): FabEventReduction | null {
  switch (event.name) {
    case "discard": {
      if (
        !moveKnownObject(state, event.data.object, "hand", "graveyard", event.data.destinationRef)
      )
        return null;
      if (event.data.random) state.rngState = nextRandom(state.rngState).state;
      // Brute weapons/actions: "if you have discarded a card with 6 or more {p}
      // this turn" (Mandible Claw, Savage Beatdown, …). Stamp on the discarding
      // controller — power from the discarded object's printed base.
      const discarded = event.data.object;
      const power = discarded.base?.numeric?.power;
      const controllerId = discarded.controllerId ?? discarded.ownerId;
      if (typeof power === "number" && power >= 6 && controllerId) {
        const controller = state.players[controllerId];
        if (controller) controller.history.turn.discardedPower6 = true;
      }
      return {
        state,
        followUpEvents: [
          {
            ...event,
            name: "put-into-graveyard",
            bindings: { ...event.bindings, resultingEvent: true },
            data: {
              object: event.data.object,
              destinationRef: event.data.destinationRef,
              from: "hand",
              to: "graveyard",
              reason: "discard",
            },
          },
        ],
      };
    }
    case "draw": {
      // Hand is always the drawing seat; deck may be the shared-library host.
      const moved = moveKnownObject(
        state,
        event.data.object,
        "deck",
        "hand",
        event.data.destinationRef,
        undefined,
        event.data.playerId,
      );
      if (!moved) return null;
      state.players[event.data.playerId]!.history.turn.drewCard = true;
      state.players[event.data.playerId]!.history.turn.cardsDrawn += 1;
      return {
        state,
        playerLogFacts: [
          {
            kind: "card-drawn",
            playerId: event.data.playerId,
            card: fabPlayerLogCard(event.data.object),
          },
        ],
      };
    }
    case "reveal": {
      // Observation only — no zone change. Stamp the turn ledger so
      // revealed-power-greater-than-damage-dealt-this-turn can read it, and so
      // the viewer projection can keep privately-revealed cards (CR 8.5.17)
      // inspectable for the rest of the turn.
      const player = state.players[event.data.playerId];
      const power = event.data.object.current.numeric.power;
      if (
        player &&
        typeof power === "number" &&
        power > player.history.turn.highestPowerRevealedThisTurn
      ) {
        player.history.turn.highestPowerRevealedThisTurn = power;
      }
      const zoneKind = event.data.object.zoneRef.zone;
      if (player && (zoneKind === "deck" || zoneKind === "hand")) {
        const revealed = player.history.turn.revealedPrivateInstancesThisTurn ?? [];
        if (!revealed.some((entry) => entry.instanceId === event.data.object.instanceId)) {
          player.history.turn.revealedPrivateInstancesThisTurn = [
            ...revealed,
            {
              instanceId: event.data.object.instanceId,
              ownerId: event.data.object.ownerId,
              zoneKind,
            },
          ];
        }
      }
      return state.objects[event.data.object.instanceId] ? { state } : null;
    }
    case "look":
      // Observation only — no zone change; presence validates the snapshot still exists.
      return state.objects[event.data.object.instanceId] ? { state } : null;
    case "opt": {
      const deckOwnerId = libraryPlayerId(state, event.data.playerId, "deck");
      const player = state.players[deckOwnerId];
      if (!player || event.data.count <= 0) return null;
      const selected = [...event.data.top, ...event.data.bottom];
      const currentTop = state.containers.zonesByPlayerId[deckOwnerId]!.deck.slice(
        -event.data.count,
      );
      if (
        selected.length !== currentTop.length ||
        new Set(selected).size !== selected.length ||
        !selected.every((instanceId) => currentTop.includes(instanceId))
      )
        return null;
      state.containers.zonesByPlayerId[deckOwnerId]!.deck.splice(
        state.containers.zonesByPlayerId[deckOwnerId]!.deck.length - currentTop.length,
        currentTop.length,
      );
      state.containers.zonesByPlayerId[deckOwnerId]!.deck.unshift(...event.data.bottom);
      state.containers.zonesByPlayerId[deckOwnerId]!.deck.push(...event.data.top);
      return { state };
    }
    default: {
      const _exhaustive: never = event;
      void _exhaustive;
      return null;
    }
  }
}
