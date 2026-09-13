/**
 * Card references for the fluent FAB test layer.
 *
 * - Pass a **card definition** (or canonical-id string) when exactly one
 *   matching instance exists in the resolution scope.
 * - Pass a **FabCardInstanceRef** (captured from a verb or zone query) when
 *   multiples exist. Ambiguity throws with the count and zone breakdown —
 *   this layer never picks `[0]`.
 *
 * Identity is the object record's `canonicalId` (the same identity the
 * existing harness uses via `fabCardRefId`).
 */

import type { FabMatchState, FabZoneKind } from "../state.ts";
import { fabCardRefId, type FabCardRef } from "./test-fixtures.ts";

/**
 * Stable handle to one physical card instance. The `kind` discriminator brands
 * the shape against plain card definitions, so {@link FabFluentCardRef} is a
 * proper discriminated union.
 */
export interface FabCardInstanceRef {
  readonly kind: "instance";
  readonly instanceId: string;
  readonly canonicalId: string;
  readonly ownerId: string;
}

/** Anything the fluent layer accepts as a card: definition, canonical id, or ref. */
export type FabFluentCardRef = FabCardRef | FabCardInstanceRef;

/** Optional narrowing for definition resolution (disambiguation without raw ids). */
export interface FabCardRefFilter {
  /** Limit the search to a single zone. */
  readonly zone?: FabZoneKind;
  /** Match the face-down marker (arsenal traps, cloaked equipment). */
  readonly faceDown?: boolean;
  /** Escape hatch: exact instance id. */
  readonly instanceId?: string;
}

export class FabCardRefNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FabCardRefNotFoundError";
  }
}

export class FabAmbiguousCardRefError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FabAmbiguousCardRefError";
  }
}

export function isFabCardInstanceRef(value: unknown): value is FabCardInstanceRef {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as FabCardInstanceRef).kind === "instance" &&
    typeof (value as FabCardInstanceRef).instanceId === "string"
  );
}

/** Build an instance ref from state for a known instance id. */
export function makeFabInstanceRef(
  state: FabMatchState,
  playerId: string,
  instanceId: string,
): FabCardInstanceRef {
  const record = state.objects[instanceId];
  if (!record) {
    throw new FabCardRefNotFoundError(`No card instance with id "${instanceId}" in match state.`);
  }
  return {
    kind: "instance",
    instanceId,
    canonicalId: record.canonicalId,
    ownerId: record.ownerId || playerId,
  };
}

/**
 * Owner-visible resolution scope over the 16 FAB zones. Excluded by design:
 * the **deck** (hidden from everyone, CR 3.0.3a — assert counts, not identity)
 * and the **opponent hand** (address it through the opponent's handle).
 */
const FAB_CARD_REF_SCOPE: readonly FabZoneKind[] = [
  "hand",
  "combatChain",
  "stack",
  "arena",
  "pitch",
  "graveyard",
  "banished",
  "arsenal",
  "soul",
  "head",
  "chest",
  "arms",
  "legs",
  "weapon1",
  "weapon2",
  "heroZone",
];

/**
 * Zones whose objects are visible to both players by default (CR 3.0.4a).
 * This is deliberately narrower than the owner-visible fluent-reference scope:
 * an arsenal target shorthand must not identify an object from a hand, deck,
 * arsenal, or soul.
 */
const FAB_PUBLIC_CARD_REF_SCOPE: readonly FabZoneKind[] = [
  "combatChain",
  "stack",
  "arena",
  "pitch",
  "graveyard",
  "banished",
  "head",
  "chest",
  "arms",
  "legs",
  "weapon1",
  "weapon2",
  "heroZone",
];

/** All zone kinds in scope-order, plus deck (deck placement queries are legal). */
const FAB_ZONE_KIND_ORDERED: readonly FabZoneKind[] = ["deck", ...FAB_CARD_REF_SCOPE];

/** Zone of an instance for this player, or null when not in any of their zones. */
export function findFabInstanceZone(
  state: FabMatchState,
  playerId: string,
  instanceId: string,
): FabZoneKind | null {
  const player = state.players[playerId];
  if (!player) return null;
  for (const zone of FAB_ZONE_KIND_ORDERED) {
    if (state.containers.zonesByPlayerId[playerId]![zone].includes(instanceId)) return zone;
  }
  // CR 3.0.14: hosted sub-cards seat in the topology registry with no zone
  // list membership — report their synthesized under seat.
  const hosted = Object.values(state.containers.subcardsByHostId).some((subcards) =>
    subcards.some((id) => id === instanceId),
  );
  return hosted ? "under" : null;
}

function matchesFilter(
  state: FabMatchState,
  instanceId: string,
  filter: FabCardRefFilter,
): boolean {
  if (filter.instanceId !== undefined && instanceId !== filter.instanceId) return false;
  if (filter.faceDown !== undefined) {
    const faceDown =
      state.objects[instanceId]?.markers.some((marker) => marker.kind === "face-down") ?? false;
    if (faceDown !== filter.faceDown) return false;
  }
  return true;
}

/**
 * Find every instance of `canonicalId` for `playerId` under `filter`.
 * Searches the resolution scope in order (or the single named zone).
 */
