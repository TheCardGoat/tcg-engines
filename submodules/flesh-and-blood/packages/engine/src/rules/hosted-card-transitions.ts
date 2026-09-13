import { basePropertiesOf } from "../cards.ts";
import { fabObjectInstanceId, fabPlayerId, type FabObjectInstanceId } from "../game/identity.ts";
import {
  planFabHostDeparture,
  planFabTransformTopology,
  type FabTransformDestination,
} from "../game/hosted-cards.ts";
import type { FabMatchState } from "../state.ts";
import type { FabObjectSnapshot } from "./events.ts";
import { nextEventId } from "./reducers/shared.ts";
import { buildFabRulesView, findObjectZone } from "./state-rules-view.ts";
import { snapshotObject } from "./snapshots.ts";
import { resetFabActiveFace } from "../game/active-face.ts";

function topLevelIds(state: Readonly<FabMatchState>): Set<string> {
  return new Set(
    Object.values(state.containers.zonesByPlayerId).flatMap((zones) =>
      Object.entries(zones).flatMap(([zone, ids]) =>
        zone === "under" || zone === "soul" ? [] : ids,
      ),
    ),
  );
}

/**
 * Apply a fully validated transform topology as one reducer-draft transition.
 * Every source snapshot is captured before any mutation, so partial transforms
 * and order-dependent LKI are impossible.
 */
export function attachFabTransformSources(input: {
  readonly state: FabMatchState;
  readonly sourceIds: readonly [FabObjectInstanceId, ...FabObjectInstanceId[]];
  readonly destination: FabTransformDestination;
}): boolean {
  const { state } = input;
  const topLevelObjectIds = topLevelIds(state);
  let plan;
  try {
    plan = planFabTransformTopology({
      topology: state.containers.subcardsByHostId,
      context: { objectIds: new Set(Object.keys(state.objects)), topLevelObjectIds },
      sourceIds: input.sourceIds,
      destination: input.destination,
    });
  } catch {
    return false;
  }
  const view = buildFabRulesView(state);
  const snapshots = plan.newSubcardIds.map((instanceId) => {
    const zone = findObjectZone(state, instanceId);
    if (!zone || zone.zone === "under") return null;
    return snapshotObject(
      state,
      instanceId,
      zone.playerId ?? state.objects[instanceId]!.ownerId,
      zone.zone,
      view,
    );
  });
  if (snapshots.some((snapshot) => snapshot === null)) return false;
  const host = state.objects[input.destination.hostId];
  if (!host) return false;

  for (const snapshot of snapshots as FabObjectSnapshot[]) {
    const object = state.objects[snapshot.instanceId];
    const zone = findObjectZone(state, snapshot.instanceId);
    if (!object || !zone || zone.playerId === null) return false;
    const container = state.containers.zonesByPlayerId[zone.playerId]?.[zone.zone];
    const index = container?.indexOf(snapshot.instanceId) ?? -1;
    if (!container || index < 0) return false;
    container.splice(index, 1);
    const nextIncarnation = ++state.counters.objectIncarnation;
    const lkiId =
      `lki:${snapshot.capturedAt}:${snapshot.ref.instanceId}:${snapshot.ref.incarnation}` as const;
    if (!state.lkiArena[lkiId]) {
      state.lkiArena[lkiId] = {
        objectKind: object.objectKind,
        baseSource: object.baseSource,
        ref: { ...snapshot.ref, instanceId: fabObjectInstanceId(snapshot.ref.instanceId) },
        canonicalId: object.canonicalId,
        ownerId: object.ownerId,
        controllerId: snapshot.controllerId === null ? null : fabPlayerId(snapshot.controllerId),
        zone: snapshot.zoneRef,
        base: snapshot.base,
        copyable: snapshot.copyable,
        baseNumeric: snapshot.baseNumeric,
        current: snapshot.current,
        counters: snapshot.counterRecords,
        markers: snapshot.markers,
        appliedEffectIds: snapshot.appliedEffectIds,
      };
    }
    state.objects[snapshot.instanceId] = {
      ...object,
      incarnation: nextIncarnation,
      visibility: host.visibility,
      activeFace: resetFabActiveFace(state.cardDefinitions[object.canonicalId]!, object.activeFace),
      cardPropertyState: { kind: "whole-card" },
      declarationFacts: [],
      counters: [],
      markers: [],
      history: {
        moves: [
          ...object.history.moves,
          {
            from: zone,
            to: { playerId: null, zone: "under" },
            eventId: nextEventId(state),
            turnNumber: state.turnNumber,
            combatNumber: state.players[object.ownerId]?.history.combatChain.combatNumber ?? null,
            chainLinkNumber:
              state.players[object.ownerId]?.history.chainLink.chainLinkNumber ?? null,
            lki: lkiId,
          },
        ],
      },
    };
  }
  state.containers.subcardsByHostId = Object.fromEntries(
    Object.entries(plan.topology).map(([hostId, ids]) => [hostId, ids.map(fabObjectInstanceId)]),
  );
  return true;
}

