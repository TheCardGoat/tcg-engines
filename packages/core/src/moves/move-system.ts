import type { Draft } from "immer";
import type { CardOperations } from "../operations/card-operations";
import type { CardRegistry } from "../operations/card-registry";
import type { ZoneOperations } from "../operations/zone-operations";
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
 * - Zone operations API (for framework-managed zones)
 * - Card operations API (for framework-managed card metadata)
 * - Card registry API (for static card definitions)
 *
 * @template TCardMeta - Game-specific card metadata type
 * @template TCardDefinition - Game-specific card definition type
 */
export type MoveContext<TCardMeta = any, TCardDefinition = any> = {
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

  /**
   * Zone operations API (provided by RuleEngine)
   *
   * Provides methods to interact with the framework's zone management:
   * - moveCard: Move cards between zones
   * - getCardsInZone: Query cards in a zone
   * - shuffleZone: Shuffle a zone
   * - getCardZone: Find which zone contains a card
   *
   * This is the ONLY way moves can modify zone state.
   *
   * Optional for backward compatibility and testing. In production,
   * this is always provided by RuleEngine.
   */
  zones?: ZoneOperations;

  /**
   * Card operations API (provided by RuleEngine)
   *
   * Provides methods to interact with the framework's card metadata:
   * - getCardMeta: Get dynamic card properties
   * - updateCardMeta: Merge metadata updates
   * - setCardMeta: Replace metadata completely
   * - getCardOwner: Get card's owner
   * - queryCards: Find cards by predicate
   *
   * This is the ONLY way moves can modify card metadata.
   *
   * Optional for backward compatibility and testing. In production,
   * this is always provided by RuleEngine.
   */
  cards?: CardOperations<TCardMeta>;

  /**
   * Card registry API (provided by RuleEngine)
   *
   * Provides read-only access to static card definitions:
   * - getCard: Get a card definition by ID
   * - hasCard: Check if a card definition exists
   * - getAllCards: Get all card definitions
   * - queryCards: Find cards by predicate
   * - getCardCount: Get total number of card definitions
   *
   * Use this to access static card properties (name, cost, abilities, etc).
   * For dynamic card state (damage, tapped, etc), use the cards API.
   *
   * Optional for backward compatibility and testing. In production,
   * this is always provided by RuleEngine when card definitions are configured.
   */
  registry?: CardRegistry<TCardDefinition>;
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
export type MoveReducer<TGameState, TCardMeta = any, TCardDefinition = any> = (
  draft: Draft<TGameState>,
  context: MoveContext<TCardMeta, TCardDefinition>,
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
export type MoveCondition<
  TGameState,
  TCardMeta = any,
  TCardDefinition = any,
> = (
  state: TGameState,
  context: MoveContext<TCardMeta, TCardDefinition>,
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
export type MoveDefinition<
  TGameState,
  TCardMeta = any,
  TCardDefinition = any,
> = {
  /** Unique identifier for this move */
  id: string;

  /** Human-readable name for UI display */
  name: string;

  /** Optional description for tooltips/help */
  description?: string;

  /** Condition that must be true for move to be legal */
  condition?: MoveCondition<TGameState, TCardMeta, TCardDefinition>;

  /** Reducer function that executes the move */
  reducer: MoveReducer<TGameState, TCardMeta, TCardDefinition>;

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
export type MoveMap<
  TGameState,
  TCardMeta = any,
  TCardDefinition = any,
> = Record<string, MoveDefinition<TGameState, TCardMeta, TCardDefinition>>;
