import type { Draft } from "immer";
import type { SeededRNG } from "../rng/seeded-rng";
import type { CardId, PlayerId } from "../types";

/**
 * Context provided to move reducers and conditions
 *
 * Contains all information needed to execute a move:
 * - Player performing the move
 * - Source card (if applicable)
 * - Selected targets
 * - Additional move-specific data
 * - Timestamp for deterministic ordering
 * - RNG for deterministic randomness
 */
export type MoveContext = {
  /** Player performing this move */
  playerId: PlayerId;

  /** Source card for this move (e.g., card being played or ability source) */
  sourceCardId?: CardId;

  /** Selected targets (array of arrays for multi-target moves) */
  targets?: string[][];

  /** Additional move-specific data (choices, amounts, etc.) */
  data?: Record<string, unknown>;

  /** Timestamp when move was initiated (for deterministic ordering) */
  timestamp?: number;

  /** Seeded RNG for deterministic randomness (provided by engine) */
  rng?: SeededRNG;
};

/**
 * Move Reducer Function
 *
 * Pure function that updates game state in response to a move.
 * Operates on Immer draft for immutable updates.
 *
 * @param draft - Immer draft of game state (mutable proxy)
 * @param context - Move context with player, targets, etc.
 *
 * @example
 * ```typescript
 * const drawCardReducer: MoveReducer<GameState> = (draft, context) => {
 *   const player = draft.players[context.playerId];
 *   const card = draft.deck.pop();
 *   if (card) {
 *     player.hand.push(card);
 *   }
 * };
 * ```
 */
export type MoveReducer<TGameState> = (
  draft: Draft<TGameState>,
  context: MoveContext,
) => void;

/**
 * Move Condition Function
 *
 * Pure predicate that determines if a move is legal given current game state.
 * Called BEFORE reducer execution to validate move.
 *
 * @param state - Current game state (readonly)
 * @param context - Move context with player, targets, etc.
 * @returns True if move is legal, false otherwise
 *
 * @example
 * ```typescript
 * const canPlayCardCondition: MoveCondition<GameState> = (state, context) => {
 *   const player = state.players[context.playerId];
 *   const card = context.sourceCardId && state.cards[context.sourceCardId];
 *   return card && player.mana >= card.cost;
 * };
 * ```
 */
export type MoveCondition<TGameState> = (
  state: TGameState,
  context: MoveContext,
) => boolean;

/**
 * Move Definition
 *
 * Declarative definition of a player action in the game.
 * Combines:
 * - Identification (id, name)
 * - Validation (condition)
 * - Execution (reducer)
 * - Metadata (description)
 *
 * @example
 * ```typescript
 * const drawCardMove: MoveDefinition<GameState> = {
 *   id: 'draw-card',
 *   name: 'Draw Card',
 *   description: 'Draw a card from your deck',
 *   condition: (state, context) => {
 *     const player = state.players[context.playerId];
 *     return player.deck.length > 0;
 *   },
 *   reducer: (draft, context) => {
 *     const player = draft.players[context.playerId];
 *     const card = player.deck.pop();
 *     if (card) player.hand.push(card);
 *   }
 * };
 * ```
 */
export type MoveDefinition<TGameState> = {
  /** Unique identifier for this move */
  id: string;

  /** Human-readable name for UI display */
  name: string;

  /** Optional description for tooltips/help */
  description?: string;

  /** Condition that must be true for move to be legal */
  condition?: MoveCondition<TGameState>;

  /** Reducer function that executes the move */
  reducer: MoveReducer<TGameState>;

  /** Optional metadata for categorization */
  metadata?: {
    category?: string;
    tags?: string[];
    [key: string]: unknown;
  };
};

/**
 * Move Result
 *
 * Result of attempting to execute a move.
 * Either succeeds with new state, or fails with error information.
 *
 * @example
 * ```typescript
 * // Success
 * const result: MoveResult<GameState> = {
 *   success: true,
 *   state: newGameState
 * };
 *
 * // Failure
 * const result: MoveResult<GameState> = {
 *   success: false,
 *   error: 'Not enough mana',
 *   errorCode: 'INSUFFICIENT_RESOURCES',
 *   errorContext: { required: 5, available: 3 }
 * };
 * ```
 */
export type MoveResult<TGameState> =
  | {
      /** Move executed successfully */
      success: true;
      /** New game state after move */
      state: TGameState;
      error?: never;
      errorCode?: never;
      errorContext?: never;
    }
  | {
      /** Move failed validation or execution */
      success: false;
      /** Human-readable error message */
      error: string;
      /** Machine-readable error code */
      errorCode?: string;
      /** Additional error context for debugging */
      errorContext?: Record<string, unknown>;
      state?: never;
    };

/**
 * Move Map
 *
 * Collection of move definitions keyed by move ID.
 * Used to define all available moves in a game.
 *
 * @example
 * ```typescript
 * const moves: MoveMap<GameState> = {
 *   'draw-card': drawCardMove,
 *   'play-card': playCardMove,
 *   'attack': attackMove,
 *   'pass': passMove,
 * };
 * ```
 */
export type MoveMap<TGameState> = Record<string, MoveDefinition<TGameState>>;
