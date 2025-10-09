import { RuleEngine, type RuleEngineOptions } from "../engine/rule-engine";
import type {
  GameDefinition,
  Player,
} from "../game-definition/game-definition";
import { createTestPlayers } from "./test-player-builder";

/**
 * Test Engine Builder
 *
 * Task 2.3: Implement createTestEngine(definition, players?, options?)
 *
 * Creates a fully initialized RuleEngine for testing.
 * Simplifies test setup by providing sensible defaults for players and options.
 *
 * Features:
 * - Default 2 players if not provided
 * - Optional seed for deterministic testing
 * - Returns ready-to-use engine with initialized state
 *
 * @example
 * ```typescript
 * // Create engine with defaults (2 players)
 * const engine = createTestEngine(gameDefinition);
 *
 * // Create engine with custom players
 * const players = createTestPlayers(4, ['Alice', 'Bob', 'Charlie', 'Dave']);
 * const engine = createTestEngine(gameDefinition, players);
 *
 * // Create engine with seed for deterministic tests
 * const engine = createTestEngine(gameDefinition, undefined, {
 *   seed: 'test-seed-123'
 * });
 * ```
 */
export function createTestEngine<TState, TMoves extends Record<string, any>>(
  definition: GameDefinition<TState, TMoves>,
  players?: Player[],
  options?: RuleEngineOptions,
): RuleEngine<TState, TMoves> {
  // Use provided players or create default 2 players
  const enginePlayers = players ?? createTestPlayers(2);

  // Create and return engine with options
  return new RuleEngine(definition, enginePlayers, options);
}
