import type { FlowDefinition } from "../flow";
import type { GameMoveDefinitions } from "./move-definitions";

/**
 * Player information for game setup
 */
export type Player = {
  /** Unique player identifier */
  id: string;
  /** Optional player name for display */
  name?: string;
};

/**
 * Game end result
 *
 * Returned by endIf when the game has ended.
 */
export type GameEndResult = {
  /** Winner identifier (player ID or special value like 'draw') */
  winner: string;
  /** Reason for game end (for display/logging) */
  reason: string;
  /** Additional metadata about the game end */
  metadata?: Record<string, unknown>;
};

/**
 * GameDefinition Type System
 *
 * Task 10.2: Implement GameDefinition<TState, TMoves> type
 *
 * The core declarative game definition with full type safety.
 * Generic over:
 * - TState: Game state shape
 * - TMoves: Available moves (record of move names to move arg types)
 *
 * @example
 * ```typescript
 * type MyGameState = {
 *   players: Player[];
 *   currentPlayer: number;
 * };
 *
 * type MyMoves = {
 *   playCard: { cardId: string };
 *   pass: {};
 * };
 *
 * const game: GameDefinition<MyGameState, MyMoves> = {
 *   name: 'My Card Game',
 *   minPlayers: 2,
 *   maxPlayers: 4,
 *   setup: (players) => ({
 *     players,
 *     currentPlayer: 0,
 *   }),
 *   moves: {
 *     playCard: {
 *       condition: (state, context) => true,
 *       reducer: (draft, context) => { ... }
 *     },
 *     pass: {
 *       reducer: (draft) => { ... }
 *     }
 *   }
 * };
 * ```
 */
export type GameDefinition<TState, TMoves extends Record<string, any>> = {
  /**
   * Game name for identification and display
   *
   * Task 10.2: Required field
   */
  name: string;

  /**
   * Setup function - creates initial game state
   *
   * Task 10.4: Setup function signature
   *
   * Must be pure and deterministic:
   * - Same players -> same initial state
   * - No side effects
   * - No randomness (use RNG in moves instead)
   *
   * @param players - Array of players in the game
   * @returns Initial game state
   */
  setup: (players: Player[]) => TState;

  /**
   * Moves definition - exhaustive mapping of move names to move definitions
   *
   * Task 10.6: GameMoveDefinitions type with exhaustive mapping
   *
   * Each key in TMoves must have a corresponding GameMoveDefinition.
   * Type system enforces this at compile time.
   */
  moves: GameMoveDefinitions<TState, TMoves>;

  /**
   * Flow definition (optional) - XState-based turn/phase/step orchestration
   *
   * Task 10.8: Flow configuration validation
   *
   * If omitted, game has no built-in flow control.
   * Games can still progress through moves, but no automatic phase transitions.
   */
  flow?: FlowDefinition<TState>;

  /**
   * Game end condition (optional)
   *
   * Task 10.10: EndIf evaluation logic
   *
   * Checked after every move execution.
   * If returns a GameEndResult, the game ends.
   * If returns undefined, game continues.
   *
   * @param state - Current game state
   * @returns GameEndResult if game ended, undefined otherwise
   */
  endIf?: (state: TState) => GameEndResult | undefined;

  /**
   * Player view filter (optional)
   *
   * Task 10.12: PlayerView function signature
   *
   * Filters game state to hide private information from a player.
   * If omitted, all players see complete state.
   *
   * Must be pure and deterministic:
   * - Same state + playerId -> same filtered state
   * - No side effects
   *
   * @param state - Complete game state
   * @param playerId - Player requesting the view
   * @returns Filtered state for this player
   */
  playerView?: (state: TState, playerId: string) => TState;
};
