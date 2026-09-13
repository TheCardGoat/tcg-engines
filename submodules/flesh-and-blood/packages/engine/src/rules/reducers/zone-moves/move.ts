import type { FabMatchState } from "../../../state.ts";
import type { FabZone } from "@tcg/flesh-and-blood-types";
import { nextRandom } from "../../../random.ts";
import type { ProposedEvent } from "../../events.ts";
import type { FabEventReduction } from "../../../kernel/transaction-kernel.ts";
import { fabObjectInstanceId } from "../../../game/identity.ts";
import { nextFabDestinationRef, snapshotObject, snapshotPlayerId } from "../../snapshots.ts";
import { setFaceDownMarker, setObjectMarker, uniqueMonikerClears } from "../shared.ts";
import { selectFabActiveFace } from "../../../game/active-face.ts";
import { fabPlayerLogCard } from "../../../player-log.ts";
import { fabObjectDisplayName } from "../../../log/display-name.ts";
import {
  isTokenObject,
  ceaseTokenExistence,
  ceaseEphemeralCard,
  objectHasKeyword,
  resultingZoneEvents,
  isArenaZone,
  moveForZoneEvent,
  seedEnterArenaKeywordState,
  isMacroObject,
  ceaseMacroExistence,
} from "./helpers.ts";

export type FamilyEvent = Extract<
  ProposedEvent,
  {
    name:
      | "move-zone"
      | "enter-arena"
      | "leave-arena"
      | "enter-or-leave-arena"
      | "put-into-graveyard"
      | "banish"
      | "destroy"
      | "dies";
  }
>;

function seededCounterEvents(
  state: FabMatchState,
  event: Extract<FamilyEvent, { name: "enter-arena" }>,
  additions: readonly { readonly name: string; readonly count: number }[],
): ProposedEvent[] {
  if (additions.length === 0) return [];
  const object = snapshotObject(
    state,
    event.data.object.instanceId,
    snapshotPlayerId(event.data.object),
    "arena",
  );
  return additions.map((addition) => ({
    ...event,
    name: "counter-added" as const,
    affected: [object],
    bindings: { ...event.bindings, enterArenaCounterSeedApplied: true },
    data: { object, counter: addition.name, amount: addition.count },
  }));
}

