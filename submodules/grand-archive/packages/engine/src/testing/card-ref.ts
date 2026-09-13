import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveZone,
} from "@tcg/grand-archive-types";
import type { GrandArchiveObjectId, GrandArchivePlayerId } from "../game/identity.ts";
import type { GrandArchiveMatchState } from "../game/model.ts";
import { GRAND_ARCHIVE_ZONES } from "../game/zones.ts";

/**
 * Owner-addressable zones used by an unqualified player-facing card ref.
 *
 * Main Deck identities and order are unknown even to their owner. Tests that
 * are arranging a specific deck object may still opt in with
 * `{ zone: "main-deck", objectId }`, but an intent-level `card(definition)`
 * must never discover one implicitly.
 */
export const GRAND_ARCHIVE_PLAYER_CARD_REF_ZONES = GRAND_ARCHIVE_ZONES.filter(
  (zone) => zone !== "main-deck",
);

/** Stable test-harness handle to one physical Grand Archive object. */
export interface GrandArchiveCardInstanceRef {
  readonly kind: "instance";
  readonly objectId: GrandArchiveObjectId;
  readonly definitionId: string;
  readonly ownerId: GrandArchivePlayerId;
}

/** A printed definition shorthand accepted by the test harness. */
export type GrandArchiveCardDefinitionRef =
  | string
  | Pick<GrandArchiveAnyCard<GrandArchiveAbilityDefinition>, "canonicalId">;

export type GrandArchiveTestCardRef = GrandArchiveCardDefinitionRef | GrandArchiveCardInstanceRef;

export interface GrandArchiveCardRefFilter {
  readonly zone?: GrandArchiveZone;
  readonly objectId?: GrandArchiveObjectId;
}

export class GrandArchiveCardRefNotFoundError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "GrandArchiveCardRefNotFoundError";
  }
}

export class GrandArchiveAmbiguousCardRefError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "GrandArchiveAmbiguousCardRefError";
  }
}

export function isGrandArchiveCardInstanceRef(
  value: GrandArchiveTestCardRef,
): value is GrandArchiveCardInstanceRef {
  return typeof value === "object" && "kind" in value && value.kind === "instance";
}

function definitionIdOf(ref: GrandArchiveCardDefinitionRef): string {
  return typeof ref === "string" ? ref : ref.canonicalId;
}

function makeGrandArchiveCardInstanceRef(
  state: GrandArchiveMatchState,
  objectId: GrandArchiveObjectId,
): GrandArchiveCardInstanceRef {
  const object = state.objects[objectId];
  if (!object) {
    throw new GrandArchiveCardRefNotFoundError(`No Grand Archive object named ${objectId}.`);
  }
  return {
    kind: "instance",
    objectId,
    definitionId: object.definitionId,
    ownerId: object.ownerId,
  };
}

/** List a player's physical objects matching one printed definition. */
export function listGrandArchiveCardRefs(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  ref: GrandArchiveCardDefinitionRef,
  filter: GrandArchiveCardRefFilter = {},
): readonly GrandArchiveCardInstanceRef[] {
  if (!state.players[playerId]) {
    throw new GrandArchiveCardRefNotFoundError(`Unknown Grand Archive player ${playerId}.`);
  }
  const definitionId = definitionIdOf(ref);
  const zones = filter.zone ? [filter.zone] : GRAND_ARCHIVE_PLAYER_CARD_REF_ZONES;
  const found: GrandArchiveCardInstanceRef[] = [];
  const seen = new Set<GrandArchiveObjectId>();
  for (const zone of zones) {
    for (const objectId of state.zones[playerId][zone]) {
      if (seen.has(objectId)) continue;
      const object = state.objects[objectId];
      if (
        !object ||
        object.definitionId !== definitionId ||
        (filter.objectId !== undefined && objectId !== filter.objectId)
      ) {
        continue;
      }
      seen.add(objectId);
      found.push(makeGrandArchiveCardInstanceRef(state, objectId));
    }
  }
  return found;
}

/**
 * Resolve shorthand to exactly one object. Ambiguous definitions never select
 * an arbitrary copy; callers must narrow by zone/object id or retain an instance ref.
 */
export function resolveGrandArchiveCardRef(
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
  ref: GrandArchiveTestCardRef,
  filter: GrandArchiveCardRefFilter = {},
): GrandArchiveCardInstanceRef {
  if (isGrandArchiveCardInstanceRef(ref)) {
    if (ref.ownerId !== playerId) {
      throw new GrandArchiveCardRefNotFoundError(
        `Grand Archive object ${ref.objectId} does not belong to ${playerId}.`,
      );
    }
    const object = state.objects[ref.objectId];
    if (!object || object.definitionId !== ref.definitionId || object.ownerId !== ref.ownerId) {
      throw new GrandArchiveCardRefNotFoundError(
        `Grand Archive object reference ${ref.objectId} is stale.`,
      );
    }
    if (filter.objectId !== undefined && filter.objectId !== ref.objectId) {
      throw new GrandArchiveCardRefNotFoundError(
        `Grand Archive object ${ref.objectId} does not match the requested object id.`,
      );
    }
    if (filter.zone !== undefined && object.zone !== filter.zone) {
      throw new GrandArchiveCardRefNotFoundError(
        `Grand Archive object ${ref.objectId} is in ${object.zone}, not ${filter.zone}.`,
      );
    }
    return makeGrandArchiveCardInstanceRef(state, ref.objectId);
  }

  const definitionId = definitionIdOf(ref);
  const matches = listGrandArchiveCardRefs(state, playerId, ref, filter);
  const where = filter.zone ? ` in ${filter.zone}` : "";
  if (matches.length === 0) {
    throw new GrandArchiveCardRefNotFoundError(
      `No instance of ${definitionId}${where} belongs to ${playerId}.`,
    );
  }
  if (matches.length > 1) {
    const counts = new Map<GrandArchiveZone, number>();
    for (const match of matches) {
      const zone = state.objects[match.objectId]?.zone;
      if (zone) counts.set(zone, (counts.get(zone) ?? 0) + 1);
    }
    const breakdown = [...counts.entries()]
      .map(([zone, count]) => `${count} in ${zone}`)
      .join(", ");
    throw new GrandArchiveAmbiguousCardRefError(
      `Ambiguous Grand Archive card ref ${definitionId} for ${playerId}: ${breakdown}.`,
    );
  }
  return matches[0]!;
}
