import type { Draft } from "immer";
import type { HistoryOperations } from "../history/history-operations";
import type { CardOperations } from "../operations/card-operations";
import type { CardRegistry } from "../operations/card-registry";
import type { GameOperations } from "../operations/game-operations";
import type { ZoneOperations } from "../operations/zone-operations";
import type { SeededRNG } from "../rng/seeded-rng";
import type { CardId, PlayerId } from "../types";
import type { MoveEnumerationContext } from "./move-enumeration";

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
 * Move Context Input
 *
 * The context that callers provide when executing a move via engine.executeMove().
 * This is a subset of MoveContext containing only the fields the caller provides.
 * The engine fills in the remaining fields (rng, zones, cards, etc.).
 *
 * @template TParams - Move-specific parameter type (from TMoves[MoveName])
 *
 * @example
 * ```typescript
 * // Execute a move by providing only playerId and params
 * engine.executeMove('playCard', {
 *   playerId: 'p1',
 *   params: { cardId: 'card-123' }
 * });
 * ```
 */
export type MoveContextInput<TParams = any> = {
  /** Player performing this move */
  playerId: PlayerId;

  /**
   * Move-specific parameters (fully typed)
   *
   * Type-safe parameters for this specific move.
   * For moves without parameters (passTurn: void), this is an empty object {}.
   */
  params: TParams;

  /** Source card for this move (e.g., card being played or ability source) */
  sourceCardId?: CardId;

  /** Selected targets (array of arrays for multi-target moves) */
  targets?: string[][];

  /** Timestamp when move was initiated (for deterministic ordering) */
  timestamp?: number;
};

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
   * Game operations API (provided by RuleEngine)
   *
   * Provides methods to interact with game-level state:
   * - setOTP: Mark player as on the play (goes first)
   * - getOTP: Get the OTP player
   * - setPendingMulligan: Set players pending mulligan
   * - getPendingMulligan: Get players pending mulligan
   * - addPendingMulligan: Add player to mulligan list
   * - removePendingMulligan: Remove player from mulligan list
   *
   * These are universal TCG concepts that apply across all card games.
   * This is the ONLY way moves can modify game-level internal state.
   * Always provided by RuleEngine.
   */
  game: GameOperations;

  /**
   * History operations API (provided by RuleEngine)
   *
   * Provides methods to log custom history entries:
   * - log: Add a history entry with custom messages and player-specific visibility
   *
   * Use this to add detailed logging for moves with private information
   * (e.g., card draws, mulligans, hand reveals).
   *
   * Note: The engine automatically creates a base history entry for each move.
   * Use this API to add additional context or player-specific details.
   *
   * Always provided by RuleEngine.
   */
  history: HistoryOperations;

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
   * - endPhase: Trigger phase transition (deferred until after move completes)
   * - endSegment: Trigger segment transition (deferred until after move completes)
   * - endTurn: Trigger turn transition (deferred until after move completes)
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
    currentPlayer?: PlayerId;
    isFirstTurn: boolean;
    endPhase: (phaseName?: string) => void;
    endSegment: () => void;
    endTurn: () => void;
    setCurrentPlayer?: (playerId?: PlayerId) => void;
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
 * Condition Failure Result
 *
 * Detailed information about why a move condition failed.
 * Returned by conditions to provide meaningful error messages to players.
 *
 * @example
 * ```typescript
 * // In a move condition:
 * if (player.mana < card.cost) {
 *   return {
 *     reason: `Not enough mana. Required: ${card.cost}, Available: ${player.mana}`,
 *     errorCode: "INSUFFICIENT_MANA",
 *     context: { required: card.cost, available: player.mana },
 *   };
 * }
 * ```
 */
export type ConditionFailure = {
  /** Human-readable explanation of why the move failed */
  reason: string;
  /** Machine-readable error code for categorization */
  errorCode: string;
  /** Optional additional context for debugging/logging */
  context?: Record<string, unknown>;
};

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
 * @returns True if legal, false for generic failure, or ConditionFailure for detailed error
 *
 * @example
 * ```typescript
 * // Simple boolean validation (backward compatible)
 * condition: (state, context) => {
 *   return state.players[context.playerId].mana >= 5;
 * }
 *
 * // Detailed failure information (recommended)
 * condition: (state, context) => {
 *   const player = state.players[context.playerId];
 *   const cost = 5;
 *
 *   if (player.mana < cost) {
 *     return {
 *       reason: `Not enough mana. Required: ${cost}, Available: ${player.mana}`,
 *       errorCode: "INSUFFICIENT_MANA",
 *       context: { required: cost, available: player.mana },
 *     };
 *   }
 *
 *   return true;
 * }
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
) => boolean | ConditionFailure;

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

  /**
   * Parameter enumerator (for move enumeration system)
   *
   * Optional function to generate candidate parameter combinations.
   * Used by RuleEngine.enumerateMoves() to discover available moves for AI/UI.
   *
   * Each parameter combination returned will be validated against the move's condition.
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
    state: TGameState,
    context: MoveEnumerationContext<TCardMeta, TCardDefinition>,
  ) => TParams[];

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
