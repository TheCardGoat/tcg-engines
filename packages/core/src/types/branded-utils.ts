import { nanoid } from "nanoid";
import type { CardId, GameId, PlayerId, ZoneId } from "./branded";

/**
 * Creates a CardId from a string or generates a new unique ID
 * @param id - Optional ID string. If not provided, generates a new unique ID
 * @returns A branded CardId
 */
export function createCardId(): CardId;
export function createCardId(id: string): CardId;
export function createCardId(id?: string): CardId {
  // Type assertion is acceptable here as this is the only way to create branded types
  // biome-ignore lint/suspicious/noExplicitAny: Required for branded type creation
  return (id ?? nanoid()) as any;
}

/**
 * Creates a PlayerId from a string or generates a new unique ID
 * @param id - Optional ID string. If not provided, generates a new unique ID
 * @returns A branded PlayerId
 */
export function createPlayerId(): PlayerId;
export function createPlayerId(id: string): PlayerId;
export function createPlayerId(id?: string): PlayerId {
  // Type assertion is acceptable here as this is the only way to create branded types
  // biome-ignore lint/suspicious/noExplicitAny: Required for branded type creation
  return (id ?? nanoid()) as any;
}

/**
 * Creates a GameId from a string or generates a new unique ID
 * @param id - Optional ID string. If not provided, generates a new unique ID
 * @returns A branded GameId
 */
export function createGameId(): GameId;
export function createGameId(id: string): GameId;
export function createGameId(id?: string): GameId {
  // Type assertion is acceptable here as this is the only way to create branded types
  // biome-ignore lint/suspicious/noExplicitAny: Required for branded type creation
  return (id ?? nanoid()) as any;
}

/**
 * Creates a ZoneId from a string or generates a new unique ID
 * @param id - Optional ID string. If not provided, generates a new unique ID
 * @returns A branded ZoneId
 */
export function createZoneId(): ZoneId;
export function createZoneId(id: string): ZoneId;
export function createZoneId(id?: string): ZoneId {
  // Type assertion is acceptable here as this is the only way to create branded types
  // biome-ignore lint/suspicious/noExplicitAny: Required for branded type creation
  return (id ?? nanoid()) as any;
}
