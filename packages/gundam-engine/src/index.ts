/**
 * @tcg/gundam - Gundam Card Game Engine
 *
 * A complete implementation of the Bandai Gundam Card Game using the @tcg/core framework.
 * This package serves as both a production-ready game engine and a reference implementation
 * for building TCG engines with @tcg/core.
 *
 * @example
 * ```typescript
 * import { createGundamGame } from "@tcg/gundam";
 *
 * const game = createGundamGame({
 *   players: [
 *     { id: "player1", deck: deck1 },
 *     { id: "player2", deck: deck2 },
 *   ],
 * });
 *
 * const result = game.executeMove({
 *   type: "PLAY_RESOURCE",
 *   playerId: "player1",
 * });
 * ```
 */

// Card types (for deck building)
export * from "./cards/card-types";
// Main game definition
export { gundamGame } from "./game-definition";

// Moves
export {
  attackMove,
  deployBaseMove,
  deployUnitMove,
  drawMove,
  passMove,
  playResourceMove,
} from "./moves";
// Type definitions
export type { CardPosition, GundamGameState, GundamMoves } from "./types";
// Zone utilities
export * from "./zones";
