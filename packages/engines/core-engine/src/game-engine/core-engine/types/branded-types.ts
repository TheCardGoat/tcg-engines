/**
 * Branded type utilities for type-safe domain identifiers.
 *
 * Branded types prevent accidental mixing of different ID types
 * while maintaining runtime compatibility with strings.
 */

import { nanoid } from "nanoid";

/**
 * Brand helper type for creating branded types
 */
declare const brand: unique symbol;
export type Brand<T, TBrand> = T & { readonly [brand]: TBrand };

/**
 * Unique identifier for a card instance
 */
export type CardId = Brand<string, "CardId">;

/**
 * Unique identifier for a player
 */
export type PlayerId = Brand<string, "PlayerId">;

/**
 * Unique identifier for a zone
 */
export type ZoneId = Brand<string, "ZoneId">;

/**
 * Unique identifier for a game
 */
export type GameId = Brand<string, "GameId">;

/**
 * Creates a CardId from a string or generates a new one
 */
export function createCardId(): CardId;
export function createCardId(id: string): CardId;
export function createCardId(id?: string): CardId {
  // biome-ignore lint/suspicious/noExplicitAny: Required for branded type creation
  return (id ?? nanoid()) as any;
}

/**
 * Creates a PlayerId from a string or generates a new one
 */
export function createPlayerId(): PlayerId;
export function createPlayerId(id: string): PlayerId;
export function createPlayerId(id?: string): PlayerId {
  // biome-ignore lint/suspicious/noExplicitAny: Required for branded type creation
  return (id ?? nanoid()) as any;
}

/**
 * Creates a ZoneId from a string or generates a new one
 */
export function createZoneId(): ZoneId;
export function createZoneId(id: string): ZoneId;
export function createZoneId(id?: string): ZoneId {
  // biome-ignore lint/suspicious/noExplicitAny: Required for branded type creation
  return (id ?? nanoid()) as any;
}

/**
 * Creates a GameId from a string or generates a new one
 */
export function createGameId(): GameId;
export function createGameId(id: string): GameId;
export function createGameId(id?: string): GameId {
  // biome-ignore lint/suspicious/noExplicitAny: Required for branded type creation
  return (id ?? nanoid()) as any;
}
