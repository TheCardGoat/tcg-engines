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

import { createPlayerId, type RuleEngineOptions } from "@tcg/core";
import { LorcanaEngine } from "../engine/lorcana-engine";
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
  public readonly engine: LorcanaEngine;

  // Aliases for compatibility with legacy test patterns
  public readonly authoritativeEngine: LorcanaEngine;
  public readonly playerOneEngine: LorcanaEngine;
  public readonly playerTwoEngine: LorcanaEngine;

  /** Currently active player for move execution */
  private activePlayerEngine: string = PLAYER_ONE;

  constructor(
    _playerOneState: TestInitialState = {},
    _playerTwoState: TestInitialState = {},
    opts: TestEngineOptions = { skipPreGame: true },
  ) {
    // Create players
    const players = [
      { id: PLAYER_ONE, name: "Player One" },
      { id: PLAYER_TWO, name: "Player Two" },
    ];

    // Engine options
    const engineOptions: RuleEngineOptions = {
      seed: opts.seed || "test-seed-123",
    };

    // Create single LorcanaEngine instance
    this.engine = new LorcanaEngine(
      lorcanaGameDefinition,
      players,
      engineOptions,
    );

    // Aliases point to same engine
    this.authoritativeEngine = this.engine;
    this.playerOneEngine = this.engine;
    this.playerTwoEngine = this.engine;

    // TODO: Initialize zones based on playerOneState and playerTwoState
    // This requires zone operations to be available after engine creation

    // If skipPreGame is true, fast-forward to main game
    if (opts.skipPreGame) {
      // Set OTP to skip chooseFirstPlayer phase
      // @ts-expect-error - Accessing internal properties for testing setup
      const internalState = this.engine.internalState;
      if (internalState) {
        internalState.otp = createPlayerId(PLAYER_ONE);
        internalState.pendingMulligan = []; // Clear mulligan requirement
      }

      // Transition to main game segment by accessing flow manager's internal state
      const flowManager = this.engine.getFlowManager();
      if (flowManager) {
        // @ts-expect-error - Accessing private property for testing setup
        flowManager.currentGameSegment = "mainGame";
        // @ts-expect-error - Accessing private property for testing setup
        flowManager.currentPhase = "main";
        // Set current player to PLAYER_ONE
        // @ts-expect-error - Accessing private property for testing setup
        flowManager.currentPlayer = createPlayerId(PLAYER_ONE);
      }
    }
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
   *
   * During startingAGame segment, there is NO turn player until OTP is chosen.
   * During mainGame segment, turn player is the currentPlayer from flow.
   */
  getTurnPlayer(): string | undefined {
    const segment = this.getGameSegment();
    if (segment === "startingAGame") {
      // No turn player during startingAGame until OTP is chosen
      const otp = this.getCtx().otp;
      return otp;
    }

    // During mainGame, turn player is the currentPlayer
    return this.engine.getFlowManager()?.getCurrentPlayer() || undefined;
  }

  /**
   * Get turn number
   */
  getTurnNumber(): number {
    return this.engine.getFlowManager()?.getTurnNumber() || 0;
  }

  /**
   * Get priority players
   *
   * Priority player is who can currently take actions.
   * During startingAGame, priority = currentPlayer (choosingFirstPlayer or OTP for mulligan)
   * During mainGame, priority = turn player
   */
  getPriorityPlayers(): string[] {
    const segment = this.getGameSegment();
    const currentPlayer = this.engine.getFlowManager()?.getCurrentPlayer();

    if (segment === "startingAGame") {
      // During startingAGame, priority = currentPlayer
      // (which is set to choosingFirstPlayer, then OTP for mulligan)
      return currentPlayer ? [currentPlayer] : [];
    }

    // During mainGame, priority = turn player
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

  // ========== Move Enumeration ==========

  /**
   * Get available moves for a player
   *
   * @param playerId - Player to get moves for
   * @returns Array of available move IDs
   */
  getAvailableMoves(playerId: string): string[] {
    return this.engine.getAvailableMoves(createPlayerId(playerId));
  }

  /**
   * Get detailed information about available moves
   *
   * @param playerId - Player to get moves for
   * @returns Array of move information objects
   */
  getAvailableMovesDetailed(playerId: string) {
    return this.engine.getAvailableMovesDetailed(createPlayerId(playerId));
  }

  /**
   * Enumerate valid parameters for a move
   *
   * @param moveId - Move to enumerate parameters for
   * @param playerId - Player attempting the move
   * @returns Valid parameter combinations or null
   */
  enumerateMoveParameters(moveId: string, playerId: string) {
    return this.engine.enumerateMoveParameters(
      moveId as keyof LorcanaMoveParams,
      createPlayerId(playerId),
    );
  }

  /**
   * Get explanation of why a move cannot be executed
   *
   * @param moveId - Move to check
   * @param params - Parameters to use for the move
   * @returns Error information or null
   */
  whyCannotExecuteMove(moveId: string, params: any) {
    return this.engine.whyCannotExecuteMove(
      moveId as keyof LorcanaMoveParams,
      params,
    );
  }

  // ========== Zone Access Helpers ==========

  /**
   * Get zone contents for a player
   *
   * @param zoneName - Name of the zone
   * @param playerId - Player ID
   * @returns Array of card IDs in zone or undefined
   */
  getZone(zoneName: string, playerId: string): string[] | undefined {
    const state = this.engine.getState();
    // @ts-expect-error - Accessing internal state for testing
    const zones = state.zones?.[createPlayerId(playerId)];
    return zones?.[zoneName]?.cards;
  }

  /**
   * Move a card between zones (helper for testing)
   *
   * @param cardId - Card to move
   * @param targetZone - Destination zone
   * @param playerId - Player who owns the card
   */
  moveCard(_cardId: string, _targetZone: string, _playerId: string): void {
    // TODO: Implement zone operations when available
    // For now, this is a stub for tests that need it
    throw new Error("moveCard not yet implemented - zone operations needed");
  }

  // ========== Cleanup ==========

  /**
   * Dispose of resources
   */
  dispose() {
    // No cleanup needed for now
  }
}
