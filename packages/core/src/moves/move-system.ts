import type { Draft } from "immer";
import type { CardOperations } from "../operations/card-operations";
import type { CardRegistry } from "../operations/card-registry";
import type { ZoneOperations } from "../operations/zone-operations";
import type { SeededRNG } from "../rng/seeded-rng";
import type { CardId, PlayerId } from "../types";

/**
 * Helper type to normalize move parameters
 *
 * Converts void/undefined to empty object type for moves without parameters.
 * This ensures consistent typing across all moves.
 *
 * @template T - Raw parameter type from TMoves
 */
export type NormalizeParams<T> = T extends void | undefined
  ? Record<string, never>
  : T;

/**
 * Context provided to move reducers and conditions
 *
 * Contains all information needed to execute a move:
 * - Player performing the move
 * - Move-specific parameters (fully typed)
 * - Source card (if applicable)
 * - Selected targets
 * - Timestamp for deterministic ordering
 * - RNG for deterministic randomness
 * - Zone operations API (for framework-managed zones)
 * - Card operations API (for framework-managed card metadata)
 * - Card registry API (for static card definitions)
 *
 * @template TParams - Move-specific parameter type (from TMoves[MoveName])
 * @template TCardMeta - Game-specific card metadata type
 * @template TCardDefinition - Game-specific card definition type
 */
export type MoveContext<
  TParams = any,
  TCardMeta = any,
  TCardDefinition = any,
> = {
  /** Player performing this move */
  playerId: PlayerId;

  /**
   * Move-specific parameters (fully typed)
   *
   * Type-safe parameters for this specific move.
   * For example, playCard receives { cardId: string; alternativeCost?: AlternativeCost }
   *
   * For moves without parameters (passTurn: void), this is an empty object {}.
   */
  params: TParams;

  /** Source card for this move (e.g., card being played or ability source) */
  sourceCardId?: CardId;

  /** Selected targets (array of arrays for multi-target moves) */
  targets?: string[][];

  /** Timestamp when move was initiated (for deterministic ordering) */
  timestamp?: number;

  /** Seeded RNG for deterministic randomness (provided by engine) */
  rng: SeededRNG;

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
   * Always provided by RuleEngine when zones are configured.
   */
  zones: ZoneOperations;

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
   * Always provided by RuleEngine.
   */
  cards: CardOperations<TCardMeta>;

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

  /**
   * Flow state (provided by RuleEngine)
   *
   * Provides access to engine-managed flow state:
   * - currentPhase: Current phase name (from flow definition)
   * - currentSegment: Current segment name within phase (if applicable)
   * - turn: Current turn number (1-indexed)
   * - currentPlayer: Player ID of the active player
   * - isFirstTurn: True if this is turn 1 of the game
   *
   * Games should NOT duplicate this state in their own game state.
   * Access flow information via context.flow instead.
   *
   * Optional for backward compatibility. In production with flow configured,
   * this is always provided by RuleEngine.
   */
  flow?: {
    currentPhase?: string;
    currentSegment?: string;
    turn: number;
    currentPlayer: PlayerId;
    isFirstTurn: boolean;
  };

  /**
   * End the game with a result
   *
   * Call this method to signal game completion. The engine will handle
   * setting the game-ended state and preventing further moves.
   *
   * @param result - Game end result with winner and reason
   *
   * @example
   * ```typescript
   * // In a concede move:
   * context.endGame({
   *   winner: otherPlayerId,
   *   reason: 'concede',
   *   metadata: { concedeBy: context.playerId }
   * });
   * ```
   */
  endGame?: (result: {
    winner?: PlayerId;
    reason: string;
    metadata?: Record<string, unknown>;
  }) => void;

  /**
   * Tracker operations (provided by RuleEngine)
   *
   * Provides API for boolean flags that auto-reset at turn/phase boundaries.
   * Eliminates boilerplate for "hasDrawnThisTurn", "hasPlayedResourceThisTurn", etc.
   *
   * Operations:
   * - check(name, playerId?): Check if tracker is marked
   * - mark(name, playerId?): Mark tracker as true
   * - unmark(name, playerId?): Mark tracker as false
   *
   * Trackers auto-reset based on game definition config.
   *
   * Optional for backward compatibility. In production with trackers configured,
   * this is always provided by RuleEngine.
   *
   * @example
   * ```typescript
   * // Check if player has drawn this turn
   * if (!context.trackers.check('hasDrawn', context.playerId)) {
   *   // Draw a card
   *   context.trackers.mark('hasDrawn', context.playerId);
   * }
   * ```
   */
  trackers?: {
    check(name: string, playerId?: PlayerId): boolean;
    mark(name: string, playerId?: PlayerId): void;
    unmark(name: string, playerId?: PlayerId): void;
  };
};

