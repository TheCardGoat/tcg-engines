import type { FabMatchState } from "../../../state.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";
import { nextRandom } from "../../../random.ts";
import { basePropertiesOf, fabCreatedObjectCanonicalId } from "../../../cards.ts";
import type { ProposedEvent } from "../../events.ts";
import type { FabEventReduction } from "../../../kernel/transaction-kernel.ts";
import { createSyntheticFabObjectSnapshot } from "../../snapshots.ts";
import { engineZone, nextEventId } from "../shared.ts";
import { fabCanonicalCardId, fabObjectInstanceId, fabPlayerId } from "../../../game/identity.ts";
import { fabActiveFaceLocationForZone, initialFabActiveFace } from "../../../game/active-face.ts";

type FamilyEvent = Extract<
  ProposedEvent,
  { name: "create" | "search" | "shuffle-zone" | "random-token-request" | "roll-request" }
>;

/** Zone-move reduction for: create, search, shuffle-zone, random-token-request, roll-request */
export function reduceCreateSearch(
  state: FabMatchState,
  event: FamilyEvent,
): FabEventReduction | null {
  switch (event.name) {
    case "search":
      return state.players[event.data.playerId] ? { state } : null;
    case "shuffle-zone": {
      const player = state.players[event.data.playerId];
      const zone = engineZone(event.data.zone);
      if (!player || !zone) return null;
      const cards = state.containers.zonesByPlayerId[event.data.playerId]![zone];
      for (let index = cards.length - 1; index > 0; index -= 1) {
        const roll = nextRandom(state.rngState);
        state.rngState = roll.state;
        const swapIndex = Math.floor(roll.value * (index + 1));
        [cards[index], cards[swapIndex]] = [cards[swapIndex]!, cards[index]!];
      }
      return { state };
    }
    case "create": {
      const player = state.players[event.data.playerId];
      const object = event.data.object;
      if (!player || state.objects[object.instanceId]) return null;
      const canonicalId = object.canonicalId ?? `token:${object.instanceId}`;
      const definition =
        state.cardDefinitions[canonicalId] ?? state.cardDefinitions[`token:${canonicalId}`] ?? null;
      if (!definition) return null;
      // Determine the destination zone from the object's zoneRef (defaults to arena).
      const destZone = object.zoneRef?.zone ?? "arena";
      state.counters.objectIncarnation += 1;
      state.objects[object.instanceId] = {
        instanceId: fabObjectInstanceId(object.instanceId),
        canonicalId: fabCanonicalCardId(canonicalId),
        objectKind: object.objectKind,
        baseSource: object.baseSource,
        ownerId: fabPlayerId(event.data.playerId),
        incarnation: state.counters.objectIncarnation,
        visibility: "public",
        activeFace:
          object.activeFace ??
          initialFabActiveFace(definition, fabActiveFaceLocationForZone(destZone)),
        cardPropertyState: { kind: "whole-card" },
        // create-token.withCounters (and other enters-with counter proposals)
        // put records on the snapshot; honor them so the token enters with
        // its printed counters rather than always empty.
        counters: object.counterRecords ? [...object.counterRecords] : [],
        markers: [],
        history: {
          moves: [
            {
              from: null,
              to: { playerId: fabPlayerId(event.data.playerId), zone: destZone },
              eventId: nextEventId(state),
              turnNumber: state.turnNumber,
              combatNumber: null,
              chainLinkNumber: null,
              lki: null,
            },
          ],
        },
      };
      state.containers.zonesByPlayerId[event.data.playerId]![destZone].push(object.instanceId);
      // Only emit enter-arena follow-up for arena-bound tokens.
      if (destZone !== "arena") return { state, followUpEvents: [] };
      return {
        state,
        followUpEvents: [
          {
            ...event,
            name: "enter-arena",
            affected: [object],
            data: {
              object,
              destinationRef: null,
              from: "unknown",
              to: "permanent",
              reason: "create",
            },
          },
        ],
      };
    }
    case "random-token-request": {
      const player = state.players[event.data.playerId];
      if (
        !player ||
        event.data.options.length === 0 ||
        event.data.options.some((option) => option.length === 0) ||
        state.objects[event.data.instanceId]
      )
        return null;
      const roll = nextRandom(state.rngState);
      state.rngState = roll.state;
      const token = event.data.options[Math.floor(roll.value * event.data.options.length)]!;
      const canonicalId = fabCreatedObjectCanonicalId(token);
      const registeredDef = state.cardDefinitions[canonicalId];
      if (!registeredDef) return null;
      const tokenBase = basePropertiesOf(registeredDef);
      const object = createSyntheticFabObjectSnapshot({
        ref: {
          instanceId: event.data.instanceId,
          incarnation: state.counters.objectIncarnation + 1,
        },
        canonicalId,
        objectKind: "created-token",
        baseSource: { kind: "registered" },
        ownerId: event.data.playerId,
        controllerId: event.data.playerId,
        zone: "unknown" as const,
        zoneRef: { playerId: fabPlayerId(event.data.playerId), zone: "arena" },
        base: tokenBase,
      });
      return {
        state,
        followUpEvents: [
          {
            ...event,
            name: "create",
            affected: [object],
            data: { playerId: event.data.playerId, object },
          },
        ],
      };
    }
    case "roll-request": {
      if (
        !state.players[event.data.playerId] ||
        !Number.isInteger(event.data.sides) ||
        event.data.sides < 2
      ) {
        return null;
      }
      const extraDice =
        typeof event.data.extraDice === "number" && event.data.extraDice > 0
          ? Math.floor(event.data.extraDice)
          : 0;
      // Gambler's Gloves rerolls every die rolled this way. Derive the number
      // of discarded faces from the final, replacement-modified dice pool so
      // application order cannot change RNG consumption.
      const rerollCount =
        typeof event.data.rerollCount === "number" && event.data.rerollCount > 0
          ? Math.floor(event.data.rerollCount)
          : 0;
      let discard = rerollCount * (extraDice + 1);
      const discardGuard = createFabLoopGuard({ label: "create-search: rng discard faces" });
      while (discard > 0) {
        discardGuard.tick();
        const skipped = nextRandom(state.rngState);
        state.rngState = skipped.state;
        discard -= 1;
      }
      const faces: number[] = [];
      const faceGuard = createFabLoopGuard({ label: "create-search: extra die faces" });
      for (let remaining = extraDice + 1; remaining > 0; remaining -= 1) {
        faceGuard.tick();
        const roll = nextRandom(state.rngState);
        state.rngState = roll.state;
        faces.push(Math.floor(roll.value * event.data.sides) + 1);
      }
      const result =
        event.data.ignore === "lowest" && faces.length > 1
          ? Math.max(...faces)
          : faces[faces.length - 1]!;
      const outputBinding = event.data.outputBinding;
      return {
        state,
        followUpEvents: [
          {
            ...event,
            name: "roll",
            bindings: {
              ...event.bindings,
              "die-result": result,
              "roll-result": result,
              ...(outputBinding ? { [outputBinding]: result } : {}),
            },
            data: {
              playerId: event.data.playerId,
              sides: event.data.sides,
              result,
              ...(faces.length > 1 ? { faces } : {}),
            },
          },
        ],
      };
    }
    default: {
      const _exhaustive: never = event;
      void _exhaustive;
      return null;
    }
  }
}
