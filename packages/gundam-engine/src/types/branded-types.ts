/**
 * Branded Types for Type-Safe IDs
 *
 * Re-exports core branded types from @tcg/core for consistency across the monorepo.
 * Follows the same pattern as lorcana-engine's branded-types.ts.
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

// Re-export core branded types
export type { CardId, GameId, PlayerId, ZoneId } from "@tcg/core";

// Re-export creator functions from core
export {
  createCardId,
  createGameId,
  createPlayerId,
  createZoneId,
} from "@tcg/core";
