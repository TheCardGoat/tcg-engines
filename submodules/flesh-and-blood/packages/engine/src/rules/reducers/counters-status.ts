import type { FabMatchState } from "../../state.ts";
import { selectFabActiveFace } from "../../game/active-face.ts";
import type { ProposedEvent } from "../events.ts";
import type { FabEventReduction } from "../../kernel/transaction-kernel.ts";
import { canUntapObject } from "../untap-restrictions.ts";
import { livingObjectZeroLifeClears, setFaceDownMarker, setObjectMarker } from "./shared.ts";

export type CountersStatusEventName =
  | "set-status"
  | "set-tapped"
  | "counter-added"
  | "numeric-counter-added"
  | "numeric-counter-removed"
  | "counter-removed"
  | "turn-face-up"
  | "turn-face-down"
  | "modify-power"
  | "awaken"
  | "change-active-face"
  | "sharpen";

type CountersStatusEvent = Extract<ProposedEvent, { name: CountersStatusEventName }>;

export function reduceCountersStatusEvent(
  state: FabMatchState,
  event: CountersStatusEvent,
): FabEventReduction | null {
  switch (event.name) {
    case "set-status": {
      const status = event.data.status;
      // Choose-card binds via event.bindings; chosen-card is not a CR marker.
      if (status === "chosen-card") return { state };
      const object = state.objects[event.data.object.instanceId];
      if (!object) return null;

      // Warmonger's Diplomacy: stamp the seat's game-history choice so
      // has-status chose-war / chose-peace reads history.game.diplomacyChoice.
      if (status === "chose-war" || status === "chose-peace") {
        let seat = object.ownerId;
        for (const pid of state.playerIds) {
          if (state.containers.zonesByPlayerId[pid]?.heroZone.includes(object.instanceId)) {
            seat = pid;
            break;
          }
        }
        const player = seat ? state.players[seat] : undefined;
        if (player) {
          player.history.game.diplomacyChoice = status === "chose-war" ? "war" : "peace";
        }
      }

      // Discrete freeze / unfreeze markers (CR 8.5.34 / 8.5.37).
      if (status === "frozen") {
        if (object.markers.some((marker) => marker.kind === "frozen")) return null;
        setObjectMarker(state, object.instanceId, "frozen", true);
        return { state };
      }
      if (status === "unfrozen") {
        if (!object.markers.some((marker) => marker.kind === "frozen")) return null;
        setObjectMarker(state, object.instanceId, "frozen", false);
        return { state };
      }

      // CR 9.3 mark — stamp the player-level marked flag via the hero object.
      if (status === "marked") {
        const playerId = object.ownerId;
        // Prefer the seat that owns this object in a hero zone.
        let seat = playerId;
        for (const pid of state.playerIds) {
          if (state.containers.zonesByPlayerId[pid]?.heroZone.includes(object.instanceId)) {
            seat = pid;
            break;
          }
        }
        const player = seat ? state.players[seat] : undefined;
        if (!player) return null;
        if (player.marked) return null;
        player.marked = true;
        // Also keep a status marker for LKI / filter readers.
        if (
          !object.markers.some((marker) => marker.kind === "status" && marker.value === "marked")
        ) {
          state.objects[object.instanceId] = {
            ...object,
            markers: [...object.markers, { kind: "status", value: "marked" }],
          };
        }
        return { state };
      }

      // Extra turn queue (CR take-extra-turn).
      if (status === "extra-turn-queued") {
        const playerId = object.ownerId;
        let seat = playerId;
        for (const pid of state.playerIds) {
          if (state.containers.zonesByPlayerId[pid]?.heroZone.includes(object.instanceId)) {
            seat = pid;
            break;
          }
        }
        const player = seat ? state.players[seat] : undefined;
        if (!player) return null;
        player.extraTurnsQueued += 1;
        return { state };
      }

      // Contract registration (CR 8.5.39) — `contract:<task>`.
      if (status.startsWith("contract:")) {
        const task = status.slice("contract:".length);
        const playerId = object.ownerId;
        const player = playerId ? state.players[playerId] : undefined;
        if (player) player.activeContract = task;
        if (object.markers.some((marker) => marker.kind === "status" && marker.value === status)) {
          return { state };
        }
        state.objects[object.instanceId] = {
          ...object,
          markers: [
            ...object.markers.filter(
              (marker) => !(marker.kind === "status" && marker.value.startsWith("contract:")),
            ),
            { kind: "status", value: status },
          ],
        };
        return { state };
      }

      if (object.markers.some((marker) => marker.kind === "status" && marker.value === status))
        return null;
      state.objects[event.data.object.instanceId] = {
        ...object,
        markers: [
          ...object.markers.filter((marker) => marker.kind !== "status"),
          { kind: "status", value: status },
        ],
      };
      const namedCard = status.startsWith("named-card:")
        ? status.slice("named-card:".length)
        : null;
      return {
        state,
        ...(namedCard && event.controllerId
          ? {
              playerLogFacts: [
                {
                  kind: "localized-message" as const,
                  message: {
                    key: "flesh-and-blood.name-card" as const,
                    values: { playerId: event.controllerId, cardName: namedCard },
                    category: "rules" as const,
                  },
                },
              ],
            }
          : {}),
      };
    }
    case "set-tapped": {
      if (
        !state.objects[event.data.object.instanceId] &&
        !state.cardDefinitions[event.data.object.instanceId]
      )
        return null;
      const object = state.objects[event.data.object.instanceId];
      if (!object) return null;
      // Event snapshots identify one object incarnation. A stale event must
      // never tap, untap, or reset limits on a replacement incarnation that
      // happens to reuse the same instance id.
      if (object.incarnation !== event.data.object.ref.incarnation) return null;
      // CR 1.0.2 / 8.5.56: this is the authoritative tapped -> untapped
      // transition. Producers may propose an untap, but every path (including
      // new producers and direct event journals) is denied here when a rule
      // restricts this exact object.
      if (!event.data.tapped && !canUntapObject(state, event.data.object.ref)) return null;
      const tapped = object.markers.some((marker) => marker.kind === "tapped");
      // No-op only when already matching and no limit-reset side effect.
      if (tapped === event.data.tapped) return null;
      if (tapped !== event.data.tapped) {
        setObjectMarker(state, event.data.object.instanceId, "tapped", event.data.tapped);
      }
      return { state };
    }
    case "counter-added": {
      if (event.data.amount <= 0) return null;
      if (event.bindings.enterArenaCounterSeedApplied === true) return { state };
      if (
        !updateNamedCounter(
          state,
          event.data.object.instanceId,
          event.data.counter,
          event.data.amount,
        )
      )
        return null;
      // Aphrodias / AZS: "if an aura with a holo counter has entered the arena
      // under your control this turn" — stamp when a holo counter is placed on
      // an Aura (enter-with-holo packages emit counter-added after enter-arena).
      if (event.data.counter === "holo") {
        const snap = event.data.object;
        const typeBox = snap.current?.typeBox ?? snap.base?.typeBox;
        const isAura = Boolean(
          typeBox &&
          ((typeBox.types as readonly string[]).includes("Aura") ||
            (typeBox.subtypes as readonly string[]).includes("Aura")),
        );
        const controllerId = snap.controllerId ?? snap.ownerId;
        if (isAura && controllerId && state.players[controllerId]) {
          state.players[controllerId]!.history.turn.holoAuraEnteredThisTurn = true;
        }
      }
      return { state };
    }
    case "numeric-counter-added": {
      if (event.data.count <= 0 || event.data.value === 0) return null;
      const object = state.objects[event.data.object.instanceId];
      if (!object) return null;
      state.objects[event.data.object.instanceId] = {
        ...object,
        counters: [
          ...object.counters,
          {
            kind: "numeric",
            property: event.data.property,
            value: event.data.value,
            count: event.data.count,
          },
        ],
      };
      // CR 2.5.3f: changing life counters can reduce a living permanent to zero.
      return {
        state,
        ...(event.data.property === "life"
          ? { followUpEvents: livingObjectZeroLifeClears(state, event) }
          : {}),
      };
    }
    case "numeric-counter-removed": {
      // Remove N matching ±property counters (value + property identity).
      // Fail closed when the object lacks enough matching counters so optional
      // "if you do" principals do not falsely produce events (Anticipating Gaze).
      // CR 8.5.58 end-phase expiry may remove 0 remaining +1{p} counters and
      // still drop the sharpened-this-turn marker.
      const sharpenExpiry = event.cause.kind === "rule" && event.cause.rule === "sharpen-end-phase";
      if (!sharpenExpiry && (event.data.count <= 0 || event.data.value === 0)) return null;
      const object = state.objects[event.data.object.instanceId];
      if (!object) return null;
      let remaining = event.data.count;
      const nextCounters = [];
      for (const counter of object.counters) {
        if (
          remaining > 0 &&
          counter.kind === "numeric" &&
          counter.property === event.data.property &&
          counter.value === event.data.value
        ) {
          const take = Math.min(remaining, counter.count);
          remaining -= take;
          const left = counter.count - take;
          if (left > 0) nextCounters.push({ ...counter, count: left });
          continue;
        }
        nextCounters.push(counter);
      }
      if (!sharpenExpiry && remaining > 0) return null;
      const nextMarkers = sharpenExpiry
        ? object.markers.filter(
            (marker) => !(marker.kind === "status" && marker.value === "sharpened-this-turn"),
          )
        : object.markers;
      state.objects[event.data.object.instanceId] = {
        ...object,
        counters: sharpenExpiry ? nextCounters : remaining > 0 ? object.counters : nextCounters,
        markers: nextMarkers,
      };
      // CR 2.5.3f: changing life counters can reduce a living permanent to zero.
      return {
        state,
        ...(event.data.property === "life"
          ? { followUpEvents: livingObjectZeroLifeClears(state, event) }
          : {}),
      };
    }
    case "counter-removed": {
      if (event.data.amount <= 0) return null;
      const object = state.objects[event.data.object.instanceId];
      const current =
        object?.counters.find(
          (counter) => counter.kind === "named" && counter.name === event.data.counter,
        )?.count ?? 0;
      if (current < event.data.amount) return null;
      if (
        !updateNamedCounter(
          state,
          event.data.object.instanceId,
          event.data.counter,
          -event.data.amount,
        )
      )
        return null;
      return { state };
    }
    case "turn-face-up": {
      const object = state.objects[event.data.object.instanceId];
      if (!object?.markers.some((marker) => marker.kind === "face-down")) return null;
      setFaceDownMarker(state, event.data.object.instanceId, false);
      return { state };
    }
    case "turn-face-down": {
      const object = state.objects[event.data.object.instanceId];
      if (!object || object.markers.some((marker) => marker.kind === "face-down")) return null;
      setFaceDownMarker(state, event.data.object.instanceId, true);
      return { state };
    }
    case "awaken": {
      // CR 8.5.43: flip to permanent (back) face and mark awakened. Idempotent
      // when already on back with the awakened marker.
      const object = state.objects[event.data.object.instanceId];
      if (!object) return null;
      const definition = state.cardDefinitions[object.canonicalId];
      if (!definition || definition.layout.kind !== "flip") return null;
      const backFaceId = definition.layout.back.faceId;
      const alreadyAwakened =
        object.activeFace.kind === "paired" &&
        object.activeFace.activeFaceIds.includes(backFaceId) &&
        object.markers.some(
          (marker) =>
            marker.kind === "awakened" || (marker.kind === "status" && marker.value === "awakened"),
        );
      if (alreadyAwakened) return null;
      const withoutAwakened = object.markers.filter(
        (marker) =>
          !(
            marker.kind === "awakened" ||
            (marker.kind === "status" && marker.value === "awakened")
          ),
      );
      state.objects[event.data.object.instanceId] = {
        ...object,
        activeFace: selectFabActiveFace(definition, backFaceId),
        markers: [...withoutAwakened, { kind: "awakened" }],
      };
      return { state };
    }
    case "change-active-face": {
      const object = state.objects[event.data.object.instanceId];
      if (!object || object.incarnation !== event.data.object.ref.incarnation) return null;
      const definition = state.cardDefinitions[object.canonicalId];
      if (!definition) return null;
      try {
        state.objects[event.data.object.instanceId] = {
          ...object,
          activeFace: selectFabActiveFace(definition, event.data.faceId),
        };
      } catch {
        return null;
      }
      return { state };
    }
    case "modify-power": {
      if (event.data.from === event.data.to) return null;
      return state.objects[event.data.object.instanceId] ? { state } : null;
    }
    case "sharpen": {
      // CR 8.5.58: place `count` +1{p} counters and mark sharpened this turn.
      // Replacements may have already boosted `count` (additional times).
      if (event.data.count <= 0) return null;
      const object = state.objects[event.data.object.instanceId];
      if (!object) return null;
      // Retain the performing player and the sword type at the committed event,
      // independently of the object's subsequent zone, controller, or counters.
      const player = state.players[event.data.playerId];
      if (player && event.data.object.current.typeBox.subtypes.includes("Sword")) {
        player.history.turn.sharpenedSwordThisTurn = true;
      }
      const hasSharpenedStatus = object.markers.some(
        (marker) => marker.kind === "status" && marker.value === "sharpened-this-turn",
      );
      state.objects[event.data.object.instanceId] = {
        ...object,
        counters: [
          ...object.counters,
          {
            kind: "numeric",
            property: "power",
            value: 1,
            count: event.data.count,
          },
        ],
        markers: hasSharpenedStatus
          ? object.markers
          : [...object.markers, { kind: "status", value: "sharpened-this-turn" }],
      };
      return { state };
    }
    default:
      return assertNeverCountersStatus(event);
  }
}

// --- Counters/status domain helpers ---

function updateNamedCounter(
  state: FabMatchState,
  instanceId: string,
  name: string,
  delta: number,
): boolean {
  const object = state.objects[instanceId];
  if (!object) return false;
  const current =
    object.counters.find((counter) => counter.kind === "named" && counter.name === name)?.count ??
    0;
  const next = current + delta;
  if (next < 0 || next === current) return false;
  const remaining = object.counters.filter(
    (counter) => counter.kind !== "named" || counter.name !== name,
  );
  state.objects[instanceId] = {
    ...object,
    counters: next === 0 ? remaining : [...remaining, { kind: "named", name, count: next }],
  };
  return true;
}

function assertNeverCountersStatus(event: never): never {
  throw new Error(`Unhandled FAB counters/status event: ${JSON.stringify(event)}`);
}