export function listFabCardRefs(
  state: FabMatchState,
  playerId: string,
  card: FabCardRef,
  filter: FabCardRefFilter = {},
): FabCardInstanceRef[] {
  const player = state.players[playerId];
  if (!player) {
    throw new FabCardRefNotFoundError(`Unknown player: ${playerId}`);
  }
  const canonicalId = fabCardRefId(card);
  const zones: readonly FabZoneKind[] =
    filter.zone !== undefined ? [filter.zone] : FAB_CARD_REF_SCOPE;
  const found: FabCardInstanceRef[] = [];
  for (const zone of zones) {
    for (const instanceId of state.containers.zonesByPlayerId[playerId]![zone]) {
      if (state.objects[instanceId]?.canonicalId !== canonicalId) continue;
      if (!matchesFilter(state, instanceId, filter)) continue;
      found.push(makeFabInstanceRef(state, playerId, instanceId));
    }
  }
  // CR 3.0.14: hosted sub-cards of a seated host are resolvable through the
  // topology registry — they have no zone-list membership of their own.
  if (filter.zone === undefined || filter.zone === "under") {
    for (const zone of FAB_CARD_REF_SCOPE) {
      for (const hostId of state.containers.zonesByPlayerId[playerId]![zone]) {
        const hosted = state.containers.subcardsByHostId[hostId];
        if (!hosted) continue;
        for (const instanceId of hosted) {
          if (state.objects[instanceId]?.canonicalId !== canonicalId) continue;
          if (!matchesFilter(state, instanceId, filter)) continue;
          if (found.some((entry) => entry.instanceId === instanceId)) continue;
          found.push(makeFabInstanceRef(state, playerId, instanceId));
        }
      }
    }
  }
  return found;
}

/** Find matching cards across zones public to both seated players. */
export function listPublicFabCardRefs(
  state: FabMatchState,
  card: FabCardRef,
): FabCardInstanceRef[] {
  return state.playerIds.flatMap((playerId) =>
    FAB_PUBLIC_CARD_REF_SCOPE.flatMap((zone) => listFabCardRefs(state, playerId, card, { zone })),
  );
}

/** Whether an exact instance is in a zone public to both seated players. */
export function isPublicFabCardInstance(state: FabMatchState, instanceId: string): boolean {
  return state.playerIds.some((playerId) => {
    const zone = findFabInstanceZone(state, playerId, instanceId);
    return zone !== null && FAB_PUBLIC_CARD_REF_SCOPE.includes(zone);
  });
}

/**
 * Resolve a {@link FabFluentCardRef} for a player to exactly one instance.
 *
 * - Instance refs pass through after a staleness check.
 * - Definitions / canonical ids must match exactly one instance under the
 *   filter: zero matches throws {@link FabCardRefNotFoundError}, two or more
 *   throw {@link FabAmbiguousCardRefError} with the count and zone breakdown.
 */
export function resolveFabCardRef(
  state: FabMatchState,
  playerId: string,
  ref: FabFluentCardRef,
  opts: FabCardRefFilter = {},
): FabCardInstanceRef {
  if (isFabCardInstanceRef(ref)) {
    if (!state.objects[ref.instanceId]) {
      throw new FabCardRefNotFoundError(
        `Stale FabCardInstanceRef "${ref.instanceId}" (${ref.canonicalId}) is no longer in the match.`,
      );
    }
    if (opts.zone !== undefined) {
      const zone = findFabInstanceZone(state, playerId, ref.instanceId);
      if (zone !== opts.zone) {
        throw new FabCardRefNotFoundError(
          `FabCardInstanceRef "${ref.instanceId}" (${ref.canonicalId}) is not in ${playerId} ${opts.zone} (zone: ${zone ?? "none"}).`,
        );
      }
    }
    return ref;
  }

  const canonicalId = fabCardRefId(ref);
  const matches = listFabCardRefs(state, playerId, canonicalId, opts);
  const where = opts.zone !== undefined ? ` in ${opts.zone}` : "";
  if (matches.length === 0) {
    throw new FabCardRefNotFoundError(`No instance of "${canonicalId}"${where} for ${playerId}.`);
  }
  if (matches.length > 1) {
    const byZone = new Map<FabZoneKind, number>();
    for (const match of matches) {
      const zone = findFabInstanceZone(state, playerId, match.instanceId) ?? "heroZone";
      byZone.set(zone, (byZone.get(zone) ?? 0) + 1);
    }
    const breakdown = [...byZone.entries()]
      .map(([zone, count]) => `${count} in ${zone}`)
      .join(", ");
    throw new FabAmbiguousCardRefError(
      `Ambiguous card ref "${canonicalId}"${where} for ${playerId}: ${matches.length} instances (${breakdown}) — capture a ref from a verb or zone query.`,
    );
  }
  return matches[0]!;
}

/** Resolve a fluent ref to its bare instance id. */
export function fabFluentRefInstanceId(
  state: FabMatchState,
  playerId: string,
  ref: FabFluentCardRef,
  opts: FabCardRefFilter = {},
): string {
  return resolveFabCardRef(state, playerId, ref, opts).instanceId;
}
