/**
 * Branded Types for Type-Safe IDs
 * 
 * Task 1.2: Create branded types for domain-specific IDs
 * 
 * Branded types provide compile-time type safety by making IDs
 * of different types incompatible, even though they're all strings at runtime.
 * 
 * @example
 * ```typescript
 * const playerId = createPlayerId("player1");
 * const cardId = createCardId("card-1");
 * 
 * // TypeScript error: Type 'CardId' is not assignable to type 'PlayerId'
 * const wrong: PlayerId = cardId;
 * ```
 */

/**
 * Brand<K, T> - Generic branded type helper
 * 
 * Creates a branded type by intersecting K with a unique brand property.
 * The brand property is never actually present at runtime, it's only for type checking.
 */
export type Brand<K, T> = K & { readonly __brand: T };

/**
 * PlayerId - Branded string for player identification
 */
export type PlayerId = Brand<string, "PlayerId">;

/**
 * CardId - Branded string for card identification
 */
export type CardId = Brand<string, "CardId">;

/**
 * ZoneId - Branded string for zone identification
 */
export type ZoneId = Brand<string, "ZoneId">;

/**
 * AbilityId - Branded string for ability identification
 */
export type AbilityId = Brand<string, "AbilityId">;

/**
 * GameId - Branded string for game identification
 */
export type GameId = Brand<string, "GameId">;

/**
 * Create a PlayerId from a string
 * 
 * @param value - The string value to brand as PlayerId
 * @returns Branded PlayerId
 */
export const createPlayerId = (value: string): PlayerId => {
  if (!value || value.length === 0) {
    throw new Error("PlayerId cannot be empty");
  }
  return value as PlayerId;
};

/**
 * Create a CardId from a string
 * 
 * @param value - The string value to brand as CardId
 * @returns Branded CardId
 */
export const createCardId = (value: string): CardId => {
  if (!value || value.length === 0) {
    throw new Error("CardId cannot be empty");
  }
  return value as CardId;
};

/**
 * Create a ZoneId from a string
 * 
 * @param value - The string value to brand as ZoneId
 * @returns Branded ZoneId
 */
export const createZoneId = (value: string): ZoneId => {
  if (!value || value.length === 0) {
    throw new Error("ZoneId cannot be empty");
  }
  return value as ZoneId;
};

/**
 * Create an AbilityId from a string
 * 
 * @param value - The string value to brand as AbilityId
 * @returns Branded AbilityId
 */
export const createAbilityId = (value: string): AbilityId => {
  if (!value || value.length === 0) {
    throw new Error("AbilityId cannot be empty");
  }
  return value as AbilityId;
};

/**
 * Create a GameId from a string
 * 
 * @param value - The string value to brand as GameId
 * @returns Branded GameId
 */
export const createGameId = (value: string): GameId => {
  if (!value || value.length === 0) {
    throw new Error("GameId cannot be empty");
  }
  return value as GameId;
};

/**
 * Type guard to check if a value is a non-empty string
 * 
 * @param value - Value to check
 * @returns True if value is a non-empty string
 */
export const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.length > 0;
};

