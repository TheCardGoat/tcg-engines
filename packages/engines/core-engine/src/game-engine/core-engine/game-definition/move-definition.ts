/**
 * Move definition types for the TCG engine
 */

import type { SeededRNG } from "../utils/rng";

/**
 * Move information passed to move reducers
 */
export type Move<TParams = unknown> = {
  name: string;
  params: TParams;
  playerId: string;
};

/**
 * Context provided to move reducers and conditions
 */
export type MoveContext<_TState, TParams = unknown> = {
  move: Move<TParams>;
  rng: SeededRNG;
};

/**
 * Move reducer function that updates game state
 * Uses Immer draft pattern - can mutate state directly
 * @param state - Immer draft of game state
 * @param context - Move context with move info and RNG
 * @returns Updated state (or undefined if state is mutated)
 */
export type MoveReducer<TState, TParams = unknown> = (
  state: TState,
  context: MoveContext<TState, TParams>,
) => TState | undefined;

/**
 * Condition function that checks if a move can be executed
 * @param state - Current game state (readonly)
 * @param context - Move context with move info and RNG
 * @returns true if move can be executed, false otherwise
 */
export type MoveCondition<TState, TParams = unknown> = (
  state: Readonly<TState>,
  context: MoveContext<TState, TParams>,
) => boolean;

/**
 * Move metadata for documentation and tooling
 */
export type MoveMetadata = {
  description?: string;
  requiresTarget?: boolean;
  tags?: string[];
  [key: string]: unknown;
};

/**
 * MoveDefinition configures a single move type
 */
export type MoveDefinition<TState, TParams = unknown> = {
  /**
   * Move reducer that updates state
   */
  reducer: MoveReducer<TState, TParams>;

  /**
   * Optional condition that must be true for move to execute
   */
  condition?: MoveCondition<TState, TParams>;

  /**
   * Optional metadata for documentation and tooling
   */
  metadata?: MoveMetadata;
};

/**
 * MoveDefinitions is an exhaustive mapping of move names to their definitions
 * @template TState - The game state type
 * @template TMoves - Object type mapping move names to their parameter types
 */
export type MoveDefinitions<TState, TMoves extends Record<string, unknown>> = {
  [K in keyof TMoves]: MoveDefinition<TState, TMoves[K]>;
};

/**
 * Result of move execution
 */
export type MoveResult<TState> =
  | {
      success: true;
      state: TState;
    }
  | {
      success: false;
      error: string;
    };