/** Zone-move reduction for: move-zone, enter-arena, leave-arena, enter-or-leave-arena, put-into-graveyard, banish, destroy, dies */
export function reduceMove(state: FabMatchState, event: FamilyEvent): FabEventReduction | null {
  // CR 8.3.21b Ephemeral: if this would be put into a graveyard from anywhere,
  // instead it ceases to exist (removed from the game; no further interaction).
  if (event.data.to === "graveyard" && objectHasKeyword(state, event.data.object, "ephemeral")) {
    return ceaseEphemeralCard(state, event.data.object);
  }
  switch (event.name) {
    case "move-zone": {
      // CR 1.5.1–1.5.3: a Macro leaving the arena ceases to exist.
      if (
        isMacroObject(event.data.object) &&
        isArenaZone(event.data.from) &&
        !isArenaZone(event.data.to)
      ) {
        return ceaseMacroExistence(state, event.data.object);
      }
      // CR 8.1.8a / CR 3.0.12a: a token leaving the arena ceases to exist.
      if (
        isTokenObject(state, event.data.object) &&
        isArenaZone(event.data.from) &&
        !isArenaZone(event.data.to)
      ) {
        return ceaseTokenExistence(state, event);
      }
      if (!moveForZoneEvent(state, event.data)) return null;
      if (event.data.faceDown !== undefined) {
        setFaceDownMarker(state, event.data.object.instanceId, event.data.faceDown);
      }
      // Uzuri: after the card lands on the combat chain, make it the active
      // attacking card (swap activeLink.activeAttack.sourceObjectId). Combat stays open;
      // defending cards, damage state, and attack target are preserved.
      if (
        event.data.asAttacking === true &&
        event.data.to === "combat-chain" &&
        state.combat?.activeLink
      ) {
        state.combat = {
          ...state.combat,
          activeLink: {
            ...state.combat.activeLink,
            activeAttack: {
              kind: "card",
              sourceObjectId: fabObjectInstanceId(event.data.object.instanceId),
            },
          },
        };
      }
      // Clear the banish-until return ledger whenever a card leaves the banished
      // zone — not only on the synthetic end-phase "intimidate-returns" event
      // (which itself has `from: "banished"`). Any other exit (a future "move
      // from banished", destroy, etc.) must also drop the entry, or the writer's
      // instanceId dedup would retain a stale `returnToZone` and misroute the
      // next banish-until return of the same instance.
      if (event.data.from === "banished") {
        const player = state.players[snapshotPlayerId(event.data.object)];
        if (player) {
          player.intimidatedInstanceIds = player.intimidatedInstanceIds.filter(
            (entry) => entry.instanceId !== event.data.object.instanceId,
          );
        }
      }
      const privatelyBottomedFrom =
        event.data.to === "deck" &&
        event.data.position === "bottom" &&
        (event.data.from === "hand" || event.data.from === "arsenal")
          ? event.data.from
          : undefined;
      const boundHostRecord =
        event.data.to === "under" &&
        event.data.destinationHostId &&
        event.data.object.current.typeBox.subtypes.includes("Aura")
          ? state.objects[event.data.destinationHostId]
          : undefined;
      const boundHost = boundHostRecord
        ? snapshotObject(
            state,
            boundHostRecord.instanceId,
            event.controllerId ?? boundHostRecord.ownerId,
            "arena",
          )
        : undefined;
      return {
        state,
        followUpEvents: resultingZoneEvents(state, event),
        ...(boundHost
          ? {
              playerLogFacts: [
                {
                  kind: "localized-message" as const,
                  message: {
                    key: "flesh-and-blood.bind" as const,
                    values: {
                      auraName: fabObjectDisplayName(event.data.object),
                      hostName: fabObjectDisplayName(boundHost),
                    },
                    objectRefs: {
                      auraName: {
                        instanceId: event.data.object.instanceId,
                        canonicalId: event.data.object.canonicalId,
                      },
                      hostName: {
                        instanceId: boundHost.instanceId,
                        canonicalId: boundHost.canonicalId,
                      },
                    },
                    category: "action" as const,
                  },
                },
              ],
            }
          : privatelyBottomedFrom
            ? {
                playerLogFacts: [
                  {
                    kind: "card-bottomed" as const,
                    playerId: snapshotPlayerId(event.data.object),
                    card: fabPlayerLogCard(event.data.object),
                    from: privatelyBottomedFrom,
                  },
                ],
              }
            : {}),
      };
    }
    case "enter-arena": {
      const committedTransition =
        event.bindings.resultingEvent === true && event.data.transition?.after !== null;
      if (
        event.data.reason === "create" &&
        state.containers.zonesByPlayerId[snapshotPlayerId(event.data.object)]?.arena.includes(
          event.data.object.instanceId,
        )
      ) {
        if (event.data.entersTapped === true) {
          setObjectMarker(state, event.data.object.instanceId, "tapped", true);
        }
        // The create reducer installs an arena-bound object before emitting
        // this observation event, so there is no second zone move to perform.
        // The enter event must still run the shared identity-replacement
        // initialization: otherwise runtime-created permanents silently skip
        // authored "enters with" counters while played permanents receive
        // them. Keeping initialization on the enter-arena boundary gives both
        // paths one authoritative behavior.
        const additions = seedEnterArenaKeywordState(state, event.data.object.instanceId);
        return {
          state,
          followUpEvents: [
            ...seededCounterEvents(state, event, additions),
            ...uniqueMonikerClears(state, event),
          ],
        };
      }
      if (!committedTransition && !moveForZoneEvent(state, event.data)) return null;
      if (event.data.entersTapped === true) {
        setObjectMarker(state, event.data.object.instanceId, "tapped", true);
      }
      const entered = state.objects[event.data.object.instanceId];
      const enteredDefinition = entered ? state.cardDefinitions[entered.canonicalId] : undefined;
      if (
        entered &&
        enteredDefinition?.layout.kind === "flip" &&
        (enteredDefinition.layout.family === "invocation" ||
          enteredDefinition.layout.family === "construct")
      ) {
        state.objects[entered.instanceId] = {
          ...entered,
          activeFace: selectFabActiveFace(enteredDefinition, enteredDefinition.layout.back.faceId),
        };
      }
      // CR 8.2.9b: a Landmark entering the arena clears ALL other Landmark
      // permanents — no controller qualification ("cleared" = graveyard). CR
      // 3.0.12 defines clearing as a move-to-graveyard distinct from destroy,
      // so the clear is routed through plain `move-zone` follow-ups (reason
      // "rule", NOT "destroy"): the standard pipeline still fires leave-arena /
      // put-into-graveyard observations and resets incarnation / leftArenaThisTurn
      // (a raw arena.splice + graveyard.push previously bypassed all of it), but
      // "when this is destroyed" triggers (trigger-matcher keys on event name
      // "destroy") and destroy replacement effects (reason "destroy") do NOT fire
      // — clearing is not destruction. The cleared Landmark stays in the arena
      // until its follow-up moves it; nothing between here and the return reads
      // the old Landmark.
      const landmarkClearEvents: ProposedEvent[] = [];
      if (entered && enteredDefinition?.base.typeBox.subtypes.includes("Landmark")) {
        for (const [pid, zones] of Object.entries(state.containers.zonesByPlayerId)) {
          const previous = zones.arena.filter(
            (id) =>
              id !== entered.instanceId &&
              state.cardDefinitions[
                state.objects[id]?.canonicalId ?? ""
              ]?.base.typeBox.subtypes.includes("Landmark"),
          );
          for (const id of previous) {
            const snapshot = snapshotObject(state, id, pid, "arena");
            landmarkClearEvents.push({
              name: "move-zone",
              processId: event.processId,
              cause: { kind: "rule", rule: "landmark-uniqueness", controllerId: pid },
              controllerId: pid,
              source: null,
              affected: [snapshot],
              bindings: {},
              data: {
                object: snapshot,
                destinationRef: nextFabDestinationRef(state, snapshot, landmarkClearEvents.length),
                from: "arena",
                to: "graveyard",
                reason: "rule",
              },
            });
          }
        }
      }
      // CR 8.1.11b: a Demi-Hero that enters the arena either becomes its
      // controller's hero (when the controller has none) or is cleared.
      if (entered && enteredDefinition?.base.typeBox.types.includes("Demi-Hero")) {
        const controllerEntry = Object.entries(state.containers.zonesByPlayerId).find(([, zones]) =>
          zones.arena.includes(entered.instanceId),
        );
        const controllerId = controllerEntry?.[0];
        const controllerZones = controllerEntry?.[1];
        if (controllerId && controllerZones) {
          const arenaIndex = controllerZones.arena.indexOf(entered.instanceId);
          if (controllerZones.heroZone.length > 0) {
            // The controller already has a hero → the demi-hero is cleared.
            if (arenaIndex >= 0) controllerZones.arena.splice(arenaIndex, 1);
            if (!controllerZones.graveyard.includes(entered.instanceId))
              controllerZones.graveyard.push(entered.instanceId);
          } else {
            // No hero → the demi-hero is considered the controller's hero.
            if (arenaIndex >= 0) controllerZones.arena.splice(arenaIndex, 1);
            if (!controllerZones.heroZone.includes(entered.instanceId))
              controllerZones.heroZone.push(entered.instanceId);
            state.objects[entered.instanceId] = {
              ...entered,
              markers: [
                ...entered.markers.filter(
                  (marker) =>
                    !(marker.kind === "status" && marker.value === "demi-hero-promoted-to-hero"),
                ),
                { kind: "status", value: "demi-hero-promoted-to-hero" },
              ],
            };
          }
          // The demi-hero did not remain an arena permanent: skip enter-arena
          // keyword seeding and the crank path below.
          return { state, followUpEvents: uniqueMonikerClears(state, event) };
        }
      }
      const additions = seedEnterArenaKeywordState(state, event.data.object.instanceId);
      const counterEvents = seededCounterEvents(state, event, additions);
      const uniqueClears = uniqueMonikerClears(state, event);
      // CR 8.3.29 crank: consume the recorded play-time crank choice now that
      // the permanent has its seeded steam counter.
      const crankPlayerId = snapshotPlayerId(event.data.object);
      const crankPlayer = state.players[crankPlayerId];
      if (
        !crankPlayer ||
        !crankPlayer.pendingCrankInstanceIds.includes(event.data.object.instanceId)
      ) {
        return {
          state,
          followUpEvents: [...landmarkClearEvents, ...counterEvents, ...uniqueClears],
        };
      }
      crankPlayer.pendingCrankInstanceIds = crankPlayer.pendingCrankInstanceIds.filter(
        (instanceId) => instanceId !== event.data.object.instanceId,
      );
      // CR 8.3.29: "As this enters the arena, you may remove a steam counter
      // from it. If you do, gain an action point." The grant — and the
      // "cranked" fact (CR 8.3.29a) — are conditional on actually removing a
      // steam counter. A crank permanent that enters with no steam counter
      // consumes its play-time choice but removes nothing, records no crank,
      // and grants no action point.
      const hasSteamCounter =
        state.objects[event.data.object.instanceId]?.counters.some(
          (counter) => counter.kind === "named" && counter.name === "steam" && counter.count > 0,
        ) ?? false;
      if (!hasSteamCounter) {
        return {
          state,
          followUpEvents: [...landmarkClearEvents, ...counterEvents, ...uniqueClears],
        };
      }
      return {
        state,
        followUpEvents: [
          ...landmarkClearEvents,
          ...counterEvents,
          ...uniqueClears,
          {
            ...event,
            name: "counter-removed",
            bindings: { ...event.bindings },
            data: { object: event.data.object, counter: "steam", amount: 1 },
          },
          {
            ...event,
            name: "crank",
            data: { actorId: crankPlayerId, object: event.data.object, intent: false },
          },
          {
            ...event,
            name: "gain-assets",
            affected: [],
            data: {
              playerId: crankPlayerId,
              resources: 0,
              chi: 0,
              actionPoints: 1,
              amp: 0,
              origin: "procedure" as const,
            },
          },
        ],
      };
    }
    case "banish": {
      // Resulting banish observes a reason-"banish" transition (e.g.
      // choose-same-name-group, "instead, banish it" rewrites) whose physical
      // move already happened under another name; committing it feeds the
      // observation to triggers, contracts, and the kernel color stamps.
      if (event.bindings.resultingEvent === true) {
        return { state };
      }
      // CR 1.5.1–1.5.3: a Macro banished from the arena ceases to exist.
      if (isArenaZone(event.data.from) && isMacroObject(event.data.object)) {
        return ceaseMacroExistence(state, event.data.object);
      }
      // CR 8.1.8a / CR 3.0.12a: a token banished from the arena ceases to exist.
      if (isArenaZone(event.data.from) && isTokenObject(state, event.data.object)) {
        return ceaseTokenExistence(state, event);
      }
      if (!moveForZoneEvent(state, event.data)) return null;
      if (
        event.data.from === "soul" &&
        snapshotPlayerId(event.data.object) === event.controllerId
      ) {
        const player = state.players[event.controllerId];
        if (player) player.history.combatChain.cardsBanishedFromSoulThisCombatChain += 1;
      }
      // moveForZoneEvent stamps banishedPower6 when destination is banished.
      const faceDown = event.data.faceDown ?? event.data.object.faceDown;
      if (faceDown) {
        setFaceDownMarker(state, event.data.object.instanceId, true);
      }
      if (event.bindings.intimidatedCard) {
        const record = state.objects[event.data.object.instanceId];
        if (record) {
          state.objects[event.data.object.instanceId] = {
            ...record,
            markers: [
              ...record.markers.filter(
                (marker) =>
                  !(
                    marker.kind === "status" && marker.value === "banished-by-intimidate-this-turn"
                  ),
              ),
              { kind: "status", value: "banished-by-intimidate-this-turn" },
            ],
          };
        }
      }
      if (event.data.random) {
        state.rngState = nextRandom(state.rngState).state;
      }
      if (event.data.returnAtEndPhase) {
        const player = state.players[snapshotPlayerId(event.data.object)];
        if (
          player &&
          !player.intimidatedInstanceIds.some(
            (entry) => entry.instanceId === event.data.object.instanceId,
          )
        ) {
          // CR 8.5.1c: a banish-until effect returns the card to its previous
          // zone, not always hand. The banish event carries the source zone in
          // `from`. Snapshots already normalize the arena to the catalog
          // "permanent" zone, so the "arena" branch is a defensive fallback —
          // and if it is ever reached it must map to "permanent" (the arena),
          // not "hand", or it would contradict CR 8.5.1c. "unknown" is a
          // last-resort fallback to hand.
          const fromZone = event.data.from;
          const returnToZone: FabZone =
            fromZone === "arena" ? "permanent" : fromZone === "unknown" ? "hand" : fromZone;
          player.intimidatedInstanceIds.push({
            instanceId: event.data.object.instanceId,
            returnToZone,
          });
        }
      }
      return { state, followUpEvents: resultingZoneEvents(state, event) };
    }
    case "destroy":
      // CR 1.5.1–1.5.3: a Macro destroyed from the arena ceases to exist.
      if (isArenaZone(event.data.from) && isMacroObject(event.data.object)) {
        return ceaseMacroExistence(state, event.data.object);
      }
      // UST Incarnate: if this would die, instead it ceases to exist. The die
      // event does not occur (ceaseEphemeralCard emits no dies follow-up).
      if (objectHasKeyword(state, event.data.object, "incarnate")) {
        return ceaseEphemeralCard(state, event.data.object);
      }
      // CR 8.1.8a / CR 3.0.12a: a token destroyed from the arena ceases to exist.
      if (isArenaZone(event.data.from) && isTokenObject(state, event.data.object)) {
        return ceaseTokenExistence(state, event);
      }
      return moveForZoneEvent(state, event.data, true)
        ? { state, followUpEvents: resultingZoneEvents(state, event) }
        : null;
    case "dies":
      // Resulting dies is the CR 2.5.3g / 8.2.8a observation of a cease or
      // leave-arena that already happened (including token cease).
      if (event.bindings.resultingEvent === true) {
        return { state };
      }
      // CR 1.5.1–1.5.3: a Macro leaving the arena ceases to exist.
      if (isArenaZone(event.data.from) && isMacroObject(event.data.object)) {
        return ceaseMacroExistence(state, event.data.object);
      }
      // CR 8.1.8a / CR 3.0.12a: a token leaving the arena ceases to exist.
      if (isArenaZone(event.data.from) && isTokenObject(state, event.data.object)) {
        return ceaseTokenExistence(state, event);
      }
      return moveForZoneEvent(state, event.data)
        ? { state, followUpEvents: resultingZoneEvents(state, event) }
        : null;
    case "leave-arena":
    case "enter-or-leave-arena":
      // Observation-only resulting events. Token cease already removed the
      // object from state.objects (CR 8.1.8a) before these follow-ups run;
      // still commit so leave-arena triggers and "left the arena this turn"
      // counts (Glory Plate) observe LKI. Non-token destroy also emits these
      // after the GY move — objectIsInZone is not required for observation.
      if (event.bindings.resultingEvent === true) {
        return { state };
      }
      return moveForZoneEvent(state, event.data) ? { state } : null;
    case "put-into-graveyard":
      // This is an observation emitted after the primary destroy/discard move.
      // The primary reducer has already relocated the object, so accepting the
      // resulting event must not attempt to move the stale LKI a second time.
      if (event.bindings.resultingEvent === true) {
        return { state };
      }
      return moveForZoneEvent(state, event.data) ? { state } : null;
    default: {
      const _exhaustive: never = event;
      void _exhaustive;
      return null;
    }
  }
}
