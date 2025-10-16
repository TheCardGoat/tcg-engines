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

import {
  createPlayerId,
  createZoneOperations,
  RuleEngine,
  type RuleEngineOptions,
} from "@tcg/core";
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

    // Initialize zones with test cards
    this.initializeZones(_playerOneState, _playerTwoState);
  }

  /**
   * Initialize zones with test cards
   *
   * BACKDOOR for testing: Accesses RuleEngine internal state to populate zones
   * before any moves execute. This violates encapsulation but is necessary for
   * AAA testing (Arrange-Act-Assert) where board state must be set up before moves.
   *
   * TODO: @tcg/core should expose a proper TestEngine base class with this capability
   */
  private initializeZones(
    playerOneState: TestInitialState,
    playerTwoState: TestInitialState,
  ) {
    // Access internal state directly (testing backdoor)
    const internalState = (this.engine as any).internalState;

    if (!internalState) {
      throw new Error("Cannot access engine internal state for test setup");
    }

    // Add safety check for expected internal structure
    if (!(internalState.zones && internalState.cards)) {
      throw new Error("Engine internal state structure has changed");
    }

    // Create zone operations using internal state
    const zoneOps = createZoneOperations(internalState);

    // Create cards for player one
    if (playerOneState.hand) {
      zoneOps.createDeck({
        zoneId: "hand" as any,
        playerId: createPlayerId(PLAYER_ONE),
        cardCount: playerOneState.hand,
        shuffle: false,
      });
    }

    if (playerOneState.deck) {
      zoneOps.createDeck({
        zoneId: "deck" as any,
        playerId: createPlayerId(PLAYER_ONE),
        cardCount: playerOneState.deck,
        shuffle: true, // Shuffle deck by default
      });
    }

    if (playerOneState.play) {
      zoneOps.createDeck({
        zoneId: "play" as any,
        playerId: createPlayerId(PLAYER_ONE),
        cardCount: playerOneState.play,
        shuffle: false,
      });
    }

    if (playerOneState.inkwell) {
      zoneOps.createDeck({
        zoneId: "inkwell" as any,
        playerId: createPlayerId(PLAYER_ONE),
        cardCount: playerOneState.inkwell,
        shuffle: false,
      });
    }

    // Create cards for player two
    if (playerTwoState.hand) {
      zoneOps.createDeck({
        zoneId: "hand" as any,
        playerId: createPlayerId(PLAYER_TWO),
        cardCount: playerTwoState.hand,
        shuffle: false,
      });
    }

    if (playerTwoState.deck) {
      zoneOps.createDeck({
        zoneId: "deck" as any,
        playerId: createPlayerId(PLAYER_TWO),
        cardCount: playerTwoState.deck,
        shuffle: true,
      });
    }

    if (playerTwoState.play) {
      zoneOps.createDeck({
        zoneId: "play" as any,
        playerId: createPlayerId(PLAYER_TWO),
        cardCount: playerTwoState.play,
        shuffle: false,
      });
    }

    if (playerTwoState.inkwell) {
      zoneOps.createDeck({
        zoneId: "inkwell" as any,
        playerId: createPlayerId(PLAYER_TWO),
        cardCount: playerTwoState.inkwell,
        shuffle: false,
      });
    }
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

  // ========== Zone Access Helpers ==========

  /**
   * Get cards in a zone for a player
   */
  getZone(zoneId: string, playerId: string): string[] {
    // Access internal state directly (testing backdoor)
    const internalState = (this.engine as any).internalState;

    if (!internalState) {
      return [];
    }

    // Add safety check for expected internal structure
    if (!(internalState.zones && internalState.cards)) {
      console.warn("Engine internal state structure has changed");
      return [];
    }

    // Create zone operations using internal state
    const zoneOps = createZoneOperations(internalState);

    return zoneOps.getCardsInZone(zoneId as any, createPlayerId(playerId));
  }

  // ========== Cleanup ==========

  /**
   * Dispose of resources
   */
  dispose() {
    // No cleanup needed for now
  }
}
