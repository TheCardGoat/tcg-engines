import type { GrandArchiveZone } from "@tcg/grand-archive-types";
import { grandArchiveDecisionId, grandArchiveEventId } from "../game/identity.ts";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../game/identity.ts";
import type {
  GrandArchiveCommittedEvent,
  GrandArchiveProposedEvent,
  GrandArchiveReplacementCandidate,
  GrandArchiveTransactionResult,
} from "./events.ts";
import type {
  GrandArchiveCardInstance,
  GrandArchiveMatchState,
  GrandArchivePendingTrigger,
  GrandArchiveQueuedReplacementEvent,
  GrandArchiveReplacementContinuation,
  GrandArchiveStackItem,
} from "../game/model.ts";
import { grandArchiveOpportunityIsSuppressed } from "../procedures/game-flow/opportunity.ts";
import {
  applyGrandArchivePaymentReferenceSubstitutions,
  applyGrandArchiveReferenceSubstitutions,
  applyGrandArchiveStackItemReferenceSubstitutions,
} from "./reference-substitution.ts";
import { GRAND_ARCHIVE_PRIVATE_ZONES } from "../game/zones.ts";

type ReplacementCollector = (
  state: GrandArchiveMatchState,
  event: GrandArchiveProposedEvent,
) => readonly GrandArchiveReplacementCandidate[];

type EventPreparer = (
  state: GrandArchiveMatchState,
  event: GrandArchiveProposedEvent,
) => GrandArchiveProposedEvent | undefined;

export interface GrandArchiveTransactionKernelOptions {
  /** Applies non-replacement rules before an event enters replacement processing. */
  readonly prepareEvent?: EventPreparer;
  readonly collectReplacements?: ReplacementCollector;
  readonly chooseReplacement?: (
    candidates: readonly GrandArchiveReplacementCandidate[],
    state: GrandArchiveMatchState,
    event: GrandArchiveProposedEvent,
  ) => GrandArchiveReplacementCandidate | undefined;
  readonly maximumReplacementDepth?: number;
  /**
   * Bounds all queue work in one transaction, including events expanded by
   * replacement effects. Depth alone cannot contain a branching replacement
   * graph whose breadth grows exponentially.
   */
  readonly maximumTransactionSteps?: number;
}

export class GrandArchiveTransactionRefused extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "GrandArchiveTransactionRefused";
  }
}

function assertNever(value: never): never {
  throw new Error(`Unhandled event variant: ${JSON.stringify(value)}`);
}

function withDurableStackItemCause(
  event: GrandArchiveProposedEvent,
  item: GrandArchiveStackItem | undefined,
): GrandArchiveProposedEvent {
  if (!item || event.cause?.kind !== "stack-item") return event;
  return {
    ...event,
    cause: {
      ...event.cause,
      stackItemKind: item.kind,
      controllerId: item.controllerId,
      ...(item.kind === "activated-ability" || item.kind === "triggered-ability"
        ? { abilityId: item.ability.id }
        : {}),
    },
  };
}

function removeFromZone(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  zone: GrandArchiveZone,
  objectId: GrandArchiveObjectId,
) {
  const playerZones = state.zones[playerId];
  if (!playerZones) throw new GrandArchiveTransactionRefused(`Unknown player ${playerId}`);
  return {
    ...state.zones,
    [playerId]: {
      ...playerZones,
      [zone]: playerZones[zone].filter((candidate) => candidate !== objectId),
    },
  };
}

function addToZone(
  zones: GrandArchiveMatchState["zones"],
  playerId: GrandArchivePlayerId,
  zone: GrandArchiveZone,
  objectId: GrandArchiveObjectId,
  placement: "top" | "bottom" | "unordered" = "unordered",
) {
  const playerZones = zones[playerId];
  if (!playerZones) throw new GrandArchiveTransactionRefused(`Unknown player ${playerId}`);
  const current = playerZones[zone];
  const next = placement === "top" ? [objectId, ...current] : [...current, objectId];
  return {
    ...zones,
    [playerId]: { ...playerZones, [zone]: next },
  };
}

function defaultFacingAfterMove(
  from: GrandArchiveZone,
  to: GrandArchiveZone,
  current: "face-up" | "face-down",
): "face-up" | "face-down" {
  const fromIsPrivate = (GRAND_ARCHIVE_PRIVATE_ZONES as readonly GrandArchiveZone[]).includes(from);
  const toIsPrivate = (GRAND_ARCHIVE_PRIVATE_ZONES as readonly GrandArchiveZone[]).includes(to);
  if (fromIsPrivate === toIsPrivate) return current;
  return toIsPrivate ? "face-down" : "face-up";
}

const GRAND_ARCHIVE_OBJECT_SPECIFIC_ZONES = [
  "loaded",
  "inner-lineage",
  "intent",
] as const satisfies readonly GrandArchiveZone[];

const GRAND_ARCHIVE_PLAYER_OWNED_ZONES = [
  "main-deck",
  "material-deck",
  "hand",
  "memory",
  "graveyard",
  "banishment",
  "pantheon",
] as const satisfies readonly GrandArchiveZone[];

function isGrandArchiveObjectSpecificZone(
  zone: GrandArchiveZone,
): zone is (typeof GRAND_ARCHIVE_OBJECT_SPECIFIC_ZONES)[number] {
  return (GRAND_ARCHIVE_OBJECT_SPECIFIC_ZONES as readonly GrandArchiveZone[]).includes(zone);
}

function isGrandArchivePlayerOwnedZone(
  zone: GrandArchiveZone,
): zone is (typeof GRAND_ARCHIVE_PLAYER_OWNED_ZONES)[number] {
  return (GRAND_ARCHIVE_PLAYER_OWNED_ZONES as readonly GrandArchiveZone[]).includes(zone);
}

function assertValidPlayerOwnedZoneController(
  object: Pick<GrandArchiveCardInstance, "ownerId" | "baseControllerId" | "controllerId">,
  zone: GrandArchiveZone,
  newControllerId?: GrandArchivePlayerId,
): void {
  if (!isGrandArchivePlayerOwnedZone(zone)) return;
  const controllerId = newControllerId ?? object.ownerId;
  if (controllerId !== object.ownerId) {
    throw new GrandArchiveTransactionRefused(`Card entering ${zone} must return to its owner`);
  }
}

function assertValidObjectSpecificZoneHost(
  state: GrandArchiveMatchState,
  objectId: GrandArchiveObjectId,
  zone: GrandArchiveZone,
  hostId: GrandArchiveObjectId | undefined,
): void {
  if (!isGrandArchiveObjectSpecificZone(zone)) return;
  if (!hostId || hostId === objectId) {
    throw new GrandArchiveTransactionRefused(
      `Card entering ${zone} requires another object as host`,
    );
  }
  const host = state.objects[hostId];
  if (!host || host.zone !== "field") {
    throw new GrandArchiveTransactionRefused(`Card entering ${zone} requires a field host`);
  }
}

function assertLegalSameZoneReposition(
  event: Extract<
    GrandArchiveCommittedEvent,
    {
      readonly type: "object-moved";
    }
  >,
): void {
  if (event.placement === undefined || event.placement === "unordered") return;
  if (event.to === "effects-stack") {
    throw new GrandArchiveTransactionRefused("The Effects Stack order cannot be changed");
  }
  if (
    event.to === "main-deck" &&
    event.effectSpecified !== true &&
    event.cause?.kind !== "rule" &&
    event.cause?.kind !== "stack-item"
  ) {
    throw new GrandArchiveTransactionRefused(
      "The Main Deck order can only be changed by a rule or effect",
    );
  }
}

