/**
 * Card references for fluent tests.
 *
 * - Pass a **card definition** when exactly one matching instance exists
 *   in the relevant player/zone scope.
 * - Pass a **CardInstanceRef** (or raw instance id string) when multiples exist.
 */

import type { Card } from "@tcg/gundam-types";
import type { PlayerId } from "../../types/branded.ts";
import type { MatchRuntime } from "../../runtime/match-runtime.ts";
import type { GundamPlayerId } from "./test-engine.ts";

export interface CardInstanceRef {
  readonly kind: "instance";
  readonly instanceId: string;
  readonly definitionId: string;
  readonly ownerId: GundamPlayerId;
}

export type CardRef = Card | CardInstanceRef | string;

export interface CardRefFilter {
  /** Limit search to this zone name (without player suffix), e.g. "battleArea". */
  zone?: string;
  exhausted?: boolean;
  damaged?: boolean;
  hasPilot?: boolean;
}

export class CardRefNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CardRefNotFoundError";
  }
}

export class AmbiguousCardRefError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AmbiguousCardRefError";
  }
}

export function isCardInstanceRef(value: unknown): value is CardInstanceRef {
  return (
    typeof value === "object" &&
    value !== null &&
    (value as CardInstanceRef).kind === "instance" &&
    typeof (value as CardInstanceRef).instanceId === "string"
  );
}

export function isCardDefinition(value: unknown): value is Card {
  return (
    typeof value === "object" &&
    value !== null &&
    !isCardInstanceRef(value) &&
    typeof (value as Card).cardNumber === "string"
  );
}

export function cardRefId(ref: CardRef): string {
  if (typeof ref === "string") return ref;
  if (isCardInstanceRef(ref)) return ref.instanceId;
  return ref.cardNumber;
}

/**
 * Build an instance ref from a known id (e.g. after deploy).
 * Reads definitionId from the runtime catalog when possible.
 */
export function makeInstanceRef(
  runtime: MatchRuntime,
  playerId: GundamPlayerId,
  instanceId: string,
): CardInstanceRef {
  const state = runtime.getState();
  const index = state.ctx.zones.private.cardIndex[instanceId];
  const owner = (index?.ownerID as GundamPlayerId | undefined) ?? playerId;
  let definitionId = instanceId;
  try {
    const def = runtime.getFrameworkReadAPI().cards.getDefinition(instanceId) as Card | undefined;
    if (def?.cardNumber) definitionId = def.cardNumber;
  } catch {
    // keep instanceId fallback
  }
  // Prefer instance id prefix convention player_CARD_n
  const prefixMatch = instanceId.match(/^player_(?:one|two)_(.+?)_\d+$/);
  if (definitionId === instanceId && prefixMatch?.[1]) {
    definitionId = prefixMatch[1]!;
  }
  return { kind: "instance", instanceId, definitionId, ownerId: owner };
}

/**
 * Resolve a CardRef for a player. Definitions must be unique under `filter`
 * or this throws AmbiguousCardRefError / CardRefNotFoundError.
 */
export function resolveCardRef(
  runtime: MatchRuntime,
  playerId: GundamPlayerId,
  ref: CardRef,
  filter: CardRefFilter = {},
): CardInstanceRef {
  if (typeof ref === "string") {
    if (!runtime.getState().ctx.zones.private.cardIndex[ref]) {
      throw new CardRefNotFoundError(`No card instance with id "${ref}"`);
    }
    return makeInstanceRef(runtime, playerId, ref);
  }
  if (isCardInstanceRef(ref)) {
    if (!runtime.getState().ctx.zones.private.cardIndex[ref.instanceId]) {
      throw new CardRefNotFoundError(
        `Stale CardInstanceRef "${ref.instanceId}" (${ref.definitionId}) is not on the board`,
      );
    }
    return ref;
  }

  const cardNumber = ref.cardNumber;
  const matches = findInstances(runtime, playerId, cardNumber, filter);
  if (matches.length === 0) {
    const where = filter.zone ? ` in ${filter.zone}` : "";
    throw new CardRefNotFoundError(`No instance of ${cardNumber}${where} for ${playerId}`);
  }
  if (matches.length > 1) {
    const where = filter.zone ? ` in ${filter.zone}` : "";
    throw new AmbiguousCardRefError(
      `AmbiguousCardRef ${cardNumber}${where} for ${playerId}: ${matches.length} instances — capture a ref from deploy/query`,
    );
  }
  return makeInstanceRef(runtime, playerId, matches[0]!);
}

/**
 * Like resolveCardRef but for opponent-visible targeting: also searches the
 * opponent's public zones when the definition is not on the acting player.
 * Prefer explicit player.unit() for clarity; this is used when target is a def
 * known to sit on the other side.
 */
export function resolveCardRefOnEitherPlayer(
  runtime: MatchRuntime,
  preferPlayerId: GundamPlayerId,
  otherPlayerId: GundamPlayerId,
  ref: CardRef,
  filter: CardRefFilter = {},
): CardInstanceRef {
  if (typeof ref === "string" || isCardInstanceRef(ref)) {
    return resolveCardRef(runtime, preferPlayerId, ref, filter);
  }
  try {
    return resolveCardRef(runtime, preferPlayerId, ref, filter);
  } catch (e) {
    if (e instanceof CardRefNotFoundError) {
      return resolveCardRef(runtime, otherPlayerId, ref, filter);
    }
    throw e;
  }
}

function findInstances(
  runtime: MatchRuntime,
  playerId: GundamPlayerId,
  cardNumber: string,
  filter: CardRefFilter,
): string[] {
  const state = runtime.getState();
  const zoneCards = state.ctx.zones.private.zoneCards;
  const g = state.G;
  const cardsApi = runtime.getFrameworkReadAPI().cards;
  const found: string[] = [];

  for (const [zoneRef, ids] of Object.entries(zoneCards)) {
    if (!zoneRef.endsWith(`:${playerId}`) && zoneRef !== "removalArea") continue;
    // removalArea is shared; skip unless owned
    if (zoneRef === "removalArea") continue;
    const zoneName = zoneRef.slice(0, zoneRef.lastIndexOf(":"));
    if (filter.zone && zoneName !== filter.zone) continue;

    for (const instanceId of ids) {
      const def = cardsApi.getDefinition(instanceId) as Card | undefined;
      const defId = def?.cardNumber;
      const prefixOk = instanceId.includes(`_${cardNumber}_`);
      if (defId !== cardNumber && !prefixOk) continue;

      if (filter.exhausted !== undefined) {
        const exh = g.exhausted[instanceId] === true;
        if (exh !== filter.exhausted) continue;
      }
      if (filter.damaged !== undefined) {
        const dmg = (g.damage[instanceId] ?? 0) > 0;
        if (dmg !== filter.damaged) continue;
      }
      if (filter.hasPilot !== undefined) {
        const has = g.pilotAssignments[instanceId] !== undefined;
        if (has !== filter.hasPilot) continue;
      }
      found.push(instanceId);
    }
  }
  return found;
}

export function listCardRefs(
  runtime: MatchRuntime,
  playerId: GundamPlayerId,
  card: Card | string,
  filter: CardRefFilter = {},
): CardInstanceRef[] {
  const cardNumber = typeof card === "string" ? card : card.cardNumber;
  return findInstances(runtime, playerId, cardNumber, filter).map((id) =>
    makeInstanceRef(runtime, playerId, id),
  );
}

/** Opponent id helper for two-player fixtures. */
export function otherPlayer(playerId: GundamPlayerId): GundamPlayerId {
  return playerId === "player_one" ? "player_two" : "player_one";
}

export type { PlayerId };
