import {
  createCardId,
  createCardOperations,
  createPlayerId,
  createZoneOperations,
  type RuleEngineOptions,
} from "@tcg/core";
import type {
  BaseCardDefinition,
  CommandCardDefinition,
  CardDefinition as GundamCardDefinition,
  PilotCardDefinition,
  UnitCardDefinition,
} from "../cards/card-types";
import { GundamEngine } from "../engine/gundam-engine";
import { gundamGameDefinition } from "../game-definition/definition";
import type { GundamCardMeta, GundamGameState, GundamMoves } from "../types";

// Union of engine types and types package types for compatibility
type GundamCardDefinitionInput =
  | GundamCardDefinition
  | UnitCardDefinition
  | PilotCardDefinition
  | CommandCardDefinition
  | BaseCardDefinition;

// Export player ID constants for tests
export const PLAYER_ONE = createPlayerId("player_one");
export const PLAYER_TWO = createPlayerId("player_two");

/**
 * Test Initial State
 *
 * Simple zone configuration for setting up test games.
 * Zones can be configured with either a number (to create placeholder cards)
 * or an array of GundamCardDefinitionInput (to create cards with actual definitions).
 */
export type TestInitialState = {
  /** Cards in hand - number or card definitions */
  hand?: number | GundamCardDefinitionInput[];
  /** Cards in deck - number or card definitions */
  deck?: number | GundamCardDefinitionInput[];
  /** Cards in play - number or card definitions */
  play?: number | GundamCardDefinitionInput[];
  /** Cards in resource area - number or card definitions */
  resourceArea?: number | GundamCardDefinitionInput[];
  /** Cards in discard - number or card definitions */
  discard?: number | GundamCardDefinitionInput[];
};

/**
 * Test Card Definition
 *
 * Minimal card definition for testing combat and stats
 */
export type TestCardDefinition = {
  id: string;
  name?: string;
  ap?: number;
  hp?: number;
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
  /** Optional card definitions for testing (with stats like strength, willpower) */
  cardDefinitions?: Record<string, TestCardDefinition>;
};

/**
 * Test Card Model
 *
 * Wraps a card definition and provides keyword checking methods.
 * Used for testing that cards have the expected keywords.
 */
export class TestCardModel {
  constructor(private readonly card: GundamCardDefinitionInput) {}
}

export class GundamTestEngine {
  public readonly engine: GundamEngine;

  // Aliases for compatibility with legacy test patterns
  public readonly authoritativeEngine: GundamEngine;
  public readonly playerOneEngine: GundamEngine;
  public readonly playerTwoEngine: GundamEngine;

  // Currently active player for move execution
  private activePlayerEngine: string = PLAYER_ONE;

  // Card definitions registry (mutable for dynamic card creation in tests)
  private cardDefinitions: Record<string, TestCardDefinition> = {};

  // Counter for generating unique card IDs
  private cardCounter = 0;

  // Registry of Gundam card definitions placed in play (for getCardModel)
  private playedCardDefinitions: Map<string, GundamCardDefinitionInput> =
    new Map();

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
    const gameDefinition = {
      ...gundamGameDefinition,
    };
    // Create single engine instance
    this.engine = new GundamEngine(gameDefinition, players, opts);

    // Aliases point to same engine
    this.authoritativeEngine = this.engine;
    this.playerOneEngine = this.engine;
    this.playerTwoEngine = this.engine;

    // Initialize zones with test cards
    this.initializeZones(_playerOneState, _playerTwoState);

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
   * Check if a zone value is an array of card definitions
   */
  private isCardDefinitionsArray(
    value: number | GundamCardDefinitionInput[] | undefined,
  ): value is GundamCardDefinitionInput[] {
    return Array.isArray(value);
  }