/**
 * Execute CR 3.0.14e when a top-card ceases. Ordinary cards reset into their
 * owners' graveyards; token descendants cease. The complete plan is validated
 * before any mutation.
 */
export function clearFabHostedDescendants(
  state: FabMatchState,
  hostId: FabObjectInstanceId,
): boolean {
  let plan;
  try {
    plan = planFabHostDeparture({
      topology: state.containers.subcardsByHostId,
      context: {
        objectIds: new Set(Object.keys(state.objects)),
        topLevelObjectIds: topLevelIds(state),
      },
      hostId,
      hostRemainsSameObject: false,
    });
  } catch {
    return false;
  }
  if (plan.kind !== "clear") return false;
  const records = plan.clearSubcardIds.map((instanceId) => {
    const object = state.objects[instanceId];
    if (!object) return null;
    const definition = state.cardDefinitions[object.canonicalId];
    if (!definition) return null;
    return { instanceId, object, definition };
  });
  if (records.some((record) => record === null)) return false;
  for (const { instanceId, object, definition } of records.filter(
    (record): record is NonNullable<typeof record> => record !== null,
  )) {
    const isToken = object.objectKind === "created-token";
    if (isToken) {
      delete state.objects[instanceId];
      continue;
    }
    const base =
      object.baseSource.kind === "frozen-copy"
        ? object.baseSource.copyable
        : basePropertiesOf(definition, object.cardPropertyState);
    const lkiId = `lki:host-clear:${instanceId}:${object.incarnation}` as const;
    state.lkiArena[lkiId] = {
      objectKind: object.objectKind,
      baseSource: object.baseSource,
      ref: { instanceId: object.instanceId, incarnation: object.incarnation },
      canonicalId: object.canonicalId,
      ownerId: object.ownerId,
      controllerId: null,
      zone: { playerId: null, zone: "under" },
      base,
      copyable: base,
      baseNumeric: base.numeric,
      current: base,
      counters: object.counters,
      markers: object.markers,
      appliedEffectIds: [],
    };
    const incarnation = ++state.counters.objectIncarnation;
    state.containers.zonesByPlayerId[object.ownerId]!.graveyard.push(instanceId);
    state.objects[instanceId] = {
      ...object,
      incarnation,
      visibility: "public",
      activeFace: resetFabActiveFace(definition, object.activeFace),
      cardPropertyState: { kind: "whole-card" },
      declarationFacts: [],
      counters: [],
      markers: [],
      history: {
        moves: [
          ...object.history.moves,
          {
            from: { playerId: null, zone: "under" },
            to: { playerId: object.ownerId, zone: "graveyard" },
            eventId: nextEventId(state),
            turnNumber: state.turnNumber,
            combatNumber: state.players[object.ownerId]?.history.combatChain.combatNumber ?? null,
            chainLinkNumber:
              state.players[object.ownerId]?.history.chainLink.chainLinkNumber ?? null,
            lki: lkiId,
          },
        ],
      },
    };
  }
  state.containers.subcardsByHostId = Object.fromEntries(
    Object.entries(plan.topology).map(([id, ids]) => [id, [...ids]]),
  );
  return true;
}
