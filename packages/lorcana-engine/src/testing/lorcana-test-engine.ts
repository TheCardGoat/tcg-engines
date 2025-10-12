/**
 * Lorcana Test Engine
 *
 * Convenient test wrapper around RuleEngine for testing Lorcana games.
 * Provides ergonomic API similar to legacy test engine while using @tcg/core framework.
 *
 * Features:
 * - Multiple engine instances (authoritative + player engines) for realistic testing
 * - Simple board state setup ({ hand: 7, deck: 10 })
 * - Convenient move execution methods
 * - State inspection helpers
 * - Automatic state synchronization checks
 */

import { createPlayerId, RuleEngine, type RuleEngineOptions } from "@tcg/core";
import { lorcanaGameDefinition } from "../game-definition/definition";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../types/move-params";

// Export player ID constants for tests
export const PLAYER_ONE = "player_one";
export const PLAYER_TWO = "player_two";

/**
 * Test Initial State
 *
 * Simple zone configuration for setting up test games
 */
export type TestInitialState = {
  /** Number of cards in hand */
  hand?: number;
  /** Number of cards in deck */
  deck?: number;
  /** Number of cards in play */
  play?: number;
  /** Number of cards in inkwell */
  inkwell?: number;
  /** Number of cards in discard */
  discard?: number;
  /** Starting lore */
  lore?: number;
};

/**
 * Test Engine Options
 */
export type TestEngineOptions = {
  /** Skip pre-game phase (start directly in main game) */
  skipPreGame?: boolean;
  /** Optional RNG seed for deterministic tests */
  seed?: string;
  /** Enable debug logging */
  debug?: boolean;
};

/**
 * Lorcana Test Engine
 *
 * Wraps a single RuleEngine for testing.
 *
 * Note: In the future, this could be extended to use multiple engines
 * (authoritative + client engines) for more realistic multiplayer testing,
 * but that requires syncing internal state which is complex.
 */
export class LorcanaTestEngine {
  /** Single authoritative engine */
  public readonly engine: RuleEngine<
    LorcanaGameState,
    LorcanaMoveParams,
    unknown,
    LorcanaCardMeta
  >;

  // Aliases for compatibility with legacy test patterns
  public readonly authoritativeEngine: RuleEngine<
    LorcanaGameState,
    LorcanaMoveParams,
    unknown,
    LorcanaCardMeta
  >;
  public readonly playerOneEngine: RuleEngine<
    LorcanaGameState,
    LorcanaMoveParams,
    unknown,
    LorcanaCardMeta
  >;
  public readonly playerTwoEngine: RuleEngine<
    LorcanaGameState,
    LorcanaMoveParams,
    unknown,
    LorcanaCardMeta
  >;

  /** Currently active player for move execution */
  private activePlayerEngine: string = PLAYER_ONE;

  constructor(
    _playerOneState: TestInitialState = {},
    _playerTwoState: TestInitialState = {},
    _opts: TestEngineOptions = { skipPreGame: true },
  ) {
    // Create players
    const players = [
      { id: PLAYER_ONE, name: "Player One" },
      { id: PLAYER_TWO, name: "Player Two" },
    ];

    // Engine options
    const engineOptions: RuleEngineOptions = {
      seed: _opts.seed || "test-seed-123",
    };

    // Create single engine instance
    this.engine = new RuleEngine(lorcanaGameDefinition, players, engineOptions);

    // Aliases point to same engine
    this.authoritativeEngine = this.engine;
    this.playerOneEngine = this.engine;
    this.playerTwoEngine = this.engine;

    // TODO: Initialize zones based on playerOneState and playerTwoState
    // This requires zone operations to be available after engine creation
  }

  // ========== Engine Selection ==========

  /**
   * Get the currently active engine (always returns the same engine)
   */
  private get activeEngine() {
    return this.engine;
  }

  /**
   * Change the active player (for move execution)
   */
  changeActivePlayer(playerId: string) {
    if (playerId !== PLAYER_ONE && playerId !== PLAYER_TWO) {
      throw new Error(`Invalid player ID: ${playerId}`);
    }
    this.activePlayerEngine = playerId;
    return this; // For chaining
  }

  // ========== State Inspection ==========

  /**
   * Get game state
   */
  getState(): LorcanaGameState {
    return this.engine.getState();
  }

  /**
   * Get context/flow state
   * Uses FlowManager to get current phase, segment, turn, etc.
   *
   * Note: Since RuleEngine doesn't expose internal state directly,
   * we access it via type casting. This is acceptable for test utilities.
   */
  getCtx() {
    const flowManager = this.engine.getFlowManager();
    if (!flowManager) {
      throw new Error("No flow manager available");
    }

    // Access internal state for test purposes
    // @ts-expect-error - Accessing private property for testing
    const internalState = this.engine.internalState;

    return {
      currentPhase: flowManager.getCurrentPhase(),
      currentSegment: flowManager.getCurrentSegment(),
      turnNumber: flowManager.getTurnNumber(),
      currentPlayer: flowManager.getCurrentPlayer(),
      otp: internalState?.otp,
      choosingFirstPlayer: internalState?.choosingFirstPlayer,
      pendingMulligan: internalState?.pendingMulligan,
    };
  }

  /**
   * Get current game segment
   */
  getGameSegment(): string | undefined {
    return this.engine.getFlowManager()?.getCurrentSegment();
  }

  /**
   * Get current game phase
   */
  getGamePhase(): string | undefined {
    return this.engine.getFlowManager()?.getCurrentPhase();
  }

  /**
   * Get current turn player
   */
  getTurnPlayer(): string {
    return this.engine.getFlowManager()?.getCurrentPlayer() || "";
  }

  /**
   * Get turn number
   */
  getTurnNumber(): number {
    return this.engine.getFlowManager()?.getTurnNumber() || 0;
  }

  /**
   * Get priority players
   * Note: This is a placeholder - actual priority logic depends on flow/phase
   */
  getPriorityPlayers(): string[] {
    // In Lorcana, priority usually belongs to the active player
    // This is a simplified implementation
    const turnPlayer = this.getTurnPlayer();
    return turnPlayer ? [turnPlayer] : [];
  }

  // ========== Move Execution ==========

  /**
   * Execute a move
   */
  private executeMove(moveId: keyof LorcanaMoveParams, params: any) {
    const playerId = createPlayerId(this.activePlayerEngine);

    // Execute on engine
    const result = this.engine.executeMove(moveId, {
      playerId,
      params,
    });

    if (!result.success) {
      throw new Error(`Move failed: ${result.error}`);
    }

    return result;
  }

  // ========== Setup Moves ==========

  /**
   * Choose who goes first
   */
  chooseWhoGoesFirst(playerId: string) {
    return this.executeMove("chooseWhoGoesFirstMove", {
      playerId: createPlayerId(playerId),
    });
  }

  /**
   * Alter hand (mulligan)
   */
  alterHand(cardsToMulligan: string[]) {
    const playerId = createPlayerId(this.activePlayerEngine);
    return this.executeMove("alterHand", {
      playerId,
      cardsToMulligan,
    });
  }

  // ========== Cleanup ==========

  /**
   * Dispose of resources
   */
  dispose() {
    // No cleanup needed for now
  }
}
