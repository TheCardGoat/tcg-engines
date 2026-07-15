/**
 * Branded Types
 *
 * Branded types provide compile-time type safety for primitive values
 * to prevent mixing different ID types and other domain values.
 */

declare const brand: unique symbol;

/**
 * Base branded type that adds a compile-time brand to a value
 */
export type Brand<T, TBrand> = T & { readonly [brand]: TBrand };

/**
 * Card identifier - unique ID for a card instance in the game
 */
export type CardId = Brand<string, "CardId">;

/**
 * Player identifier - unique ID for a player in the game
 */
export type PlayerId = Brand<string, "PlayerId">;

/**
 * Game identifier - unique ID for a game session
 */
export type GameId = Brand<string, "GameId">;

/**
 * Zone identifier - unique ID for a zone in the game
 */
export type ZoneId = Brand<string, "ZoneId">;
