/**
 * Core GameDefinition type system for the TCG engine
 */

import type { FlowDefinition } from "../flow/xstate-compat";
import type { MoveDefinitions } from "./move-definition";

// Re-export validation
export { validateGameDefinition } from "./validation";

/**
 * Player represents a participant in the game
 */
export type Player = {
  id: string;
  name: string;
};

/**
 * GameEndResult represents the outcome when a game ends
 */
export type GameEndResult = {
  winner?: string; // Player ID of winner, undefined for draw
  reason: string; // Human-readable reason for game end
};

/**
 * GameDefinition is the declarative configuration for a game
 * @template TState - The game state type
 * @template TMoves - The moves type mapping move names to their parameter types
 */
export type GameDefinition<TState, TMoves extends Record<string, unknown>> = {
  /**
   * Display name of the game
   */
  name: string;

  /**
   * Minimum number of players required
   */
  minPlayers: number;

  /**
   * Maximum number of players allowed
   */
  maxPlayers: number;

  /**
   * Setup function creates the initial game state
   * Must be pure and deterministic
   * @param players - Array of players in the game
   * @returns Initial state for the game
   */
  setup: (players: Player[]) => TState;

  /**
   * Move definitions - exhaustive mapping of move names to their configurations
   */
  moves: MoveDefinitions<TState, TMoves>;

  /**
   * Flow configuration defines turn structure (phases and steps)
   */
  flow: FlowDefinition<TState>;

  /**
   * Optional game end condition
   * Checked after every move to determine if game has ended
   * @param state - Current game state
   * @returns GameEndResult if game is over, undefined otherwise
   */
  endIf?: (state: TState) => GameEndResult | undefined;

  /**
   * Optional player view filtering function
   * Filters state to hide private information from specific players
   * @param state - Full game state
   * @param playerId - ID of player viewing the state
   * @returns Filtered state for the player
   */
  playerView?: (state: TState, playerId: string) => TState;
};