/**
 * Move Reducer Function
 *
 * Pure function that updates game state in response to a move.
 * Operates on Immer draft for immutable updates.
 *
 * @template TGameState - Game state type
 * @template TParams - Move-specific parameter type (from TMoves[MoveName])
 * @template TCardMeta - Card metadata type
 * @template TCardDefinition - Card definition type
 *
 * @param draft - Immer draft of game state (mutable proxy)
 * @param context - Move context with player, typed params, targets, etc.
 *
 * @example
 * ```typescript
 * type DrawCardParams = { count: number };
 * const drawCardReducer: MoveReducer<GameState, DrawCardParams> = (draft, context) => {
 *   const { count } = context.params; // ✅ Fully typed!
 *   const player = draft.players[context.playerId];
 *   for (let i = 0; i < count; i++) {
 *     const card = draft.deck.pop();
 *     if (card) player.hand.push(card);
 *   }
 * };
 * ```
 */
export type MoveReducer<
  TGameState,
  TParams = any,
  TCardMeta = any,
  TCardDefinition = any,
> = (
  draft: Draft<TGameState>,
  context: MoveContext<TParams, TCardMeta, TCardDefinition>,
) => void;

/**
 * Move Condition Function
 *
 * Pure predicate that determines if a move is legal given current game state.
 * Called BEFORE reducer execution to validate move.
 *
 * @template TGameState - Game state type
 * @template TParams - Move-specific parameter type (from TMoves[MoveName])
 * @template TCardMeta - Card metadata type
 * @template TCardDefinition - Card definition type
 *
 * @param state - Current game state (readonly)
 * @param context - Move context with player, typed params, targets, etc.
 * @returns True if move is legal, false otherwise
 *
 * @example
 * ```typescript
 * type PlayCardParams = { cardId: string; cost?: number };
 * const canPlayCardCondition: MoveCondition<GameState, PlayCardParams> = (state, context) => {
 *   const { cardId, cost } = context.params; // ✅ Fully typed!
 *   const player = state.players[context.playerId];
 *   const card = state.cards[cardId];
 *   return card && player.mana >= (cost ?? card.cost);
 * };
 * ```
 */
export type MoveCondition<
  TGameState,
  TParams = any,
  TCardMeta = any,
  TCardDefinition = any,
> = (
  state: TGameState,
  context: MoveContext<TParams, TCardMeta, TCardDefinition>,
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
 * @template TGameState - Game state type
 * @template TParams - Move-specific parameter type
 * @template TCardMeta - Card metadata type
 * @template TCardDefinition - Card definition type
 *
 * @example
 * ```typescript
 * type DrawCardParams = { count?: number };
 * const drawCardMove: MoveDefinition<GameState, DrawCardParams> = {
 *   id: 'draw-card',
 *   name: 'Draw Card',
 *   description: 'Draw cards from your deck',
 *   condition: (state, context) => {
 *     const { count = 1 } = context.params; // ✅ Typed params!
 *     const player = state.players[context.playerId];
 *     return player.deck.length >= count;
 *   },
 *   reducer: (draft, context) => {
 *     const { count = 1 } = context.params; // ✅ Typed params!
 *     const player = draft.players[context.playerId];
 *     for (let i = 0; i < count; i++) {
 *       const card = player.deck.pop();
 *       if (card) player.hand.push(card);
 *     }
 *   }
 * };
 * ```
 */
export type MoveDefinition<
  TGameState,
  TParams = any,
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
  condition?: MoveCondition<TGameState, TParams, TCardMeta, TCardDefinition>;

  /** Reducer function that executes the move */
  reducer: MoveReducer<TGameState, TParams, TCardMeta, TCardDefinition>;

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
 * Note: This is a legacy type for backward compatibility.
 * For type-safe moves, use GameMoveDefinitions from game-definition/move-definitions.ts
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
  TParams = any,
  TCardMeta = any,
  TCardDefinition = any,
> = Record<
  string,
  MoveDefinition<TGameState, TParams, TCardMeta, TCardDefinition>
>;
