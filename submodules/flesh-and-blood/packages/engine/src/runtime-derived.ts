import { FAB_ZONE_KINDS, type FabZoneKind, type FabZoneRef } from "./game/zones.ts";
import type { FabPlayerId } from "./game/identity.ts";

interface FabLocationState {
  readonly playerIds: readonly FabPlayerId[];
  readonly containers: {
    readonly zonesByPlayerId: Readonly<
      Record<string, Readonly<Record<FabZoneKind, readonly string[]>>>
    >;
    readonly subcardsByHostId: Readonly<Record<string, readonly string[]>>;
  };
  readonly counters?: { readonly event: number };
}

export interface FabRuntimeDerived {
  readonly builtAtEventCounter: number | null;
  readonly objectLocations: ReadonlyMap<string, FabZoneRef>;
}

const derivedByState = new WeakMap<object, FabRuntimeDerived>();

export function invalidateFabRuntimeDerived(state: object): void {
  derivedByState.delete(state);
}

/** Rebuilt on restore/new COW generations and never serialized. */
export function getFabRuntimeDerived(state: FabLocationState): FabRuntimeDerived {
  const eventCounter = state.counters?.event ?? null;
  const cached = derivedByState.get(state as object);
  if (cached?.builtAtEventCounter === eventCounter) return cached;

  const objectLocations = new Map<string, FabZoneRef>();
  for (const playerId of state.playerIds) {
    const zones = state.containers.zonesByPlayerId[playerId];
    if (!zones) continue;
    for (const zone of FAB_ZONE_KINDS) {
      for (const instanceId of zones[zone]) {
        if (objectLocations.has(instanceId)) {
          throw new Error(`FAB object ${instanceId} is present in multiple zones`);
        }
        objectLocations.set(instanceId, { playerId, zone });
      }
    }
  }
  const soulHostIds = new Set<string>([
    ...state.playerIds.map((playerId) => `soul:${playerId}`),
    ...state.playerIds.flatMap(
      (playerId) => state.containers.zonesByPlayerId[playerId]?.heroZone ?? [],
    ),
  ]);
  for (const [hostId, subcardIds] of Object.entries(state.containers.subcardsByHostId)) {
    // Soul is persisted through the same ordered host topology, but remains an
    // operational zone. Its cards therefore keep their top-level soul location.
    if (soulHostIds.has(hostId)) continue;
    for (const instanceId of subcardIds) {
      if (objectLocations.has(instanceId)) {
        throw new Error(`FAB sub-card ${instanceId} also has top-level container membership`);
      }
      objectLocations.set(instanceId, { playerId: null, zone: "under" });
    }
  }
  const derived = { builtAtEventCounter: eventCounter, objectLocations };
  derivedByState.set(state as object, derived);
  return derived;
}
