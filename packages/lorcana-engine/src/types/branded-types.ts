/**
 * Branded Types for Type-Safe IDs
 *
 * Task 1.2: Create branded types for domain-specific IDs
 *
 * Re-exports core branded types from @tcg/core for consistency across the monorepo.
 * Adds Lorcana-specific branded types using the same pattern.
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

// Re-export core branded types for consistency
export type { CardId, GameId, PlayerId, ZoneId } from "@tcg/core";

// Import the Brand type from core for creating additional branded types
import type { CardId, GameId, PlayerId, ZoneId } from "@tcg/core";

/**
 * AbilityId - Branded string for ability identification (Lorcana-specific)
 *
 * Uses the same pattern as @tcg/core branded types for compatibility.
 */
declare const abilityIdBrand: unique symbol;
export type AbilityId = string & { readonly [abilityIdBrand]: "AbilityId" };

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