export function reduceGrandArchiveEvent(
  state: GrandArchiveMatchState,
  event: GrandArchiveCommittedEvent,
): GrandArchiveMatchState {
  const nextVersion = event.stateVersion;
  switch (event.type) {
    case "object-created": {
      if (state.objects[event.object.id]) {
        throw new GrandArchiveTransactionRefused(`Object already exists: ${event.object.id}`);
      }
      assertValidObjectSpecificZoneHost(
        state,
        event.object.id,
        event.object.zone,
        event.object.hostId,
      );
      if (
        isGrandArchivePlayerOwnedZone(event.object.zone) &&
        (event.object.baseControllerId !== event.object.ownerId ||
          event.object.controllerId !== event.object.ownerId)
      ) {
        throw new GrandArchiveTransactionRefused(
          `Card created in ${event.object.zone} must be controlled by its owner`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        nextObjectOrdinal: state.nextObjectOrdinal + 1,
        objects: { ...state.objects, [event.object.id]: event.object },
        zones: addToZone(
          state.zones,
          event.object.ownerId,
          event.object.zone,
          event.object.id,
          event.placement,
        ),
      };
    }
    case "tokens-summoned": {
      const ids = new Set<GrandArchiveObjectId>();
      for (const object of event.objects) {
        if (
          state.objects[object.id] ||
          ids.has(object.id) ||
          !object.isToken ||
          object.zone !== "field" ||
          object.controllerId !== event.playerId
        ) {
          throw new GrandArchiveTransactionRefused("Invalid simultaneous token summon");
        }
        ids.add(object.id);
      }
      let zones = state.zones;
      const objects: Record<GrandArchiveObjectId, GrandArchiveCardInstance> = {
        ...state.objects,
      };
      for (const object of event.objects) {
        objects[object.id] = object;
        zones = addToZone(zones, object.ownerId, "field", object.id);
      }
      return {
        ...state,
        stateVersion: nextVersion,
        nextObjectOrdinal: state.nextObjectOrdinal + event.objects.length,
        objects,
        zones,
      };
    }
    case "object-ceased": {
      const object = state.objects[event.objectId];
      if (!object || (!object.isToken && !object.copy) || object.zone !== event.from) {
        throw new GrandArchiveTransactionRefused(
          "Only a token or non-field copy outside the field can cease to exist",
        );
      }
      const objects: Record<GrandArchiveObjectId, GrandArchiveCardInstance> = {
        ...state.objects,
      };
      delete objects[event.objectId];
      return {
        ...state,
        stateVersion: nextVersion,
        objects,
        zones: removeFromZone(state, object.ownerId, event.from, event.objectId),
      };
    }
    case "object-removed-from-game": {
      const current = state.objects[event.object.id];
      if (
        !current ||
        current.zone !== event.object.zone ||
        current.ownerId !== event.object.ownerId
      ) {
        throw new GrandArchiveTransactionRefused("Removed object no longer matches game state");
      }
      const objects: Record<GrandArchiveObjectId, GrandArchiveCardInstance> = {
        ...state.objects,
      };
      delete objects[current.id];
      const trackedCharacteristics = { ...state.trackedCharacteristics };
      delete trackedCharacteristics[current.id];
      return {
        ...state,
        stateVersion: nextVersion,
        objects,
        zones: removeFromZone(state, current.ownerId, current.zone, current.id),
        trackedCharacteristics,
      };
    }
    case "object-moved": {
      const object = state.objects[event.objectId];
      if (!object || object.zone !== event.from) {
        throw new GrandArchiveTransactionRefused(
          `Cannot move ${event.objectId} from ${event.from}`,
        );
      }
      // Game Zones 5.1: moving a card to the zone it already occupies is not
      // a zone change. It may reposition an ordered-zone card, but it must not
      // create a new incarnation or apply any entry/reset information.
      if (event.from === event.to) {
        assertValidPlayerOwnedZoneController(object, event.to, event.newControllerId);
        assertLegalSameZoneReposition(event);
        const current = state.zones[object.ownerId][event.from];
        const index = current.indexOf(event.objectId);
        if (index < 0) {
          throw new GrandArchiveTransactionRefused(
            `Cannot reposition ${event.objectId} within ${event.from}`,
          );
        }
        const withoutObject = current.filter((candidate) => candidate !== event.objectId);
        const reordered =
          event.placement === "top"
            ? [event.objectId, ...withoutObject]
            : event.placement === "bottom"
              ? [...withoutObject, event.objectId]
              : current;
        const repositioned =
          event.revealAtEndOfGame && !object.revealAtEndOfGame
            ? { ...object, revealAtEndOfGame: true as const }
            : object;
        return {
          ...state,
          stateVersion: nextVersion,
          objects: { ...state.objects, [object.id]: repositioned },
          zones: {
            ...state.zones,
            [object.ownerId]: {
              ...state.zones[object.ownerId],
              [event.from]: reordered,
            },
          },
        };
      }
      assertValidObjectSpecificZoneHost(state, object.id, event.to, event.hostId);
      assertValidPlayerOwnedZoneController(object, event.to, event.newControllerId);
      const zonesWithoutObject = removeFromZone(state, object.ownerId, event.from, event.objectId);
      const entryFacing =
        event.entryFacing ?? defaultFacingAfterMove(event.from, event.to, object.facing);
      const moved = {
        ...object,
        ...(object.copy && event.to === "intent"
          ? { copy: { ...object.copy, expires: "end-of-combat" as const } }
          : {}),
        zone: event.to,
        baseControllerId: event.newControllerId ?? object.ownerId,
        controllerId: event.newControllerId ?? object.ownerId,
        ...(event.hostId ? { hostId: event.hostId } : { hostId: undefined }),
        ...(event.to === "banishment" && event.banishedBy
          ? { banishedBy: event.banishedBy }
          : { banishedBy: undefined }),
        activeDefinitionId: event.to === "field" ? object.activeDefinitionId : undefined,
        nameOverride: event.to === "field" ? object.nameOverride : undefined,
        // A face-down double-faced card is never transformed. An explicit
        // transformed field entry is otherwise distinct from a transformation:
        // the zone change already created the new object incarnation.
        face:
          event.to === "field" && entryFacing === "face-up"
            ? (event.entryFace ?? object.face)
            : "default",
        incarnation: object.incarnation + 1,
        objectVersion: object.objectVersion + 1,
        facing: entryFacing,
        ...(object.revealAtEndOfGame || event.revealAtEndOfGame
          ? { revealAtEndOfGame: true as const }
          : {}),
        states: new Set(event.entryStates ?? []),
        activationStates: new Set(event.entryActivationStates ?? []),
        activationPayment: event.entryActivationPayment ?? [],
        activationBindings: event.entryActivationBindings ?? {},
        activationVariables: event.entryActivationVariables ?? {},
        cascadeCounts: {},
        counters: event.initialCounters ?? {},
        damage: 0,
      };
      const trackedCharacteristics = { ...state.trackedCharacteristics };
      const tracked = trackedCharacteristics[object.id];
      delete trackedCharacteristics[object.id];
      if (
        event.from === "effects-stack" &&
        event.to === "field" &&
        tracked?.incarnation === object.incarnation
      ) {
        trackedCharacteristics[object.id] = {
          incarnation: object.incarnation + 1,
          values: tracked.values,
        };
      }
      const stack: readonly GrandArchiveStackItem[] = state.stack.map((item) =>
        item.sourceId === object.id &&
        item.sourceLkiEventId === undefined &&
        item.sourceIncarnation === object.incarnation
          ? {
              ...item,
              sourceIncarnation: moved.incarnation,
              sourceLkiEventId: event.eventId,
            }
          : item,
      );
      const pendingTriggers: readonly GrandArchivePendingTrigger[] = state.pendingTriggers.map(
        (trigger) =>
          trigger.sourceId === object.id &&
          trigger.sourceLkiEventId === undefined &&
          trigger.sourceIncarnation === object.incarnation
            ? {
                ...trigger,
                sourceIncarnation: moved.incarnation,
                sourceLkiEventId: event.eventId,
              }
            : trigger,
      );
      const resolution =
        state.resolution?.sourceId === object.id &&
        state.resolution.sourceLkiEventId === undefined &&
        state.resolution.sourceIncarnation === object.incarnation
          ? {
              ...state.resolution,
              sourceIncarnation: moved.incarnation,
              sourceLkiEventId: event.eventId,
            }
          : state.resolution;
      return {
        ...state,
        stateVersion: nextVersion,
        zones: addToZone(
          zonesWithoutObject,
          object.ownerId,
          event.to,
          event.objectId,
          event.placement,
        ),
        objects: { ...state.objects, [event.objectId]: moved },
        stack,
        pendingTriggers,
        resolution,
        trackedCharacteristics,
        combat:
          state.combat &&
          event.to === "intent" &&
          event.hostId === state.combat.attackerId &&
          !state.combat.intentIds.includes(event.objectId)
            ? { ...state.combat, intentIds: [...state.combat.intentIds, event.objectId] }
            : state.combat,
      };
    }
    case "object-state-changed": {
      const object = state.objects[event.objectId];
      if (!object) throw new GrandArchiveTransactionRefused(`Unknown object ${event.objectId}`);
      const states = new Set(object.states);
      if (event.value) states.add(event.state);
      else states.delete(event.state);
      return {
        ...state,
        stateVersion: nextVersion,
        objects: { ...state.objects, [event.objectId]: { ...object, states } },
      };
    }
    case "object-activation-state-changed": {
      const object = state.objects[event.objectId];
      if (!object) throw new GrandArchiveTransactionRefused(`Unknown object ${event.objectId}`);
      const activationStates = new Set(object.activationStates);
      if (event.value) activationStates.add(event.state);
      else activationStates.delete(event.state);
      return {
        ...state,
        stateVersion: nextVersion,
        objects: {
          ...state.objects,
          [event.objectId]: { ...object, activationStates },
        },
      };
    }
    case "object-facing-changed": {
      const object = state.objects[event.objectId];
      if (!object) throw new GrandArchiveTransactionRefused(`Unknown object ${event.objectId}`);
      return {
        ...state,
        stateVersion: nextVersion,
        objects: {
          ...state.objects,
          [object.id]: {
            ...object,
            facing: event.facing,
            // Double-Faced Cards rule 8: a face-down card is not transformed.
            ...(event.facing === "face-down" ? { face: "default" as const } : {}),
            ...(object.revealAtEndOfGame || event.revealAtEndOfGame
              ? { revealAtEndOfGame: true as const }
              : {}),
            objectVersion: object.objectVersion + 1,
          },
        },
      };
    }
    case "object-characteristic-tracked": {
      const object = state.objects[event.objectId];
      if (!object) throw new GrandArchiveTransactionRefused(`Unknown object ${event.objectId}`);
      const existing = state.trackedCharacteristics[object.id];
      const values =
        existing?.incarnation === object.incarnation
          ? { ...existing.values, [event.key]: event.values }
          : { [event.key]: event.values };
      return {
        ...state,
        stateVersion: nextVersion,
        trackedCharacteristics: {
          ...state.trackedCharacteristics,
          [object.id]: { incarnation: object.incarnation, values },
        },
      };
    }
    case "card-revealed":
    case "cards-looked-at":
    case "cards-searched":
    case "keyword-action-performed":
    case "object-reference-substituted":
      return { ...state, stateVersion: nextVersion };
    case "cascade-advanced": {
      const object = state.objects[event.objectId];
      if (!object) throw new GrandArchiveTransactionRefused(`Unknown object ${event.objectId}`);
      const previous = object.cascadeCounts[event.abilityId] ?? 0;
      if (event.count !== previous + 1) {
        throw new GrandArchiveTransactionRefused(
          `Cascade must advance ${event.abilityId} from ${previous} to ${previous + 1}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        objects: {
          ...state.objects,
          [object.id]: {
            ...object,
            cascadeCounts: { ...object.cascadeCounts, [event.abilityId]: event.count },
          },
        },
      };
    }
    case "zone-reordered": {
      if (
        event.zone === "main-deck" &&
        event.cause?.kind !== "rule" &&
        event.cause?.kind !== "stack-item"
      ) {
        throw new GrandArchiveTransactionRefused(
          "The Main Deck can only be reordered by a rule or effect",
        );
      }
      const current = state.zones[event.playerId][event.zone];
      if (
        current.length !== event.objectIds.length ||
        new Set(event.objectIds).size !== event.objectIds.length ||
        event.objectIds.some((objectId) => !current.includes(objectId))
      ) {
        throw new GrandArchiveTransactionRefused("Zone reorder must be an exact permutation");
      }
      return {
        ...state,
        stateVersion: nextVersion,
        zones: {
          ...state.zones,
          [event.playerId]: {
            ...state.zones[event.playerId],
            [event.zone]: event.objectIds,
          },
        },
      };
    }
    case "player-state-changed": {
      const player = state.players[event.playerId];
      if (!player) throw new GrandArchiveTransactionRefused(`Unknown player ${event.playerId}`);
      return {
        ...state,
        stateVersion: nextVersion,
        players: {
          ...state.players,
          [event.playerId]: {
            ...player,
            states: { ...player.states, [event.state]: event.value },
          },
        },
      };
    }
    case "mastery-changed": {
      const player = state.players[event.playerId];
      if (!player) throw new GrandArchiveTransactionRefused(`Unknown player ${event.playerId}`);
      const mastery = event.mastery.trim();
      if (!mastery) throw new GrandArchiveTransactionRefused("A mastery must have a name");
      return {
        ...state,
        stateVersion: nextVersion,
        players: {
          ...state.players,
          [event.playerId]: {
            ...player,
            mastery: { name: mastery, timestamp: nextVersion, counters: {} },
          },
        },
      };
    }
    case "mastery-counter-changed": {
      const player = state.players[event.playerId];
      if (!player) throw new GrandArchiveTransactionRefused(`Unknown player ${event.playerId}`);
      if (!player.mastery || player.mastery.name !== event.mastery) {
        throw new GrandArchiveTransactionRefused(
          `${event.playerId} does not have the ${event.mastery} mastery`,
        );
      }
      if (!Number.isSafeInteger(event.delta)) {
        throw new GrandArchiveTransactionRefused("Mastery counter delta must be an integer");
      }
      const current = player.mastery.counters[event.counter] ?? 0;
      const next = current + event.delta;
      if (next < 0) {
        throw new GrandArchiveTransactionRefused("Mastery counters cannot become negative");
      }
      const counters = { ...player.mastery.counters };
      if (next === 0) delete counters[event.counter];
      else counters[event.counter] = next;
      return {
        ...state,
        stateVersion: nextVersion,
        players: {
          ...state.players,
          [event.playerId]: {
            ...player,
            mastery: { ...player.mastery, counters },
          },
        },
      };
    }
    case "game-state-changed":
      return {
        ...state,
        stateVersion: nextVersion,
        gameStates: { ...state.gameStates, [event.state]: event.value },
      };
    case "counter-changed": {
      const object = state.objects[event.objectId];
      if (!object) throw new GrandArchiveTransactionRefused(`Unknown object ${event.objectId}`);
      if (event.counter === "damage") {
        const damage = object.damage + event.delta;
        if (damage < 0) {
          throw new GrandArchiveTransactionRefused("Damage counters cannot become negative");
        }
        return {
          ...state,
          stateVersion: nextVersion,
          objects: {
            ...state.objects,
            [event.objectId]: { ...object, damage },
          },
        };
      }
      const counters = { ...object.counters };
      let delta = event.delta;
      if (delta > 0 && (event.counter === "buff" || event.counter === "debuff")) {
        const opposite = event.counter === "buff" ? "debuff" : "buff";
        const cancelled = Math.min(counters[opposite] ?? 0, delta);
        counters[opposite] = (counters[opposite] ?? 0) - cancelled;
        delta -= cancelled;
      }
      const value = (counters[event.counter] ?? 0) + delta;
      if (value < 0) throw new GrandArchiveTransactionRefused("A counter cannot become negative");
      counters[event.counter] = value;
      return {
        ...state,
        stateVersion: nextVersion,
        objects: {
          ...state.objects,
          [event.objectId]: {
            ...object,
            counters,
          },
        },
      };
    }
    case "damage-marked": {
      if (event.amount <= 0) throw new GrandArchiveTransactionRefused("Damage must be positive");
      const object = state.objects[event.objectId];
      if (!object) throw new GrandArchiveTransactionRefused(`Unknown object ${event.objectId}`);
      if (event.asDurabilityLoss) {
        const durability = object.counters.durability ?? 0;
        const removed = event.durabilityRemoved ?? Math.min(durability, event.amount);
        if (removed < 0 || removed > durability || removed > event.amount) {
          throw new GrandArchiveTransactionRefused("Invalid durability removed by damage");
        }
        return {
          ...state,
          stateVersion: nextVersion,
          objects: {
            ...state.objects,
            [event.objectId]: {
              ...object,
              counters: { ...object.counters, durability: durability - removed },
            },
          },
        };
      }
      return {
        ...state,
        stateVersion: nextVersion,
        objects: {
          ...state.objects,
          [event.objectId]: { ...object, damage: object.damage + event.amount },
        },
      };
    }
    case "damage-cleared": {
      const object = state.objects[event.objectId];
      if (!object) throw new GrandArchiveTransactionRefused(`Unknown object ${event.objectId}`);
      return {
        ...state,
        stateVersion: nextVersion,
        objects: { ...state.objects, [event.objectId]: { ...object, damage: 0 } },
      };
    }
    case "damage-removed": {
      if (event.amount < 0) throw new GrandArchiveTransactionRefused("Recovery must be positive");
      const object = state.objects[event.objectId];
      if (!object) throw new GrandArchiveTransactionRefused(`Unknown object ${event.objectId}`);
      return {
        ...state,
        stateVersion: nextVersion,
        objects: {
          ...state.objects,
          [event.objectId]: { ...object, damage: Math.max(0, object.damage - event.amount) },
        },
      };
    }
    case "damage-prevented":
      if (event.amount < 0)
        throw new GrandArchiveTransactionRefused("Prevented damage must be positive");
      return { ...state, stateVersion: nextVersion };
    case "object-controller-changed": {
      const object = state.objects[event.objectId];
      if (!object) throw new GrandArchiveTransactionRefused(`Unknown object ${event.objectId}`);
      if (!state.players[event.controllerId]) {
        throw new GrandArchiveTransactionRefused(`Unknown controller ${event.controllerId}`);
      }
      return {
        ...state,
        stateVersion: nextVersion,
        objects: {
          ...state.objects,
          [event.objectId]: {
            ...object,
            ...(!event.continuousDerivation ? { baseControllerId: event.controllerId } : {}),
            controllerId: event.controllerId,
          },
        },
      };
    }
    case "object-transformed": {
      const object = state.objects[event.objectId];
      if (!object) throw new GrandArchiveTransactionRefused(`Unknown object ${event.objectId}`);
      if (
        object.zone !== "field" ||
        object.facing !== "face-up" ||
        object.copy !== undefined ||
        object.activeDefinitionId !== undefined
      ) {
        throw new GrandArchiveTransactionRefused(
          "Only an eligible face-up field object can transform",
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        objects: {
          ...state.objects,
          [event.objectId]: {
            ...object,
            face: object.face === "default" ? "transformed" : "default",
            objectVersion: object.objectVersion + 1,
          },
        },
      };
    }
    case "object-became-copy": {
      const object = state.objects[event.objectId];
      if (!object) throw new GrandArchiveTransactionRefused("Unknown copy object");
      return {
        ...state,
        stateVersion: nextVersion,
        objects: {
          ...state.objects,
          [object.id]: {
            ...object,
            activeDefinitionId: event.copiedDefinitionId,
            face: event.copiedFace,
            nameOverride: event.nameOverride,
            objectVersion: object.objectVersion + 1,
          },
        },
      };
    }
    case "champion-leveled-up": {
      const champion = state.objects[event.championId];
      const card = state.objects[event.cardId];
      if (!champion || champion.zone !== "field") {
        throw new GrandArchiveTransactionRefused("Champion to level is not on the field");
      }
      if (
        !card ||
        (card.zone !== "effects-stack" && card.zone !== "material-deck") ||
        champion.controllerId !== card.controllerId
      ) {
        throw new GrandArchiveTransactionRefused("Level card is not resolving for this champion");
      }
      const withoutCard = removeFromZone(state, card.ownerId, card.zone, card.id);
      const trackedCharacteristics = { ...state.trackedCharacteristics };
      const tracked = trackedCharacteristics[card.id];
      delete trackedCharacteristics[card.id];
      if (card.zone === "effects-stack" && tracked?.incarnation === card.incarnation) {
        trackedCharacteristics[card.id] = {
          incarnation: card.incarnation + 1,
          values: tracked.values,
        };
      }
      return {
        ...state,
        stateVersion: nextVersion,
        zones: addToZone(withoutCard, card.ownerId, "inner-lineage", card.id),
        trackedCharacteristics,
        objects: {
          ...state.objects,
          [champion.id]: {
            ...champion,
            activeDefinitionId: card.definitionId,
            activationStates: card.activationStates,
            activationPayment: card.activationPayment,
            activationBindings: card.activationBindings,
            activationVariables: card.activationVariables,
            objectVersion: champion.objectVersion + 1,
          },
          [card.id]: {
            ...card,
            zone: "inner-lineage",
            hostId: champion.id,
            controllerId: champion.controllerId,
            facing: "face-up",
            incarnation: card.incarnation + 1,
            objectVersion: card.objectVersion + 1,
          },
        },
      };
    }
    case "champion-deleveled": {
      const champion = state.objects[event.championId];
      const card = state.objects[event.cardId];
      if (!champion || champion.zone !== "field") {
        throw new GrandArchiveTransactionRefused("Champion to delevel is not on the field");
      }
      if (!card || card.zone !== "inner-lineage" || card.hostId !== champion.id) {
        throw new GrandArchiveTransactionRefused("Delevel card is not in this lineage");
      }
      const lineage = state.zones[card.ownerId]["inner-lineage"].filter(
        (objectId) => state.objects[objectId]?.hostId === champion.id,
      );
      if (lineage.at(-1) !== card.id) {
        throw new GrandArchiveTransactionRefused("Only the top lineage card can be removed");
      }
      const previousCardId = lineage.at(-2);
      const previousDefinitionId = previousCardId
        ? state.objects[previousCardId]?.definitionId
        : champion.definitionId;
      if (!previousDefinitionId) {
        throw new GrandArchiveTransactionRefused("Champion lineage has no previous definition");
      }
      const withoutCard = removeFromZone(state, card.ownerId, "inner-lineage", card.id);
      const trackedCharacteristics = { ...state.trackedCharacteristics };
      delete trackedCharacteristics[card.id];
      return {
        ...state,
        stateVersion: nextVersion,
        zones: addToZone(withoutCard, card.ownerId, "material-deck", card.id),
        trackedCharacteristics,
        objects: {
          ...state.objects,
          [champion.id]: {
            ...champion,
            activeDefinitionId: previousDefinitionId,
            objectVersion: champion.objectVersion + 1,
          },
          [card.id]: {
            ...card,
            zone: "material-deck",
            hostId: undefined,
            controllerId: card.ownerId,
            facing: "face-down",
            incarnation: card.incarnation + 1,
            objectVersion: card.objectVersion + 1,
          },
        },
      };
    }
    case "random-state-changed":
      if (event.random.cursor < state.random.cursor) {
        throw new GrandArchiveTransactionRefused("Random cursor cannot move backwards");
      }
      return { ...state, stateVersion: nextVersion, random: event.random };
    case "combat-started":
      if (state.combat)
        throw new GrandArchiveTransactionRefused("A combat phase is already active");
      return {
        ...state,
        stateVersion: nextVersion,
        combat: event.combat,
        turn: { ...state.turn, phase: "combat" },
      };
    case "combat-step-changed":
      if (!state.combat) throw new GrandArchiveTransactionRefused("No combat phase is active");
      return {
        ...state,
        stateVersion: nextVersion,
        combat: {
          ...state.combat,
          step: event.step,
          ...(event.retaliatorIds ? { retaliatorIds: event.retaliatorIds } : {}),
        },
      };
    case "combat-retaliators-ordered": {
      if (!state.combat || state.combat.step !== "damage") {
        throw new GrandArchiveTransactionRefused(
          "Retaliation damage can only be ordered in damage",
        );
      }
      if (
        event.retaliatorIds.length !== state.combat.retaliatorIds.length ||
        new Set(event.retaliatorIds).size !== event.retaliatorIds.length ||
        event.retaliatorIds.some((objectId) => !state.combat?.retaliatorIds.includes(objectId))
      ) {
        throw new GrandArchiveTransactionRefused(
          "Retaliation damage order must preserve every declared retaliator exactly once",
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        combat: {
          ...state.combat,
          retaliatorIds: event.retaliatorIds,
          retaliationOrderConfirmed: true,
        },
      };
    }
    case "combat-defender-redirected": {
      if (!state.combat || state.combat.step === "end") {
        throw new GrandArchiveTransactionRefused("No redirectable combat is active");
      }
      if (
        !state.combat.targetIds.includes(event.previousDefenderId) ||
        state.combat.targetIds.includes(event.newDefenderId)
      ) {
        throw new GrandArchiveTransactionRefused("Combat redirection has invalid defenders");
      }
      const newDefender = state.objects[event.newDefenderId];
      if (!newDefender || newDefender.zone !== "field") {
        throw new GrandArchiveTransactionRefused("New combat defender is not on the field");
      }
      const targetIds = state.combat.targetIds.map((objectId) =>
        objectId === event.previousDefenderId ? event.newDefenderId : objectId,
      );
      return {
        ...state,
        stateVersion: nextVersion,
        combat: {
          ...state.combat,
          targetIds,
          defendingPlayerIds: [
            ...new Set(
              targetIds.flatMap((objectId) => {
                const object = state.objects[objectId];
                return object ? [object.controllerId] : [];
              }),
            ),
          ],
        },
      };
    }
    case "combat-ended":
      if (!state.combat) throw new GrandArchiveTransactionRefused("No combat phase is active");
      return {
        ...state,
        stateVersion: nextVersion,
        combat: null,
        turn: { ...state.turn, phase: "main" },
      };
    case "phase-end-requested":
      if (state.pendingTermination) {
        throw new GrandArchiveTransactionRefused("A phase or turn end is already pending");
      }
      if (state.turn.phase !== event.phase) {
        throw new GrandArchiveTransactionRefused(
          `Cannot end ${event.phase} during ${state.turn.phase}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        pendingTermination: { kind: "phase", phase: event.phase },
      };
    case "turn-end-requested":
      if (state.pendingTermination) {
        throw new GrandArchiveTransactionRefused("A phase or turn end is already pending");
      }
      return { ...state, stateVersion: nextVersion, pendingTermination: { kind: "turn" } };
    case "termination-cleared":
      if (!state.pendingTermination) {
        throw new GrandArchiveTransactionRefused("No phase or turn end is pending");
      }
      return { ...state, stateVersion: nextVersion, pendingTermination: null };
    case "continuous-effect-created":
      if (state.continuousEffects.some((effect) => effect.id === event.effect.id)) {
        throw new GrandArchiveTransactionRefused(
          `Continuous effect already exists: ${event.effect.id}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        continuousEffects: [...state.continuousEffects, event.effect],
        nextContinuousOrdinal: state.nextContinuousOrdinal + 1,
      };
    case "continuous-effect-expired":
      return {
        ...state,
        stateVersion: nextVersion,
        continuousEffects: state.continuousEffects.filter((effect) => effect.id !== event.effectId),
      };
    case "replacement-effect-created":
      if (state.replacementEffects.some((effect) => effect.id === event.replacement.id)) {
        throw new GrandArchiveTransactionRefused(
          `Replacement effect already exists: ${event.replacement.id}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        replacementEffects: [...state.replacementEffects, event.replacement],
        nextReplacementOrdinal: state.nextReplacementOrdinal + 1,
      };
    case "replacement-follow-up-created":
      return {
        ...state,
        stateVersion: nextVersion,
        replacementFollowUps: [...state.replacementFollowUps, event.followUp],
      };
    case "replacement-follow-up-consumed":
      if (state.replacementFollowUps.length === 0) {
        throw new GrandArchiveTransactionRefused("No replacement follow-up is pending");
      }
      return {
        ...state,
        stateVersion: nextVersion,
        replacementFollowUps: state.replacementFollowUps.slice(1),
      };
    case "replacement-pre-commit-created":
      if (state.replacementPreCommit) {
        throw new GrandArchiveTransactionRefused("Another pre-commit replacement is pending");
      }
      return {
        ...state,
        stateVersion: nextVersion,
        replacementPreCommit: event.pending,
      };
    case "replacement-pre-commit-started":
      if (!state.replacementPreCommit || state.replacementPreCommit.status !== "pending") {
        throw new GrandArchiveTransactionRefused("Pre-commit replacement cannot start");
      }
      return {
        ...state,
        stateVersion: nextVersion,
        replacementPreCommit: { ...state.replacementPreCommit, status: "resolving" },
      };
    case "replacement-pre-commit-cleared":
      if (!state.replacementPreCommit) {
        throw new GrandArchiveTransactionRefused("No pre-commit replacement is pending");
      }
      return { ...state, stateVersion: nextVersion, replacementPreCommit: null };
    case "replacement-pre-commit-critical-declined": {
      const pending = state.replacementPreCommit;
      if (!pending || pending.followUp.kind !== "critical") {
        throw new GrandArchiveTransactionRefused("No Critical replacement is pending");
      }
      return {
        ...state,
        stateVersion: nextVersion,
        replacementPreCommit: {
          ...pending,
          followUp: {
            ...pending.followUp,
            declinedOpponentIds: [...pending.followUp.declinedOpponentIds, event.playerId],
          },
        },
      };
    }
    case "replacement-pre-commit-critical-paid":
    case "replacement-pre-commit-critical-doubled": {
      const pending = state.replacementPreCommit;
      if (!pending || pending.followUp.kind !== "critical") {
        throw new GrandArchiveTransactionRefused("No Critical replacement is pending");
      }
      const [first, ...remaining] = pending.continuation.queue;
      if (!first || first.event.type !== "damage-marked") {
        throw new GrandArchiveTransactionRefused("Critical replacement lost its damage event");
      }
      const damageEvent =
        event.type === "replacement-pre-commit-critical-paid"
          ? {
              ...first.event,
              criticalDiscardIds: [...(first.event.criticalDiscardIds ?? []), ...event.objectIds],
            }
          : {
              ...first.event,
              amount: first.event.amount * 2,
              criticalDoubled: true as const,
            };
      return {
        ...state,
        stateVersion: nextVersion,
        replacementPreCommit: {
          ...pending,
          continuation: {
            ...pending.continuation,
            queue: [{ ...first, event: damageEvent }, ...remaining],
          },
        },
      };
    }
    case "replacement-capacity-consumed": {
      const replacement = state.replacementEffects.find(
        (candidate) => candidate.id === event.replacementId,
      );
      if (!replacement?.capacity || !Number.isSafeInteger(event.amount) || event.amount <= 0) {
        throw new GrandArchiveTransactionRefused("Replacement capacity consumption is invalid");
      }
      const capacity = replacement.capacity;
      const updatedCapacity =
        capacity.scope === "replacement-instance"
          ? (() => {
              if (event.scope !== "replacement-instance" || event.amount > capacity.remaining) {
                throw new GrandArchiveTransactionRefused(
                  "Replacement capacity exceeds the remaining shared shield",
                );
              }
              return { ...capacity, remaining: capacity.remaining - event.amount };
            })()
          : (() => {
              if (event.scope !== "per-object") {
                throw new GrandArchiveTransactionRefused(
                  "Per-object replacement capacity requires an object",
                );
              }
              const object = state.objects[event.objectId];
              if (!object || object.incarnation !== event.objectIncarnation) {
                throw new GrandArchiveTransactionRefused(
                  "Per-object replacement capacity refers to a stale object",
                );
              }
              const tracked = capacity.remainingByObject[event.objectId];
              const remaining =
                tracked?.incarnation === object.incarnation ? tracked.remaining : capacity.initial;
              if (event.amount > remaining) {
                throw new GrandArchiveTransactionRefused(
                  "Replacement capacity exceeds the remaining object shield",
                );
              }
              return {
                ...capacity,
                remainingByObject: {
                  ...capacity.remainingByObject,
                  [event.objectId]: {
                    incarnation: object.incarnation,
                    remaining: remaining - event.amount,
                  },
                },
              };
            })();
      return {
        ...state,
        stateVersion: nextVersion,
        replacementEffects: state.replacementEffects.map((candidate) =>
          candidate.id === replacement.id ? { ...candidate, capacity: updatedCapacity } : candidate,
        ),
      };
    }
    case "replacement-effect-consumed":
    case "replacement-effect-expired":
      if (!state.replacementEffects.some((effect) => effect.id === event.replacementId)) {
        throw new GrandArchiveTransactionRefused(
          `Replacement effect does not exist: ${event.replacementId}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        replacementEffects: state.replacementEffects.filter(
          (effect) => effect.id !== event.replacementId,
        ),
      };
    case "replacement-limit-used":
      if (event.usageKey.length === 0) {
        throw new GrandArchiveTransactionRefused("Replacement limit usage key is empty");
      }
      return {
        ...state,
        stateVersion: nextVersion,
        replacementLimitUsages: {
          ...state.replacementLimitUsages,
          [event.usageKey]: (state.replacementLimitUsages[event.usageKey] ?? 0) + 1,
        },
      };
    case "rule-modification-created":
      if (
        state.ruleModifications.some((modification) => modification.id === event.modification.id)
      ) {
        throw new GrandArchiveTransactionRefused(
          `Rule modification already exists: ${event.modification.id}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        ruleModifications: [...state.ruleModifications, event.modification],
        nextRuleModificationOrdinal: state.nextRuleModificationOrdinal + 1,
      };
    case "rule-modification-expired":
      return {
        ...state,
        stateVersion: nextVersion,
        ruleModifications: state.ruleModifications.filter(
          (modification) => modification.id !== event.modificationId,
        ),
      };
    case "pending-trigger-added":
      if (state.pendingTriggers.some((trigger) => trigger.id === event.trigger.id)) {
        throw new GrandArchiveTransactionRefused(
          `Pending trigger already exists: ${event.trigger.id}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        pendingTriggers: [...state.pendingTriggers, event.trigger],
        nextPendingTriggerOrdinal: state.nextPendingTriggerOrdinal + 1,
      };
    case "pending-trigger-removed":
      if (!state.pendingTriggers.some((trigger) => trigger.id === event.triggerId)) {
        throw new GrandArchiveTransactionRefused(
          `Pending trigger does not exist: ${event.triggerId}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        pendingTriggers: state.pendingTriggers.filter((trigger) => trigger.id !== event.triggerId),
      };
    case "pending-trigger-batch-ordered": {
      const group = state.pendingTriggers.filter(
        (trigger) =>
          trigger.batchId === event.batchId && trigger.controllerId === event.controllerId,
      );
      if (
        group.length < 2 ||
        event.triggerIds.length !== group.length ||
        new Set(event.triggerIds).size !== event.triggerIds.length ||
        event.triggerIds.some((id) => !group.some((trigger) => trigger.id === id))
      ) {
        throw new GrandArchiveTransactionRefused(
          "Trigger ordering is not a permutation of the batch",
        );
      }
      const ordered = event.triggerIds.map((id) => {
        const trigger = group.find((candidate) => candidate.id === id);
        if (!trigger) throw new GrandArchiveTransactionRefused(`Unknown pending trigger ${id}`);
        return { ...trigger, orderingConfirmed: true };
      });
      let orderIndex = 0;
      return {
        ...state,
        stateVersion: nextVersion,
        pendingTriggers: state.pendingTriggers.map((trigger) =>
          trigger.batchId === event.batchId && trigger.controllerId === event.controllerId
            ? ordered[orderIndex++]!
            : trigger,
        ),
      };
    }
    case "reflexive-trigger-generated":
      if (state.generatedTriggers.some((trigger) => trigger.id === event.trigger.id)) {
        throw new GrandArchiveTransactionRefused(
          `Reflexive trigger already exists: ${event.trigger.id}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        generatedTriggers: [...state.generatedTriggers, event.trigger],
        nextGeneratedTriggerOrdinal: state.nextGeneratedTriggerOrdinal + 1,
      };
    case "reflexive-trigger-consumed":
      if (!state.generatedTriggers.some((trigger) => trigger.id === event.triggerId)) {
        throw new GrandArchiveTransactionRefused(
          `Reflexive trigger does not exist: ${event.triggerId}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        generatedTriggers: state.generatedTriggers.filter(
          (trigger) => trigger.id !== event.triggerId,
        ),
      };
    case "delayed-trigger-created":
      if (state.delayedTriggers.some((trigger) => trigger.id === event.trigger.id)) {
        throw new GrandArchiveTransactionRefused(
          `Delayed trigger already exists: ${event.trigger.id}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        delayedTriggers: [...state.delayedTriggers, event.trigger],
        nextDelayedTriggerOrdinal: state.nextDelayedTriggerOrdinal + 1,
      };
    case "delayed-trigger-consumed": {
      const trigger = state.delayedTriggers.find((candidate) => candidate.id === event.triggerId);
      if (!trigger || trigger.remainingUses === undefined || trigger.remainingUses <= 1) {
        throw new GrandArchiveTransactionRefused(
          `Delayed trigger cannot consume another use: ${event.triggerId}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        delayedTriggers: state.delayedTriggers.map((candidate) =>
          candidate.id === event.triggerId
            ? { ...candidate, remainingUses: trigger.remainingUses! - 1 }
            : candidate,
        ),
      };
    }
    case "delayed-trigger-removed":
      if (!state.delayedTriggers.some((trigger) => trigger.id === event.triggerId)) {
        throw new GrandArchiveTransactionRefused(
          `Delayed trigger does not exist: ${event.triggerId}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        delayedTriggers: state.delayedTriggers.filter((trigger) => trigger.id !== event.triggerId),
      };
    case "stack-item-added":
      return {
        ...state,
        stateVersion: nextVersion,
        stack: [...state.stack, event.item],
        nextStackOrdinal: state.nextStackOrdinal + 1,
      };
    case "stack-item-deferred": {
      const resolution = state.resolution;
      if (!resolution) {
        return {
          ...state,
          stateVersion: nextVersion,
          nextStackOrdinal: state.nextStackOrdinal + 1,
        };
      }
      return {
        ...state,
        stateVersion: nextVersion,
        nextStackOrdinal: state.nextStackOrdinal + 1,
        resolution: {
          ...resolution,
          deferredStackItems: [...resolution.deferredStackItems, event.item],
        },
      };
    }
    case "stack-item-after-resolution-scheduled": {
      const targetIndex = state.stack.findIndex((item) => item.id === event.targetStackItemId);
      if (targetIndex < 0) {
        throw new GrandArchiveTransactionRefused(
          `After-resolution target does not exist: ${event.targetStackItemId}`,
        );
      }
      if (
        state.stack.some(
          (item) =>
            item.id === event.item.id ||
            item.scheduledAfterResolutionItems?.some((scheduled) => scheduled.id === event.item.id),
        )
      ) {
        throw new GrandArchiveTransactionRefused(
          `Scheduled stack item already exists: ${event.item.id}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        nextStackOrdinal: state.nextStackOrdinal + 1,
        stack: state.stack.map((item, index) =>
          index === targetIndex
            ? {
                ...item,
                scheduledAfterResolutionItems: [
                  ...(item.scheduledAfterResolutionItems ?? []),
                  event.item,
                ],
              }
            : item,
        ),
      };
    }
    case "deferred-stack-item-promoted":
      return {
        ...state,
        stateVersion: nextVersion,
        stack: [...state.stack, event.item],
      };
    case "stack-item-retargeted": {
      if (!state.stack.some((item) => item.id === event.item.id)) {
        throw new GrandArchiveTransactionRefused(
          `Retargeted stack item does not exist: ${event.item.id}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        stack: state.stack.map((item) => (item.id === event.item.id ? event.item : item)),
      };
    }
    case "stack-item-targets-invalidated": {
      if (!state.stack.some((item) => item.id === event.item.id)) {
        throw new GrandArchiveTransactionRefused(
          `Target-invalidated stack item does not exist: ${event.item.id}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        stack: state.stack.map((item) => (item.id === event.item.id ? event.item : item)),
      };
    }
    case "stack-item-fizzled": {
      const existing = state.stack.find((item) => item.id === event.item.id);
      if (!existing) {
        throw new GrandArchiveTransactionRefused(
          `Fizzled stack item does not exist: ${event.item.id}`,
        );
      }
      if (state.resolution?.stackItemId === event.item.id) {
        throw new GrandArchiveTransactionRefused(
          `A resolving stack item cannot fizzle from a state-based check: ${event.item.id}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        stack: state.stack.filter((item) => item.id !== event.item.id),
      };
    }
    case "stack-item-negated": {
      const existing = state.stack.find((item) => item.id === event.item.id);
      if (!existing) {
        throw new GrandArchiveTransactionRefused(
          `Negated stack item does not exist: ${event.item.id}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        stack: state.stack.filter((item) => item.id !== event.item.id),
      };
    }
    case "effect-resolution-suspended":
      if (state.resolution && state.resolution.stackItemId !== event.resolution.stackItemId) {
        throw new GrandArchiveTransactionRefused("Another effect resolution is already suspended");
      }
      if (!state.stack.some((item) => item.id === event.resolution.stackItemId)) {
        throw new GrandArchiveTransactionRefused(
          `Resolution stack item does not exist: ${event.resolution.stackItemId}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        resolution: event.resolution,
      };
    case "effect-resolution-cleared":
      if (state.resolution && state.resolution.stackItemId !== event.stackItemId) {
        throw new GrandArchiveTransactionRefused(
          `Cannot clear resolution for another stack item: ${event.stackItemId}`,
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        resolution: null,
      };
    case "stack-item-removed": {
      const top = state.stack.at(-1);
      if (!top || top.id !== event.itemId) {
        throw new GrandArchiveTransactionRefused("Only the top Effects Stack item can resolve");
      }
      return { ...state, stateVersion: nextVersion, stack: state.stack.slice(0, -1) };
    }
    case "opportunity-opened":
      if (grandArchiveOpportunityIsSuppressed(state)) {
        throw new GrandArchiveTransactionRefused(
          "Interdiction prevents Opportunity from being opened",
        );
      }
      return { ...state, stateVersion: nextVersion, opportunity: event.window };
    case "opportunity-passed": {
      const window = state.opportunity;
      if (!window || window.holderId !== event.playerId) {
        throw new GrandArchiveTransactionRefused("Only the Opportunity holder may pass");
      }
      return {
        ...state,
        stateVersion: nextVersion,
        opportunity: event.nextPlayerId
          ? {
              ...window,
              holderId: event.nextPlayerId,
              passedPlayerIds: [...window.passedPlayerIds, event.playerId],
            }
          : window,
      };
    }
    case "opportunity-closed":
      return { ...state, stateVersion: nextVersion, opportunity: null };
    case "pregame-player-advanced": {
      const pregame = state.pregame;
      if (
        state.status !== "pregame" ||
        !pregame ||
        pregame.stage !== "player-actions" ||
        event.playerIndex !== pregame.currentPlayerIndex + 1 ||
        state.turnOrder[event.playerIndex] !== event.playerId
      ) {
        throw new GrandArchiveTransactionRefused("Invalid pre-game player progression");
      }
      return {
        ...state,
        stateVersion: nextVersion,
        pregame: { ...pregame, currentPlayerIndex: event.playerIndex },
      };
    }
    case "pregame-starting-cards-entered": {
      const pregame = state.pregame;
      if (
        state.status !== "pregame" ||
        !pregame ||
        pregame.stage !== "player-actions" ||
        pregame.currentPlayerIndex !== state.turnOrder.length - 1
      ) {
        throw new GrandArchiveTransactionRefused("Pre-game actions are not complete");
      }
      return {
        ...state,
        stateVersion: nextVersion,
        pregame: { ...pregame, stage: "starting-champions" },
      };
    }
    case "pregame-completed":
      if (state.status !== "pregame" || state.pregame?.stage !== "starting-champions") {
        throw new GrandArchiveTransactionRefused("Starting-card resolution is not complete");
      }
      return {
        ...state,
        stateVersion: nextVersion,
        status: "playing",
        pregame: null,
        turn: { ...state.turn, phase: "main" },
      };
    case "boon-gained": {
      const object = state.objects[event.objectId];
      if (
        !object ||
        object.ownerId !== event.playerId ||
        object.zone !== "pantheon" ||
        object.facing !== "face-up"
      ) {
        throw new GrandArchiveTransactionRefused("Only a resolved face-up boon can be gained");
      }
      return { ...state, stateVersion: nextVersion };
    }
    case "phase-changed":
      return {
        ...state,
        stateVersion: nextVersion,
        turn: {
          ...state.turn,
          phase: event.phase,
          materializeKind:
            event.phase === "materialize" ? (event.materializeKind ?? "regular") : null,
          materializeChoicePending: event.phase === "materialize",
          recollectionPending: event.phase === "recollection",
        },
      };
    case "cards-recollected": {
      if (state.turn.phase !== "recollection" || !state.turn.recollectionPending) {
        throw new GrandArchiveTransactionRefused("No recollection turn-based action is pending");
      }
      if (event.playerId !== state.turn.playerId) {
        throw new GrandArchiveTransactionRefused("Only the turn player can recollect");
      }
      if (
        new Set(event.objectIds).size !== event.objectIds.length ||
        event.objectIds.some((objectId) => state.objects[objectId]?.zone !== "hand")
      ) {
        throw new GrandArchiveTransactionRefused(
          "Recollected cards must be distinct cards moved to hand by this transaction",
        );
      }
      return {
        ...state,
        stateVersion: nextVersion,
        turn: { ...state.turn, recollectionPending: false },
      };
    }
    case "phase-skip-added":
    case "phase-skip-consumed": {
      const player = state.players[event.playerId];
      if (!player) throw new GrandArchiveTransactionRefused(`Unknown player ${event.playerId}`);
      const current = player.phaseSkips[event.phase] ?? 0;
      if (event.type === "phase-skip-consumed" && current < 1) {
        throw new GrandArchiveTransactionRefused(
          `No ${event.phase} phase skip is available for ${event.playerId}`,
        );
      }
      const next = current + (event.type === "phase-skip-added" ? 1 : -1);
      return {
        ...state,
        stateVersion: nextVersion,
        players: {
          ...state.players,
          [event.playerId]: {
            ...player,
            phaseSkips: { ...player.phaseSkips, [event.phase]: next },
          },
        },
      };
    }
    case "materialization-choice-consumed":
      if (state.turn.phase !== "materialize" || !state.turn.materializeChoicePending) {
        throw new GrandArchiveTransactionRefused("No materialization choice is available");
      }
      return {
        ...state,
        stateVersion: nextVersion,
        turn: { ...state.turn, materializeChoicePending: false },
      };
    case "turn-started":
      return {
        ...state,
        stateVersion: nextVersion,
        turn: {
          number: event.turnNumber,
          playerId: event.playerId,
          phase: "wake-up",
          materializeKind: null,
          materializeChoicePending: false,
          recollectionPending: false,
          drawPending: false,
          cleanupPending: false,
          attackAttempts: [],
        },
      };
    case "turn-cleanup-pending-changed":
      return {
        ...state,
        stateVersion: nextVersion,
        turn: {
          ...state.turn,
          ...(event.value
            ? {
                phase: "end" as const,
                materializeKind: null,
                materializeChoicePending: false,
                recollectionPending: false,
                drawPending: false,
              }
            : {}),
          cleanupPending: event.value,
        },
      };
    case "attack-declaration-attempted":
      return {
        ...state,
        stateVersion: nextVersion,
        turn: {
          ...state.turn,
          attackAttempts: [
            ...state.turn.attackAttempts,
            {
              attackerId: event.attackerId,
              targetIds: event.targetIds,
              declared: event.declared,
            },
          ],
        },
      };
    case "player-first-turn-completed": {
      const player = state.players[event.playerId];
      if (!player) throw new GrandArchiveTransactionRefused(`Unknown player ${event.playerId}`);
      return {
        ...state,
        stateVersion: nextVersion,
        players: {
          ...state.players,
          [event.playerId]: { ...player, hasTakenFirstTurn: true },
        },
      };
    }
    case "player-lost": {
      const player = state.players[event.playerId];
      if (!player) throw new GrandArchiveTransactionRefused(`Unknown player ${event.playerId}`);
      return {
        ...state,
        stateVersion: nextVersion,
        players: {
          ...state.players,
          [event.playerId]: {
            ...player,
            lost: true,
            conceded: event.reason === "concession" || player.conceded,
          },
        },
      };
    }
    case "game-outcome-declared": {
      const current = state.pendingGameOutcome;
      const pendingGameOutcome =
        current?.kind === "draw" || event.outcome.kind === "draw"
          ? ({ kind: "draw" } as const)
          : {
              kind: "wins" as const,
              playerIds: [
                ...new Set([
                  ...(current?.kind === "wins" ? current.playerIds : []),
                  ...event.outcome.playerIds,
                ]),
              ],
            };
      return { ...state, stateVersion: nextVersion, pendingGameOutcome };
    }
    case "game-outcome-cleared":
      if (!state.pendingGameOutcome) {
        throw new GrandArchiveTransactionRefused("No game outcome is pending");
      }
      return { ...state, stateVersion: nextVersion, pendingGameOutcome: null };
    case "match-finished":
      return {
        ...state,
        stateVersion: nextVersion,
        status: "finished",
        winnerIds: event.winnerIds,
        pendingGameOutcome: null,
        opportunity: null,
        decision: null,
      };
    case "decision-created":
      if (state.decision) throw new GrandArchiveTransactionRefused("A decision is already pending");
      return {
        ...state,
        stateVersion: nextVersion,
        decision: event.decision,
        nextDecisionOrdinal: state.nextDecisionOrdinal + 1,
      };
    case "decision-cleared":
      if (!state.decision || state.decision.id !== event.decisionId) {
        throw new GrandArchiveTransactionRefused("Decision is not pending");
      }
      return { ...state, stateVersion: nextVersion, decision: null };
    default:
      return assertNever(event);
  }
}

function defaultReplacementChoice(candidates: readonly GrandArchiveReplacementCandidate[]) {
  return candidates.length === 1 && !candidates[0]?.optionalPlayerId ? candidates[0] : undefined;
}

export type GrandArchiveReplacementDecisionAnswer =
  | { readonly kind: "order"; readonly candidateId: string }
  | { readonly kind: "optional"; readonly candidateId: string; readonly apply: boolean };

interface GrandArchiveRuntimeQueuedEvent {
  readonly event: GrandArchiveProposedEvent;
  readonly depth: number;
  readonly appliedReplacementIds: ReadonlySet<string>;
}

function criticalDiscardEvents(
  state: GrandArchiveMatchState,
  event: Extract<GrandArchiveProposedEvent, { readonly type: "damage-marked" }>,
): readonly GrandArchiveProposedEvent[] {
  return (event.criticalDiscardIds ?? []).map((objectId) => {
    const object = state.objects[objectId];
    if (!object || object.zone !== "hand") {
      throw new GrandArchiveTransactionRefused(
        "A card committed to Critical is no longer in its owner's hand",
      );
    }
    return {
      type: "object-moved" as const,
      objectId,
      from: "hand" as const,
      to: "graveyard" as const,
      actorId: object.ownerId,
      cause: { kind: "rule" as const, rule: "critical-discard" },
    };
  });
}

function carryCriticalDiscards(
  state: GrandArchiveMatchState,
  original: GrandArchiveProposedEvent,
  events: readonly [GrandArchiveProposedEvent, ...GrandArchiveProposedEvent[]],
): readonly [GrandArchiveProposedEvent, ...GrandArchiveProposedEvent[]] {
  if (original.type !== "damage-marked" || !original.criticalDiscardIds?.length) return events;
  const damageIndex = events.findIndex((event) => event.type === "damage-marked");
  if (damageIndex < 0) {
    const discards = criticalDiscardEvents(state, original);
    return [discards[0]!, ...discards.slice(1), ...events];
  }
  const carry = (event: GrandArchiveProposedEvent, index: number): GrandArchiveProposedEvent =>
    index === damageIndex && event.type === "damage-marked"
      ? {
          ...event,
          criticalDiscardIds: original.criticalDiscardIds,
          ...(original.criticalDoubled ? { criticalDoubled: true as const } : {}),
        }
      : event;
  return [carry(events[0], 0), ...events.slice(1).map((event, index) => carry(event, index + 1))];
}

export class GrandArchiveTransactionKernel {
  readonly #prepareEvent: EventPreparer;
  readonly #collectReplacements: ReplacementCollector;
  readonly #chooseReplacement: NonNullable<
    GrandArchiveTransactionKernelOptions["chooseReplacement"]
  >;
  readonly #maximumReplacementDepth: number;
  readonly #maximumTransactionSteps: number;

  public constructor(options: GrandArchiveTransactionKernelOptions = {}) {
    this.#prepareEvent = options.prepareEvent ?? ((_state, event) => event);
    this.#collectReplacements = options.collectReplacements ?? (() => []);
    this.#chooseReplacement = options.chooseReplacement ?? defaultReplacementChoice;
    this.#maximumReplacementDepth = options.maximumReplacementDepth ?? 32;
    this.#maximumTransactionSteps = options.maximumTransactionSteps ?? 1_000;
    if (!Number.isSafeInteger(this.#maximumTransactionSteps) || this.#maximumTransactionSteps < 1) {
      throw new RangeError("maximumTransactionSteps must be a positive safe integer");
    }
  }

  public transact(
    state: GrandArchiveMatchState,
    proposedEvents: readonly GrandArchiveProposedEvent[],
  ): { readonly state: GrandArchiveMatchState; readonly result: GrandArchiveTransactionResult } {
    return this.#transactQueue(
      state,
      proposedEvents.map((event) => ({
        event,
        depth: 0,
        appliedReplacementIds: new Set<string>(),
      })),
      state.eventHistory.length,
    );
  }

  public resumeReplacement(
    state: GrandArchiveMatchState,
    continuation: GrandArchiveReplacementContinuation,
    answer: GrandArchiveReplacementDecisionAnswer,
  ): { readonly state: GrandArchiveMatchState; readonly result: GrandArchiveTransactionResult } {
    const queue = continuation.queue.map(
      (entry): GrandArchiveRuntimeQueuedEvent => ({
        event: entry.event,
        depth: entry.depth,
        appliedReplacementIds: new Set(entry.appliedReplacementIds),
      }),
    );
    return this.#transactQueue(state, queue, continuation.startedEventHistoryIndex, answer);
  }

  public resumeReplacementPreCommit(
    state: GrandArchiveMatchState,
    continuation: GrandArchiveReplacementContinuation,
  ): { readonly state: GrandArchiveMatchState; readonly result: GrandArchiveTransactionResult } {
    const queue = continuation.queue.map(
      (entry): GrandArchiveRuntimeQueuedEvent => ({
        event: entry.event,
        depth: entry.depth,
        appliedReplacementIds: new Set(entry.appliedReplacementIds),
      }),
    );
    return this.#transactQueue(state, queue, continuation.startedEventHistoryIndex);
  }

  #transactQueue(
    state: GrandArchiveMatchState,
    initialQueue: readonly GrandArchiveRuntimeQueuedEvent[],
    startedEventHistoryIndex: number,
    answer?: GrandArchiveReplacementDecisionAnswer,
  ): { readonly state: GrandArchiveMatchState; readonly result: GrandArchiveTransactionResult } {
    // A transaction owns one private history buffer. Reducers continue to see every event
    // committed earlier in this transaction without copying the full match history per event.
    const eventHistory: GrandArchiveCommittedEvent[] = [...state.eventHistory];
    let draft: GrandArchiveMatchState = { ...state, eventHistory };
    const committed: GrandArchiveCommittedEvent[] = [];
    const queue = [...initialQueue];
    let pendingAnswer = answer;
    let processedSteps = 0;
    while (queue.length > 0) {
      processedSteps += 1;
      if (processedSteps > this.#maximumTransactionSteps) {
        throw new GrandArchiveTransactionRefused("Transaction processing limit exceeded");
      }
      const shifted = queue.shift();
      if (!shifted) break;
      let next: GrandArchiveRuntimeQueuedEvent = shifted;
      if (next.depth > this.#maximumReplacementDepth) {
        throw new GrandArchiveTransactionRefused("Replacement effect recursion limit exceeded");
      }
      const causedStackItemId =
        next.event.cause?.kind === "stack-item" ? next.event.cause.stackItemId : undefined;
      const causedItem = causedStackItemId
        ? (draft.stack.find((item) => item.id === causedStackItemId) ??
          state.stack.find((item) => item.id === causedStackItemId))
        : undefined;
      const durableEvent = withDurableStackItemCause(next.event, causedItem);
      if (durableEvent !== next.event) next = { ...next, event: durableEvent };
      const preparedEvent = this.#prepareEvent(draft, next.event);
      if (!preparedEvent) continue;
      if (preparedEvent !== next.event) next = { ...next, event: preparedEvent };
      const candidates = this.#collectReplacements(draft, next.event).filter(
        (candidate) => !next.appliedReplacementIds.has(candidate.id),
      );
      if (candidates.length > 0) {
        let replacement: GrandArchiveReplacementCandidate | undefined;
        if (pendingAnswer) {
          replacement = candidates.find((candidate) => candidate.id === pendingAnswer?.candidateId);
          if (!replacement) {
            throw new GrandArchiveTransactionRefused("Chosen replacement is no longer applicable");
          }
          if (pendingAnswer.kind === "order" && replacement.optionalPlayerId) {
            return this.#pauseForReplacement(
              state,
              draft,
              committed,
              eventHistory,
              [next, ...queue],
              startedEventHistoryIndex,
              "optional",
              [replacement],
              replacement.id,
            );
          }
          if (pendingAnswer.kind === "optional" && !pendingAnswer.apply) {
            const appliedReplacementIds = new Set(next.appliedReplacementIds);
            appliedReplacementIds.add(replacement.id);
            queue.unshift({ ...next, appliedReplacementIds });
            pendingAnswer = undefined;
            continue;
          }
          pendingAnswer = undefined;
        } else {
          replacement = this.#chooseReplacement(candidates, draft, next.event);
        }
        if (!replacement) {
          const mode = candidates.length === 1 ? "optional" : "order";
          const firstCandidate = candidates[0];
          if (!firstCandidate) {
            throw new GrandArchiveTransactionRefused("Replacement candidate list is empty");
          }
          const decisionCandidates: readonly [
            GrandArchiveReplacementCandidate,
            ...GrandArchiveReplacementCandidate[],
          ] = mode === "optional" ? [firstCandidate] : [firstCandidate, ...candidates.slice(1)];
          return this.#pauseForReplacement(
            state,
            draft,
            committed,
            eventHistory,
            [next, ...queue],
            startedEventHistoryIndex,
            mode,
            decisionCandidates,
            mode === "optional" ? decisionCandidates[0]!.id : undefined,
          );
        }
        if (!candidates.includes(replacement)) {
          throw new GrandArchiveTransactionRefused(
            "Replacement chooser returned a foreign candidate",
          );
        }
        const result = replacement.apply(next.event);
        if (result.kind === "prevented") {
          if (next.event.type === "damage-marked" && next.event.criticalDiscardIds?.length) {
            queue.unshift(
              ...criticalDiscardEvents(draft, next.event).map((event) => ({
                event,
                depth: next.depth + 1,
                appliedReplacementIds: new Set(next.appliedReplacementIds),
              })),
            );
          }
          continue;
        }
        if (result.kind === "resolve-before-commit") {
          const appliedReplacementIds = new Set(next.appliedReplacementIds);
          appliedReplacementIds.add(replacement.id);
          return this.#pauseForReplacementPreCommit(
            state,
            draft,
            committed,
            eventHistory,
            [...(result.resumeEvent ? [{ ...next, appliedReplacementIds }] : []), ...queue],
            startedEventHistoryIndex,
            result.followUp,
          );
        }
        if (result.kind === "replaced") {
          const appliedReplacementIds = new Set(next.appliedReplacementIds);
          appliedReplacementIds.add(replacement.id);
          const replacementEvents = carryCriticalDiscards(draft, next.event, result.events).map(
            (event): GrandArchiveProposedEvent =>
              next.event.gameEventId && !event.gameEventId
                ? { ...event, gameEventId: next.event.gameEventId }
                : event,
          );
          queue.unshift(
            ...replacementEvents.map((event) => ({
              event,
              depth: next.depth + 1,
              appliedReplacementIds,
            })),
          );
          continue;
        }
        const appliedReplacementIds = new Set(next.appliedReplacementIds);
        appliedReplacementIds.add(replacement.id);
        queue.unshift({ ...next, appliedReplacementIds });
        continue;
      }
      if (next.event.type === "damage-marked" && next.event.criticalDiscardIds?.length) {
        const { criticalDiscardIds: _criticalDiscardIds, ...damageEvent } = next.event;
        queue.unshift(
          ...criticalDiscardEvents(draft, next.event).map((event) => ({
            event,
            depth: next.depth + 1,
            appliedReplacementIds: new Set<string>(),
          })),
          { ...next, event: damageEvent },
        );
        continue;
      }
      const referenceEvents = draft.eventHistory.slice(startedEventHistoryIndex);
      if (
        next.event.type === "stack-item-added" ||
        next.event.type === "stack-item-deferred" ||
        next.event.type === "stack-item-after-resolution-scheduled"
      ) {
        next = {
          ...next,
          event: {
            ...next.event,
            item: applyGrandArchiveStackItemReferenceSubstitutions(
              next.event.item,
              referenceEvents,
            ),
          },
        };
      } else if (next.event.type === "object-moved") {
        const entryActivationBindings = next.event.entryActivationBindings
          ? applyGrandArchiveReferenceSubstitutions(
              next.event.entryActivationBindings,
              referenceEvents,
            )
          : undefined;
        const entryActivationPayment = next.event.entryActivationPayment
          ? applyGrandArchivePaymentReferenceSubstitutions(
              next.event.entryActivationPayment,
              referenceEvents,
            )
          : undefined;
        if (entryActivationBindings || entryActivationPayment) {
          next = {
            ...next,
            event: {
              ...next.event,
              ...(entryActivationBindings ? { entryActivationBindings } : {}),
              ...(entryActivationPayment ? { entryActivationPayment } : {}),
            },
          };
        }
      }
      const stateVersion = draft.stateVersion + 1;
      const activatedSourceId =
        next.event.type === "stack-item-added" &&
        next.event.item.kind === "activated-ability" &&
        next.event.item.sourceId
          ? next.event.item.sourceId
          : undefined;
      const activatedSourceIncarnation =
        activatedSourceId && next.event.type === "stack-item-added"
          ? (draft.objects[activatedSourceId]?.incarnation ?? next.event.item.sourceIncarnation)
          : undefined;
      const activatedSourceMove =
        activatedSourceId && activatedSourceIncarnation !== undefined
          ? draft.eventHistory
              .slice(startedEventHistoryIndex)
              .reverse()
              .find(
                (candidate) =>
                  candidate.type === "object-moved" &&
                  candidate.objectId === activatedSourceId &&
                  (candidate.previousObject?.incarnation ?? -1) + 1 === activatedSourceIncarnation,
              )
          : undefined;
      const enrichedEvent: GrandArchiveProposedEvent =
        next.event.type === "object-moved"
          ? {
              ...next.event,
              previousObject: draft.objects[next.event.objectId],
              previousControllerId: draft.objects[next.event.objectId]?.controllerId,
              previousActiveDefinitionId: draft.objects[next.event.objectId]?.activeDefinitionId,
              previousCascadeCounts: draft.objects[next.event.objectId]?.cascadeCounts,
              previousActivationPayment: draft.objects[next.event.objectId]?.activationPayment,
              previousActivationBindings: draft.objects[next.event.objectId]?.activationBindings,
              previousActivationVariables: draft.objects[next.event.objectId]?.activationVariables,
            }
          : next.event.type === "card-revealed"
            ? next.event.revealedBeforePrivateEntry
              ? next.event
              : {
                  ...next.event,
                  from: draft.objects[next.event.objectId]?.zone,
                }
            : next.event.type === "object-state-changed"
              ? {
                  ...next.event,
                  previousValue:
                    draft.objects[next.event.objectId]?.states.has(next.event.state) ?? false,
                }
              : next.event.type === "champion-leveled-up"
                ? {
                    ...next.event,
                    previousActiveDefinitionId:
                      draft.objects[next.event.championId]?.activeDefinitionId,
                  }
                : next.event.type === "player-state-changed"
                  ? {
                      ...next.event,
                      previousValue: draft.players[next.event.playerId]?.states[next.event.state],
                    }
                  : next.event.type === "game-state-changed"
                    ? {
                        ...next.event,
                        previousValue: draft.gameStates[next.event.state],
                      }
                    : next.event.type === "object-controller-changed"
                      ? {
                          ...next.event,
                          previousBaseControllerId:
                            draft.objects[next.event.objectId]?.baseControllerId,
                        }
                      : next.event.type === "damage-marked" && next.event.asDurabilityLoss
                        ? {
                            ...next.event,
                            durabilityRemoved: Math.min(
                              draft.objects[next.event.objectId]?.counters.durability ?? 0,
                              next.event.amount,
                            ),
                          }
                        : next.event.type === "stack-item-added" &&
                            next.event.item.kind === "activated-ability" &&
                            activatedSourceIncarnation !== undefined
                          ? {
                              ...next.event,
                              item: {
                                ...next.event.item,
                                sourceIncarnation: activatedSourceIncarnation,
                                ...(activatedSourceMove
                                  ? { sourceLkiEventId: activatedSourceMove.eventId }
                                  : {}),
                              },
                            }
                          : next.event;
      const baseEvent: GrandArchiveCommittedEvent = {
        ...enrichedEvent,
        eventId: grandArchiveEventId(`event-${draft.nextEventOrdinal + committed.length}`),
        stateVersion,
      };
      const reduced = reduceGrandArchiveEvent(draft, baseEvent);
      const primaryObjectId = "objectId" in baseEvent ? baseEvent.objectId : undefined;
      const objectSnapshot = primaryObjectId
        ? (reduced.objects[primaryObjectId] ?? draft.objects[primaryObjectId])
        : undefined;
      const event: GrandArchiveCommittedEvent = objectSnapshot
        ? { ...baseEvent, objectSnapshot }
        : baseEvent;
      draft = reduced;
      eventHistory.push(event);
      draft = { ...draft, eventHistory };
      committed.push(event);
    }
    draft = { ...draft, nextEventOrdinal: state.nextEventOrdinal + committed.length };
    return {
      state: draft,
      result: { stateVersion: draft.stateVersion, events: committed },
    };
  }

  #pauseForReplacement(
    transactionStart: GrandArchiveMatchState,
    draft: GrandArchiveMatchState,
    committed: GrandArchiveCommittedEvent[],
    eventHistory: GrandArchiveCommittedEvent[],
    queue: readonly [GrandArchiveRuntimeQueuedEvent, ...GrandArchiveRuntimeQueuedEvent[]],
    startedEventHistoryIndex: number,
    mode: "order" | "optional",
    candidates: readonly [GrandArchiveReplacementCandidate, ...GrandArchiveReplacementCandidate[]],
    selectedCandidateId?: string,
  ): { readonly state: GrandArchiveMatchState; readonly result: GrandArchiveTransactionResult } {
    const playerId =
      mode === "optional" ? candidates[0]!.optionalPlayerId : candidates[0]!.affectedPlayerId;
    if (!playerId) {
      throw new GrandArchiveTransactionRefused("Replacement decision has no controlling player");
    }
    if (
      mode === "order" &&
      candidates.some((candidate) => candidate.affectedPlayerId !== playerId)
    ) {
      throw new GrandArchiveTransactionRefused(
        "Applicable replacements do not share an affected player",
      );
    }
    const serializeQueueEntry = (
      entry: GrandArchiveRuntimeQueuedEvent,
    ): GrandArchiveQueuedReplacementEvent => ({
      event: entry.event,
      depth: entry.depth,
      appliedReplacementIds: [...entry.appliedReplacementIds],
    });
    const serializedQueue: readonly [
      GrandArchiveQueuedReplacementEvent,
      ...GrandArchiveQueuedReplacementEvent[],
    ] = [serializeQueueEntry(queue[0]), ...queue.slice(1).map(serializeQueueEntry)];
    const candidateIds: readonly [string, ...string[]] = [
      candidates[0].id,
      ...candidates.slice(1).map((candidate) => candidate.id),
    ];
    const decisionEvent: GrandArchiveProposedEvent = {
      type: "decision-created",
      decision: {
        id: grandArchiveDecisionId(`decision-${draft.nextDecisionOrdinal}`),
        kind: "choose-replacement",
        playerId,
        mode,
        candidateIds,
        continuation: {
          queue: serializedQueue,
          startedEventHistoryIndex,
          ...(selectedCandidateId ? { selectedCandidateId } : {}),
        },
        stateVersion: draft.stateVersion,
      },
      cause: { kind: "rule", rule: `${mode}-replacement-effect` },
    };
    const stateVersion = draft.stateVersion + 1;
    const event: GrandArchiveCommittedEvent = {
      ...decisionEvent,
      eventId: grandArchiveEventId(`event-${transactionStart.nextEventOrdinal + committed.length}`),
      stateVersion,
    };
    let paused = reduceGrandArchiveEvent(draft, event);
    eventHistory.push(event);
    paused = { ...paused, eventHistory };
    committed.push(event);
    paused = {
      ...paused,
      nextEventOrdinal: transactionStart.nextEventOrdinal + committed.length,
    };
    return {
      state: paused,
      result: { stateVersion: paused.stateVersion, events: committed },
    };
  }

  #pauseForReplacementPreCommit(
    transactionStart: GrandArchiveMatchState,
    draft: GrandArchiveMatchState,
    committed: GrandArchiveCommittedEvent[],
    eventHistory: GrandArchiveCommittedEvent[],
    queue: readonly GrandArchiveRuntimeQueuedEvent[],
    startedEventHistoryIndex: number,
    followUp: import("../game/model.ts").GrandArchiveReplacementPreCommitFollowUp,
  ): { readonly state: GrandArchiveMatchState; readonly result: GrandArchiveTransactionResult } {
    const serializeQueueEntry = (
      entry: GrandArchiveRuntimeQueuedEvent,
    ): GrandArchiveQueuedReplacementEvent => ({
      event: entry.event,
      depth: entry.depth,
      appliedReplacementIds: [...entry.appliedReplacementIds],
    });
    const heldEntries = queue.filter((entry) => entry.event.type !== "opportunity-opened");
    const serializedQueue = heldEntries.map(serializeQueueEntry);
    const proposed: GrandArchiveProposedEvent = {
      type: "replacement-pre-commit-created",
      pending: {
        followUp,
        continuation: { queue: serializedQueue, startedEventHistoryIndex },
        afterResolutionEvents: queue.flatMap((entry) =>
          entry.event.type === "opportunity-opened" ? [entry.event] : [],
        ),
        status: "pending",
      },
      cause: { kind: "rule", rule: "event-processing-replacement-effect" },
    };
    const event: GrandArchiveCommittedEvent = {
      ...proposed,
      eventId: grandArchiveEventId(`event-${transactionStart.nextEventOrdinal + committed.length}`),
      stateVersion: draft.stateVersion + 1,
    };
    let paused = reduceGrandArchiveEvent(draft, event);
    eventHistory.push(event);
    paused = {
      ...paused,
      eventHistory,
      nextEventOrdinal: transactionStart.nextEventOrdinal + committed.length + 1,
    };
    committed.push(event);
    return {
      state: paused,
      result: { stateVersion: paused.stateVersion, events: committed },
    };
  }
}
