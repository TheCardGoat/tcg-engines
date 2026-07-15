/**
 * Move Enumeration System
 *
 * Provides types and interfaces for enumerating all possible moves
 * with their valid parameters. This enables AI agents and UI components
 * to discover available actions at any game state.
 *
 * @packageDocumentation
 */

import type { CardOperations } from "../operations/card-operations";
import type { CardRegistry } from "../operations/card-registry";
import type { CounterOperations } from "../operations/counter-operations";
import type { GameOperations } from "../operations/game-operations";
import type { ZoneOperations } from "../operations/zone-operations";
import type { SeededRNG } from "../rng/seeded-rng";
import type { CardId, PlayerId } from "../types";

/**
 * Enumerated Move Result
 *
 * Represents a single valid move with all its parameter values.
 * Returned by RuleEngine.enumerateMoves() for each possible move + parameter combination.
 *
 * @template TParams - Move-specific parameter type
 *
 * @example
 * ```typescript
 * const moves = engine.enumerateMoves(playerId, { validOnly: true });
 * for (const move of moves) {
 *   console.log(`${move.moveId}:`, move.params);
 *   if (move.isValid) {
 *     // Execute the move
 *     engine.executeMove(move.moveId, {
 *       playerId: move.playerId,
 *       params: move.params
 *     });
 *   }
 * }
 * ```
 */
export interface EnumeratedMove<TParams = unknown> {
  /** Move identifier */
  moveId: string;

  /** Player who can execute this move */
  playerId: PlayerId;

  /** Fully populated parameters for this move */
  params: TParams;

  /** Optional source card for this move */
  sourceCardId?: CardId;

  /** Optional targets for this move */
  targets?: string[][];

  /** Whether this move is currently valid (passed condition check) */
  isValid: boolean;

  /** If not valid, reason for failure */
  validationError?: {
    reason: string;
    errorCode: string;
    context?: Record<string, unknown>;
  };

  /** Optional metadata for UI/AI consumption */
  metadata?: {
    displayName?: string;
    description?: string;
    category?: string;
    priority?: number;
    [key: string]: unknown;
  };
}

/**
 * Enumeration Context
 *
 * Provided to enumerator functions, contains all information needed
 * to discover valid parameters. Similar to MoveContext but focused on
 * read-only operations for parameter discovery.
 *
 * @template TCardMeta - Card metadata type
 * @template TCardDefinition - Card definition type
 *
 * @example
 * ```typescript
 * const enumerator: MoveEnumerator<GameState, PlayCardParams> = (state, context) => {
 *   // Get all cards in player's hand
 *   const handCards = context.zones.getCardsInZone('hand', context.playerId);
 *
 *   // Generate parameter combination for each card
 *   return handCards.map(cardId => ({ cardId }));
 * };
 * ```
 */
export interface MoveEnumerationContext<TCardMeta = unknown, TCardDefinition = unknown> {
  /** Player to enumerate moves for */
  playerId: PlayerId;

  /** Zone operations for querying card locations */
  zones: ZoneOperations;

  /** Card operations for querying card state */
  cards: CardOperations<TCardMeta>;

  /** Game operations for game-level state */
  game: GameOperations;

  /** Counter operations for querying card counters/flags */
  counters: CounterOperations;

  /** Card registry for static card definitions */
  registry?: CardRegistry<TCardDefinition>;

  /** Flow state (turn, phase, segment) */
  flow?: {
    currentPhase?: string;
    currentSegment?: string;
    turn: number;
    currentPlayer?: PlayerId;
    isFirstTurn: boolean;
  };

  /** RNG for deterministic enumeration if needed */
  rng: SeededRNG;
}

/**
 * Move Enumerator Function
 *
 * Game-provided function that generates all possible parameter combinations
 * for a given move. Returns an array of parameter objects.
 *
 * Each parameter object returned will be validated against the move's condition
 * and included in the enumeration results.
 *
 * @template TGameState - Game state type
 * @template TParams - Move-specific parameter type
 * @template TCardMeta - Card metadata type
 * @template TCardDefinition - Card definition type
 *
 * @param state - Current game state (readonly)
 * @param context - Enumeration context with player, operations, etc.
 * @returns Array of possible parameter combinations
 *
 * @example
 * ```typescript
 * // Simple card play enumerator
 * const playCardEnumerator: MoveEnumerator<GameState, PlayCardParams> = (state, context) => {
 *   const handCards = context.zones.getCardsInZone('hand', context.playerId);
 *   return handCards.map(cardId => ({ cardId }));
 * };
 *
 * // Attack enumerator with multiple targets
 * const attackEnumerator: MoveEnumerator<GameState, AttackParams> = (state, context) => {
 *   const results: AttackParams[] = [];
 *   const attackers = context.zones.getCardsInZone('field', context.playerId);
 *
 *   for (const attackerId of attackers) {
 *     const targets = getValidTargets(state, attackerId);
 *     for (const targetId of targets) {
 *       results.push({ attackerId, targetId });
 *     }
 *   }
 *
 *   return results;
 * };
 * ```
 */
export type MoveEnumerator<
  TGameState,
  TParams = unknown,
  TCardMeta = unknown,
  TCardDefinition = unknown,
> = (state: TGameState, context: MoveEnumerationContext<TCardMeta, TCardDefinition>) => TParams[];

/**
 * Move Enumeration Options
 *
 * Configuration for enumeration behavior.
 *
 * @example
 * ```typescript
 * // Get only valid moves
 * const validMoves = engine.enumerateMoves(playerId, {
 *   validOnly: true
 * });
 *
 * // Get all moves with metadata
 * const allMoves = engine.enumerateMoves(playerId, {
 *   validOnly: false,
 *   includeMetadata: true
 * });
 *
 * // Enumerate specific moves only
 * const attackMoves = engine.enumerateMoves(playerId, {
 *   moveIds: ['attack', 'special-attack'],
 *   validOnly: true
 * });
 *
 * // Limit results per move
 * const limitedMoves = engine.enumerateMoves(playerId, {
 *   maxPerMove: 10  // Max 10 parameter combinations per move
 * });
 * ```
 */
export interface MoveEnumerationOptions {
  /** Only return valid moves (passed condition check). Default: false */
  validOnly?: boolean;

  /** Include metadata in results. Default: false */
  includeMetadata?: boolean;

  /** Filter to specific move IDs. Default: all moves */
  moveIds?: string[];

  /** Maximum number of results per move (optional limit) */
  maxPerMove?: number;
}
