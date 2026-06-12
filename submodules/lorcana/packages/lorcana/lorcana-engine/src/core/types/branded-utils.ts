import type { CardInstanceId, GameId, PlayerId, ZoneId } from "@tcg/lorcana-types";

function createBrandedId<T extends string>(id?: string): T {
  return (id ?? crypto.randomUUID()) as T;
}

/**
 * Creates a CardId from a string or generates a new unique ID
 * @param id - Optional ID string. If not provided, generates a new unique ID
 * @returns A branded CardId
 */
export function createCardId(): CardInstanceId;
export function createCardId(id: string): CardInstanceId;
export function createCardId(id?: string): CardInstanceId {
  return createBrandedId<CardInstanceId>(id);
}

/**
 * Creates a PlayerId from a string or generates a new unique ID
 * @param id - Optional ID string. If not provided, generates a new unique ID
 * @returns A branded PlayerId
 */
export function createPlayerId(): PlayerId;
export function createPlayerId(id: string): PlayerId;
export function createPlayerId(id?: string): PlayerId {
  return createBrandedId<PlayerId>(id);
}

/**
 * Creates a GameId from a string or generates a new unique ID
 * @param id - Optional ID string. If not provided, generates a new unique ID
 * @returns A branded GameId
 */
export function createGameId(): GameId;
export function createGameId(id: string): GameId;
export function createGameId(id?: string): GameId {
  return createBrandedId<GameId>(id);
}

/**
 * Creates a ZoneId from a string or generates a new unique ID
 * @param id - Optional ID string. If not provided, generates a new unique ID
 * @returns A branded ZoneId
 */
export function createZoneId(): ZoneId;
export function createZoneId(id: string): ZoneId;
export function createZoneId(id?: string): ZoneId {
  return createBrandedId<ZoneId>(id);
}

// =============================================================================
// Safe Casting Helpers
// =============================================================================

/**
 * Safely cast a string to CardInstanceId.
 * Use when you have a known-valid card ID from trusted sources (e.g., server data).
 */
export function asCardInstanceId(id: string): CardInstanceId {
  return id as CardInstanceId;
}

/**
 * Safely cast a string to PlayerId.
 * Use when you have a known-valid player ID from trusted sources.
 */
export function asPlayerId(id: string): PlayerId {
  return id as PlayerId;
}

/**
 * Safely cast a string to ZoneId.
 * Use when you have a known-valid zone ID from trusted sources.
 */
export function asZoneId(id: string): ZoneId {
  return id as ZoneId;
}

/**
 * Safely cast a string to GameId.
 * Use when you have a known-valid game ID from trusted sources.
 */
export function asGameId(id: string): GameId {
  return id as GameId;
}

// =============================================================================
// Optional Casting Helpers (return undefined for empty/null input)
// =============================================================================

/**
 * Safely cast a string to CardInstanceId, returning undefined for empty/null input.
 */
export function asCardInstanceIdOptional(
  id: string | undefined | null,
): CardInstanceId | undefined {
  return id ? (id as CardInstanceId) : undefined;
}

/**
 * Safely cast a string to PlayerId, returning undefined for empty/null input.
 */
export function asPlayerIdOptional(id: string | undefined | null): PlayerId | undefined {
  return id ? (id as PlayerId) : undefined;
}

/**
 * Safely cast a string to ZoneId, returning undefined for empty/null input.
 */
export function asZoneIdOptional(id: string | undefined | null): ZoneId | undefined {
  return id ? (id as ZoneId) : undefined;
}

/**
 * Safely cast an array of strings to CardInstanceId[].
 */
export function asCardInstanceIds(ids: string[]): CardInstanceId[] {
  return ids as CardInstanceId[];
}