  /**
   * Initialize zones with test cards
   *
   * BACKDOOR for testing: Accesses RuleEngine internal state to populate zones
   * before any moves execute. This violates encapsulation but is necessary for
   * AAA testing (Arrange-Act-Assert) where board state must be set up before moves.
   *
   * Supports both:
   * - Numbers: Creates placeholder cards (e.g., { hand: 7 })
   * - Card definitions: Creates real cards with the provided definitions (e.g., { play: [heiheiCard] })
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

    // Create zone operations and card operations using internal state
    const zoneOps = createZoneOperations(internalState);
    const cardOps = createCardOperations(internalState);

    // Helper to initialize metadata for created cards
    const initializeCardMetadata = (cardIds: string[]) => {
      for (const cardId of cardIds) {
        // Initialize with default Gundam card metadata
        cardOps.setCardMeta(createCardId(cardId), {
          damage: 0,
          state: "ready",
        } as any);
      }
    };

    // Helper to initialize a zone with either a number or card definitions
    const initializeZone = (
      zoneId: string,
      playerId: string,
      value: number | GundamCardDefinitionInput[] | undefined,
      shuffle: boolean,
    ) => {
      if (value === undefined) return;

      if (this.isCardDefinitionsArray(value)) {
        // Handle card definitions array
        for (const cardDef of value) {
          // Register the card definition for getCardModel lookup
          this.playedCardDefinitions.set(cardDef.id, cardDef);
        }
        // Create placeholder cards for the count (cards are registered for keyword lookup)
        const cardIds = zoneOps.createDeck({
          zoneId: zoneId as any,
          playerId: createPlayerId(playerId),
          cardCount: value.length,
          shuffle,
        });
        initializeCardMetadata(cardIds);
      } else {
        // Handle number - create placeholder cards
        const cardIds = zoneOps.createDeck({
          zoneId: zoneId as any,
          playerId: createPlayerId(playerId),
          cardCount: value,
          shuffle,
        });
        initializeCardMetadata(cardIds);
      }
    };

    // Initialize zones for player one
    initializeZone("hand", PLAYER_ONE, playerOneState.hand, false);
    initializeZone("deck", PLAYER_ONE, playerOneState.deck, true);
    initializeZone("play", PLAYER_ONE, playerOneState.play, false);
    initializeZone("discard", PLAYER_ONE, playerOneState.discard, false);

    // Initialize zones for player two
    initializeZone("hand", PLAYER_TWO, playerTwoState.hand, false);
    initializeZone("deck", PLAYER_TWO, playerTwoState.deck, true);
    initializeZone("play", PLAYER_TWO, playerTwoState.play, false);
    initializeZone("discard", PLAYER_TWO, playerTwoState.discard, false);
  }

  /**
   * Get a TestCardModel for a card definition
   *
   * Returns a wrapper around the card definition that provides keyword checking methods.
   */
  getCardModel(cardDef: GundamCardDefinitionInput): TestCardModel {
    // Prefer the engine-registered definition if it exists, as it may have additional state
    const registered = this.playedCardDefinitions.get(cardDef.id);
    const cardDefToUse = registered ?? cardDef;
    return new TestCardModel(cardDefToUse);
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
  getState(): GundamGameState {
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

    // Access tracker system for test purposes
    // @ts-expect-error - Accessing private property for testing
    const trackerSystem = this.engine.trackerSystem;

    return {
      currentPhase: flowManager.getCurrentPhase(),
      currentSegment: flowManager.getCurrentSegment(),
      turnNumber: flowManager.getTurnNumber(),
      currentPlayer: flowManager.getCurrentPlayer(),
      otp: internalState?.otp,
      choosingFirstPlayer: internalState?.choosingFirstPlayer,
      pendingMulligan: internalState?.pendingMulligan,
      trackers: trackerSystem
        ? {
            check: (name: string, playerId: any) =>
              trackerSystem.check(name, playerId),
            mark: (name: string, playerId: any) =>
              trackerSystem.mark(name, playerId),
            unmark: (name: string, playerId: any) =>
              trackerSystem.unmark(name, playerId),
          }
        : undefined,
      flow: {
        currentPhase: flowManager.getCurrentPhase(),
      },
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
  private executeMove(moveId: keyof GundamMoves, params: any) {
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
   * Attack with a unit (combat)
   */
  attack(attackerId: string, targetId: string) {
    return this.executeMove("attack", {
      attackerId,
      targetId,
    });
  }

  // ========== Standard Moves ==========

  /**
   * Pass turn to next player
   *
   * Automatically syncs activePlayerEngine with flow manager's current player
   * after turn transition completes.
   */
  pass() {
    const result = this.executeMove("pass", {});

    // Sync activePlayerEngine with flow manager's current player
    // This ensures subsequent moves execute as the correct player
    const currentPlayer = this.engine.getFlowManager()?.getCurrentPlayer();
    if (currentPlayer) {
      this.activePlayerEngine = currentPlayer;
    }

    return result;
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
      moveId as keyof GundamMoves,
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
      moveId as keyof GundamMoves,
      params,
    );
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

  /**
   * Get damage on a card
   */
  getDamage(cardId: string): number {
    // Access internal state directly (testing backdoor)
    const internalState = (this.engine as any).internalState;

    if (!internalState) {
      return 0;
    }

    // Get card metadata which tracks damage
    const cardMeta = internalState?.cardMetas?.[cardId];
    return cardMeta?.damage || 0;
  }

  /**
   * Get card metadata (for testing)
   */
  getCardMeta(cardId: string): GundamCardMeta | undefined {
    // Access internal state directly (testing backdoor)
    const internalState = (this.engine as any).internalState;

    if (!internalState) {
      return undefined;
    }

    return internalState?.cardMetas?.[cardId];
  }

  /**
   * Create a test character in play with specific stats
   *
   * BACKDOOR for testing: Creates a character card with stats directly in play zone.
   * Useful for testing combat mechanics that require ap/hp.
   *
   * @param playerId - Player who owns the character
   * @param stats - Character stats (ap, hp, etc.)
   * @returns Card ID of the created character
   */
  createCharacterInPlay(
    playerId: string,
    stats: { ap?: number; hp?: number; cost?: number } = {},
  ): string {
    // Access internal state directly (testing backdoor)
    const internalState = (this.engine as any).internalState;

    if (!internalState) {
      throw new Error("Cannot access engine internal state for test setup");
    }

    const pid = createPlayerId(playerId);

    // Generate unique card ID using counter
    const cardId = `test-character-${this.cardCounter++}`;

    // Manually add card to zone (bypassing createDeck which generates deterministic IDs)
    // Access internal state to directly add card
    if (!internalState.zones["play"]) {
      throw new Error("Play zone not found");
    }
    internalState.zones["play"].cardIds.push(cardId);
    internalState.cards[cardId] = {
      definitionId: "placeholder",
      owner: pid,
      controller: pid,
      zone: "play" as any,
      position: internalState.zones["play"].cardIds.length - 1,
    };

    // Add card definition to registry (modifying this.cardDefinitions which the registry wraps)
    this.cardDefinitions[cardId] = {
      id: cardId,
      name: "Test Character",
      hp: stats.hp ?? 1,
      ap: stats.ap ?? 1,
    };

    // Initialize card metadata (ready to use, no summoning sickness)
    const cardOps = createCardOperations(internalState);
    cardOps.setCardMeta(createCardId(cardId), {
      damage: 0,
      state: "ready",
      isDrying: false, // No summoning sickness - ready to use immediately
    } as any);

    return cardId;
  }

  // ========== Card Manipulation ==========

  /**
   * Move a card from one zone to another
   * Useful for test setup
   */
  moveCard(cardId: string, targetZone: string, playerId?: string) {
    const internalState = (this.engine as any).internalState;
    const zoneOps = createZoneOperations(internalState);

    zoneOps.moveCard({
      cardId: createCardId(cardId),
      targetZoneId: targetZone as any,
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
