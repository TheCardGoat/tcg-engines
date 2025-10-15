import type { Draft } from "immer";
import type { MoveContext, NormalizeParams } from "../moves/move-system";

/**
 * Game Move Definition
 *
 * Task 10.5, 10.6: Implement GameMoveDefinition with reducer and optional condition
 *
 * Declarative definition of a single move/action in the game.
 * Each move has:
 * - A reducer function (required) - executes the move with typed parameters
 * - An optional condition function - validates if move is legal
 * - Optional metadata - for categorization, UI, etc.
 *
 * @template TState - Game state type
 * @template TParams - Move-specific parameter type (from TMoves[MoveName])
 * @template TCardMeta - Card metadata type (for zone/card operations)
 * @template TCardDefinition - Card definition type (for registry access)
 */
export type GameMoveDefinition<
  TState,
  TParams = any,
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
   * The context includes fully-typed parameters specific to this move.
   *
   * @param draft - Immer draft (mutable proxy) of game state
   * @param context - Move context (player, typed params, targets, timestamp, zones, cards, registry)
   *
   * @example
   * ```typescript
   * // For a move: playCard: { cardId: string; alternativeCost?: AlternativeCost }
   * reducer: (draft, context) => {
   *   const { cardId, alternativeCost } = context.params; // ✅ Fully typed!
   *   // Implementation...
   * }
   * ```
   */
  reducer: (
    draft: Draft<TState>,
    context: MoveContext<NormalizeParams<TParams>, TCardMeta, TCardDefinition>,
  ) => void;

  /**
   * Move condition - validates if move is legal
   *
   * Task 10.6: Optional condition for validation
   *
   * Pure predicate checked BEFORE reducer execution.
   * If returns false, move is rejected without state changes.
   *
   * The context includes fully-typed parameters specific to this move.
   *
   * @param state - Current game state (readonly)
   * @param context - Move context (player, typed params, targets, timestamp, zones, cards, registry)
   * @returns True if move is legal, false otherwise
   *
   * @example
   * ```typescript
   * // For a move: playCard: { cardId: string; alternativeCost?: AlternativeCost }
   * condition: (state, context) => {
   *   const { cardId, alternativeCost } = context.params; // ✅ Fully typed!
   *   // Validation logic...
   * }
   * ```
   */
  condition?: (
    state: TState,
    context: MoveContext<NormalizeParams<TParams>, TCardMeta, TCardDefinition>,
  ) => boolean | import("../moves/move-system").ConditionFailure;

  /**
   * Parameter enumerator (for move enumeration system)
   *
   * Optional function to generate all valid parameter combinations.
   * Used by RuleEngine.enumerateMoves() to discover available moves for AI/UI.
   *
   * If not provided, move will still appear in enumeration results
   * but will indicate that parameters are required.
   *
   * @example
   * ```typescript
   * enumerator: (state, context) => {
   *   // Get all cards in player's hand
   *   const handCards = context.zones.getCardsInZone('hand', context.playerId);
   *   // Generate parameter for each card
   *   return handCards.map(cardId => ({ cardId }));
   * }
   * ```
   */
  enumerator?: (
    state: TState,
    context: import("../moves/move-enumeration").MoveEnumerationContext<
      TCardMeta,
      TCardDefinition
    >,
  ) => TParams[];

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
 * Game Move Definitions - Exhaustive mapping of moves with type-safe parameters
 *
 * Task 10.6: GameMoveDefinitions type with exhaustive mapping
 *
 * Maps each move name in TMoves to its GameMoveDefinition with the correct parameter type.
 * TypeScript enforces that:
 * - All moves in TMoves have definitions
 * - No extra moves are defined
 * - Each definition has the correct parameter type (TMoves[K])
 * - Reducers and conditions receive fully-typed parameters via context.params
 *
 * @template TState - Game state type
 * @template TMoves - Record of move names to parameter types
 * @template TCardMeta - Card metadata type
 * @template TCardDefinition - Card definition type
 *
 * @example
 * ```typescript
 * type MyMoves = {
 *   playCard: { cardId: string; cost?: number };
 *   quest: { cardId: string };
 *   pass: void;
 * };
 *
 * const moves: GameMoveDefinitions<GameState, MyMoves> = {
 *   playCard: {
 *     condition: (state, context) => {
 *       const { cardId, cost } = context.params; // ✅ Typed as { cardId: string; cost?: number }
 *       return true;
 *     },
 *     reducer: (draft, context) => {
 *       const { cardId, cost } = context.params; // ✅ Typed as { cardId: string; cost?: number }
 *       // Implementation...
 *     }
 *   },
 *   quest: {
 *     reducer: (draft, context) => {
 *       const { cardId } = context.params; // ✅ Typed as { cardId: string }
 *       // Implementation...
 *     }
 *   },
 *   pass: {
 *     reducer: (draft, context) => {
 *       // context.params is {} (empty object)
 *       // Implementation...
 *     }
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
  [K in keyof TMoves]: GameMoveDefinition<
    TState,
    TMoves[K], // ✅ Each move gets its specific parameter type!
    TCardMeta,
    TCardDefinition
  >;
};
