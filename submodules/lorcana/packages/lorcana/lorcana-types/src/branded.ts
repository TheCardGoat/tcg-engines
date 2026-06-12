/**
 * Branded Types
 *
 * Game-agnostic compile-time brands used across engines and type packages.
 */

declare const brand: unique symbol;

/**
 * Base branded type that adds a compile-time brand to a value.
 */
export type Brand<T, TBrand> = T & { readonly [brand]: TBrand };

/**
 * Card instance identifier - unique ID for a card instance in a match.
 */
export type CardInstanceId = Brand<string, "CardInstanceId">;

/**
 * Public card definition identifier - unique ID for static card definitions.
 */
export type CardPublicId = Brand<string, "CardPublicId">;

/**
 * Player identifier - unique ID for a player in a match.
 */
export type PlayerId = Brand<string, "PlayerId">;

/**
 * Game identifier - unique ID for a game session.
 */
export type GameId = Brand<string, "GameId">;

/**
 * Zone identifier - unique ID for a zone.
 */
export type ZoneId = Brand<string, "ZoneId">;
