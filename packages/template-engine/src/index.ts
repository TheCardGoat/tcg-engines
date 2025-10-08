/**
 * Template Game Engine
 *
 * A minimal working example showing how to build a TCG engine with @tcg/core.
 * Clone this package and modify it to create your own game!
 */

// Re-export core types for convenience
export type {
  GameDefinition,
  MoveContext,
  MoveExecutionResult,
  RuleEngine,
} from "@tcg/core";

// Export game definition
export { templateGameDefinition } from "./game-definition";

// Export types
export type {
  CardInstance,
  TemplateGameMoves,
  TemplateGameState,
} from "./types";

// Helper to create game
import { type Player, RuleEngine } from "@tcg/core";
import { templateGameDefinition } from "./game-definition";

/**
 * Create a new template game instance
 *
 * @param players - Array of players for the game
 * @param seed - Optional RNG seed for deterministic gameplay
 * @returns RuleEngine instance ready for gameplay
 *
 * @example
 * ```typescript
 * import { createTemplateGame, createPlayerId } from "@tcg/template";
 *
 * const game = createTemplateGame([
 *   { id: createPlayerId("p1"), name: "Alice" },
 *   { id: createPlayerId("p2"), name: "Bob" },
 * ]);
 *
 * // Execute moves
 * game.executeMove("drawCard", { playerId: "p1" });
 * game.executeMove("endPhase", { playerId: "p1" });
 *
 * // Get state
 * const state = game.getState();
 * const playerView = game.getPlayerView("p1");
 * ```
 */
export function createTemplateGame(players: Player[], seed?: string) {
  return new RuleEngine(templateGameDefinition, players, { seed });
}
