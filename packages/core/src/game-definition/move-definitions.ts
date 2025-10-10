import type { Draft } from "immer";
import type { MoveContext } from "../moves/move-system";

/**
 * Game Move Definition
 *
 * Task 10.5, 10.6: Implement GameMoveDefinition with reducer and optional condition
 *
 * Declarative definition of a single move/action in the game.
 * Each move has:
 * - A reducer function (required) - executes the move
 * - An optional condition function - validates if move is legal
 * - Optional metadata - for categorization, UI, etc.
 *
 * @template TState - Game state type
 * @template TCardMeta - Card metadata type (for zone/card operations)
 * @template TCardDefinition - Card definition type (for registry access)
 */
export type GameMoveDefinition<
  TState,
  TCardMeta = any,
  TCardDefinition = any,
> = {
  /**
   * Move reducer - executes the move using Immer draft
   *
   * Task 10.6: Reducer with Immer draft pattern
   *
   * Pure function that mutates the draft to update state.
   * Immer converts mutations into immutable updates.
   *
   * @param draft - Immer draft (mutable proxy) of game state
   * @param context - Move context (player, targets, data, timestamp, zones, cards, registry)
   */
  reducer: (
    draft: Draft<TState>,
    context: MoveContext<TCardMeta, TCardDefinition>,
  ) => void;

  /**
   * Move condition - validates if move is legal
   *
   * Task 10.6: Optional condition for validation
   *
   * Pure predicate checked BEFORE reducer execution.
   * If returns false, move is rejected without state changes.
   *
   * @param state - Current game state (readonly)
   * @param context - Move context (player, targets, data, timestamp, zones, cards, registry)
   * @returns True if move is legal, false otherwise
   */
  condition?: (
    state: TState,
    context: MoveContext<TCardMeta, TCardDefinition>,
  ) => boolean;

  /**
   * Optional metadata
   *
   * For categorization, UI display, AI hints, etc.
   * Not used by engine, but available to game implementations.
   */
  metadata?: {
    /** Move category (e.g., 'combat', 'resource', 'draw') */
    category?: string;
    /** Tags for filtering/searching */
    tags?: string[];
    /** Custom metadata */
    [key: string]: unknown;
  };
};

/**
 * Game Move Definitions - Exhaustive mapping of moves
 *
 * Task 10.6: GameMoveDefinitions type with exhaustive mapping
 *
 * Maps each move name in TMoves to its GameMoveDefinition.
 * TypeScript enforces that:
 * - All moves in TMoves have definitions
 * - No extra moves are defined
 * - Each definition has correct reducer signature
 *
 * @example
 * ```typescript
 * type MyMoves = {
 *   playCard: { cardId: string };
 *   pass: {};
 * };
 *
 * const moves: GameMoveDefinitions<GameState, MyMoves> = {
 *   playCard: {
 *     condition: (state, context) => { ... },
 *     reducer: (draft, context) => { ... }
 *   },
 *   pass: {
 *     reducer: (draft) => { ... }
 *   }
 * };
 * ```
 */
export type GameMoveDefinitions<
  TState,
  TMoves extends Record<string, any>,
  TCardMeta = any,
  TCardDefinition = any,
> = {
  [K in keyof TMoves]: GameMoveDefinition<TState, TCardMeta, TCardDefinition>;
};
