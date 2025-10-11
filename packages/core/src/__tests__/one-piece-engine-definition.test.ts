import { describe, expect, it } from "bun:test";
import { createTestEngine } from "../testing/test-engine-builder";
import { createTestPlayers } from "../testing/test-player-builder";
import { createPlayerId } from "../types";
import { createMockOnePieceGame } from "./createMockOnePieceGame";

/**
 * One Piece Card Game - Beginning of Game Test
 *
 * This test validates the core engine's handling of One Piece's game initialization.
 * According to One Piece rules (section 5):
 * - Each player has 50-card deck and 10-card DON!! deck
 * - Starting setup: Place Leader, determine first player, draw 5 cards (with optional mulligan)
 * - Place Life cards equal to Leader's Life value
 * - First player has special first turn rules
 *
 * Goal: Test how core engine handles game-specific initialization across different TCGs
 */
describe("One Piece Game - Beginning of Game Procedure", () => {
  it("should initialize game with proper setup phase", () => {
    // Create game definition
    const gameDefinition = createMockOnePieceGame();

    // Create 2 players
    const players = createTestPlayers(2, ["Player1", "Player2"]);

    // Initialize engine with deterministic seed
    const engine = createTestEngine(gameDefinition, players, {
      seed: "onepiece-test-001",
    });

    // Verify initial state from setup function
    const state = engine.getState();
    expect(state.phase).toBe("setup");
    expect(state.turn).toBe(1);
    expect(state.currentPlayer).toBe(players[0]?.id);
    expect(state.firstTurn).toBe(true);
    expect(state.battleAllowed).toBe(false);
    expect(state.donThisTurn[players[0]?.id || "p1"]).toBe(0);
    expect(state.donThisTurn[players[1]?.id || "p2"]).toBe(0);
  });

  it("should have proper zone configuration for One Piece", () => {
    const gameDefinition = createMockOnePieceGame();

    // Verify zone configurations directly from game definition
    const zones = gameDefinition.zones;
    expect(zones).toBeDefined();

    // Verify all One Piece-specific zones exist
    expect(zones?.deck).toBeDefined();
    expect(zones?.donDeck).toBeDefined();
    expect(zones?.hand).toBeDefined();
    expect(zones?.trash).toBeDefined();
    expect(zones?.leader).toBeDefined();
    expect(zones?.characterArea).toBeDefined();
    expect(zones?.stageArea).toBeDefined();
    expect(zones?.costArea).toBeDefined();
    expect(zones?.life).toBeDefined();

    // Verify zone configurations
    expect(zones?.deck?.maxSize).toBe(50);
    expect(zones?.donDeck?.maxSize).toBe(10);
    expect(zones?.leader?.maxSize).toBe(1);
    expect(zones?.characterArea?.maxSize).toBe(5);
    expect(zones?.stageArea?.maxSize).toBe(1);

    // Verify visibility settings
    expect(zones?.deck?.visibility).toBe("secret");
    expect(zones?.donDeck?.visibility).toBe("public");
    expect(zones?.hand?.visibility).toBe("secret");
    expect(zones?.trash?.visibility).toBe("public");
    expect(zones?.leader?.visibility).toBe("public");
    expect(zones?.characterArea?.visibility).toBe("public");
    expect(zones?.stageArea?.visibility).toBe("public");
    expect(zones?.costArea?.visibility).toBe("public");
    expect(zones?.life?.visibility).toBe("secret");

    // Verify ordering settings
    expect(zones?.deck?.ordered).toBe(true);
    expect(zones?.donDeck?.ordered).toBe(true);
    expect(zones?.life?.ordered).toBe(true);
    expect(zones?.hand?.ordered).toBe(false);
    expect(zones?.trash?.ordered).toBe(false);
  });

  it("should have all required game moves defined", () => {
    const gameDefinition = createMockOnePieceGame();

    // Verify all setup moves exist
    expect(gameDefinition.moves.initializeDecks).toBeDefined();
    expect(gameDefinition.moves.placeLeader).toBeDefined();
    expect(gameDefinition.moves.determineFirstPlayer).toBeDefined();
    expect(gameDefinition.moves.drawOpeningHand).toBeDefined();
    expect(gameDefinition.moves.decideMulligan).toBeDefined();
    expect(gameDefinition.moves.placeLifeCards).toBeDefined();
    expect(gameDefinition.moves.transitionToGame).toBeDefined();

    // Verify all core game moves exist
    expect(gameDefinition.moves.draw).toBeDefined();
    expect(gameDefinition.moves.placeDon).toBeDefined();
    expect(gameDefinition.moves.playCharacter).toBeDefined();
    expect(gameDefinition.moves.playEvent).toBeDefined();
    expect(gameDefinition.moves.playStage).toBeDefined();
    expect(gameDefinition.moves.giveDon).toBeDefined();
    expect(gameDefinition.moves.attack).toBeDefined();
    expect(gameDefinition.moves.activateAbility).toBeDefined();
    expect(gameDefinition.moves.pass).toBeDefined();
    expect(gameDefinition.moves.concede).toBeDefined();
  });

  it("should have correct phase flow structure", () => {
    const gameDefinition = createMockOnePieceGame();

    // Verify flow structure
    expect(gameDefinition.flow).toBeDefined();
    expect(gameDefinition.flow?.turn).toBeDefined();
    expect(gameDefinition.flow?.turn.initialPhase).toBe("refresh");

    const phases = gameDefinition.flow?.turn.phases;
    expect(phases).toBeDefined();

    // Verify all phases exist in correct order
    expect(phases?.refresh?.order).toBe(0);
    expect(phases?.draw?.order).toBe(1);
    expect(phases?.don?.order).toBe(2);
    expect(phases?.main?.order).toBe(3);
    expect(phases?.end?.order).toBe(4);

    // Verify phase progression
    expect(phases?.refresh?.next).toBe("draw");
    expect(phases?.draw?.next).toBe("don");
    expect(phases?.don?.next).toBe("main");
    expect(phases?.main?.next).toBe("end");
    expect(phases?.end?.next).toBe("refresh");

    // Verify auto-advance for specific phases
    expect(phases?.refresh?.endIf).toBeDefined();
    expect(phases?.draw?.endIf).toBeDefined();
    expect(phases?.don?.endIf).toBeDefined();
    expect(phases?.end?.endIf).toBeDefined();
  });

  it("should handle game start sequence", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players);

    // Get initial state
    const initialState = engine.getState();
    expect(initialState.phase).toBe("setup");

    // Engine should be ready to progress to refresh phase
    // (In full implementation, this would involve:
    //  1. Shuffling both decks (50-card deck + 10 DON!! deck)
    //  2. Placing Leader card
    //  3. Determining first player
    //  4. Drawing 5 cards to each player's hand
    //  5. Optional mulligan decision
    //  6. Placing Life cards equal to Leader's Life value
    //  7. Transitioning to "refresh" phase with first turn rules)
  });

  it("should support deterministic gameplay with seed", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2);

    // Create two engines with same seed
    const engine1 = createTestEngine(gameDefinition, players, {
      seed: "deterministic-test",
    });
    const engine2 = createTestEngine(gameDefinition, players, {
      seed: "deterministic-test",
    });

    // Both should have identical initial states
    const state1 = engine1.getState();
    const state2 = engine2.getState();

    expect(state1).toEqual(state2);
  });
});

/**
 * One Piece Card Game - Setup Moves Test
 *
 * This test suite validates the beginning-of-game procedure as a series
 * of testable moves that demonstrate how the core engine handles complex
 * game initialization across different TCGs.
 */
describe("One Piece Game - Setup Moves", () => {
  it("should initialize decks for a player", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2, ["Player1", "Player2"]);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-001",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Execute initializeDecks for Player 1
    engine.executeMove("initializeDecks", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });

    const state = engine.getState();

    // Verify setup step progressed
    expect(state.setupStep).toBe("shuffling");

    // Verify deck sizes (50 main + 10 DON!!)
    // Note: We can't directly inspect zones without engine API,
    // but the move should execute without errors
  });

  it("should place Leader card in leader area", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-002",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Initialize decks first
    engine.executeMove("initializeDecks", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });

    // Place Leader
    const leaderId = `${playerId}-leader-001`;
    engine.executeMove("placeLeader", {
      playerId: createPlayerId(playerId),
      params: { playerId, leaderId },
    });

    const state = engine.getState();

    // Verify setup step progressed to first player determination
    expect(state.setupStep).toBe("firstPlayer");
  });

  it("should determine first player", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2, ["Player1", "Player2"]);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-003",
    });

    const player1Id = players[0]?.id;
    const player2Id = players[1]?.id;
    if (!player1Id) throw new Error("Player 1 ID not found");
    if (!player2Id) throw new Error("Player 2 ID not found");

    // Initialize and place leader
    engine.executeMove("initializeDecks", {
      playerId: createPlayerId(player1Id),
      params: { playerId: player1Id },
    });
    engine.executeMove("placeLeader", {
      playerId: createPlayerId(player1Id),
      params: { playerId: player1Id, leaderId: `${player1Id}-leader` },
    });

    // Determine first player (choosing Player 1)
    engine.executeMove("determineFirstPlayer", {
      playerId: createPlayerId(player1Id),
      params: { playerId: player1Id },
    });

    const state = engine.getState();

    // Verify first player is set
    expect(state.currentPlayer).toBe(player1Id);
    expect(state.setupStep).toBe("drawHand");
  });

  it("should draw 5 cards to opening hand", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-004",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Complete setup through first player determination
    engine.executeMove("initializeDecks", {
      playerId: createPlayerId(playerId),
      params: { playerId: String(playerId) },
    });
    engine.executeMove("placeLeader", {
      playerId: createPlayerId(playerId),
      params: { playerId: String(playerId), leaderId: `${playerId}-leader` },
    });
    engine.executeMove("determineFirstPlayer", {
      playerId: createPlayerId(playerId),
      params: { playerId: String(playerId) },
    });

    // Draw opening hand
    engine.executeMove("drawOpeningHand", {
      playerId: createPlayerId(playerId),
      params: { playerId: String(playerId) },
    });

    const state = engine.getState();

    // Verify setup step progressed to mulligan
    expect(state.setupStep).toBe("mulligan");

    // Verify mulligan was offered to this player
    expect(state.mulliganOffered[playerId]).toBe(true);
  });

  it("should handle mulligan decision - keep hand", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-005",
    });

    const playerId = players[0]?.id || "p1";

    // Complete setup through opening hand draw
    engine.executeMove("initializeDecks", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });
    engine.executeMove("placeLeader", {
      playerId: createPlayerId(playerId),
      params: { playerId, leaderId: `${playerId}-leader` },
    });
    engine.executeMove("determineFirstPlayer", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });
    engine.executeMove("drawOpeningHand", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });

    // Player decides to keep hand
    engine.executeMove("decideMulligan", {
      playerId: createPlayerId(playerId),
      params: { playerId, redraw: false },
    });

    const state = engine.getState();

    // Verify mulligan completed
    expect(state.mulliganOffered[playerId]).toBe(false);
    expect(state.setupStep).toBe("placeLife");
  });

  it("should handle mulligan decision - redraw hand", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-006",
    });

    const playerId = players[0]?.id || "p1";

    // Complete setup through opening hand draw
    engine.executeMove("initializeDecks", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });
    engine.executeMove("placeLeader", {
      playerId: createPlayerId(playerId),
      params: { playerId, leaderId: `${playerId}-leader` },
    });
    engine.executeMove("determineFirstPlayer", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });
    engine.executeMove("drawOpeningHand", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });

    // Player decides to mulligan (redraw hand)
    engine.executeMove("decideMulligan", {
      playerId: createPlayerId(playerId),
      params: { playerId, redraw: true },
    });

    const state = engine.getState();

    // Verify mulligan completed
    expect(state.mulliganOffered[playerId]).toBe(false);

    // Hand should still have 5 cards (reshuffled and redrawn)
    expect(state.setupStep).toBe("placeLife");
  });

  it("should place Life cards from deck", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-007",
    });

    const playerId = players[0]?.id || "p1";

    // Complete setup through mulligan
    engine.executeMove("initializeDecks", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });
    engine.executeMove("placeLeader", {
      playerId: createPlayerId(playerId),
      params: { playerId, leaderId: `${playerId}-leader` },
    });
    engine.executeMove("determineFirstPlayer", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });
    engine.executeMove("drawOpeningHand", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });
    engine.executeMove("decideMulligan", {
      playerId: createPlayerId(playerId),
      params: { playerId, redraw: false },
    });

    // Place 5 Life cards (typical Leader Life value)
    engine.executeMove("placeLifeCards", {
      playerId: createPlayerId(playerId),
      params: { playerId, lifeCount: 5 },
    });

    const state = engine.getState();

    // Verify Life tracking
    expect(state.leaderLife[playerId]).toBe(5);
  });

  it("should transition from setup to game phase", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-008",
    });

    const playerId = players[0]?.id || "p1";

    // Complete full setup sequence
    engine.executeMove("initializeDecks", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });
    engine.executeMove("placeLeader", {
      playerId: createPlayerId(playerId),
      params: { playerId, leaderId: `${playerId}-leader` },
    });
    engine.executeMove("determineFirstPlayer", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });
    engine.executeMove("drawOpeningHand", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });
    engine.executeMove("decideMulligan", {
      playerId: createPlayerId(playerId),
      params: { playerId, redraw: false },
    });
    engine.executeMove("placeLifeCards", {
      playerId: createPlayerId(playerId),
      params: { playerId, lifeCount: 5 },
    });

    // Transition to game
    engine.executeMove("transitionToGame", {
      playerId: createPlayerId(playerId),
      params: {},
    });

    const state = engine.getState();

    // Verify phase changed to refresh
    expect(state.phase).toBe("refresh");
    expect(state.setupStep).toBe("complete");
    expect(state.firstTurn).toBe(true);
    expect(state.battleAllowed).toBe(false);
  });

  it("should execute full setup sequence for both players", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2, ["Player1", "Player2"]);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-009",
    });

    const player1Id = players[0]?.id || "p1";
    const player2Id = players[1]?.id || "p2";

    // Player 1 setup
    engine.executeMove("initializeDecks", {
      playerId: createPlayerId(player1Id),
      params: { playerId: player1Id },
    });
    engine.executeMove("placeLeader", {
      playerId: createPlayerId(player1Id),
      params: { playerId: player1Id, leaderId: `${player1Id}-leader` },
    });
    engine.executeMove("determineFirstPlayer", {
      playerId: createPlayerId(player1Id),
      params: { playerId: player1Id },
    });
    engine.executeMove("drawOpeningHand", {
      playerId: createPlayerId(player1Id),
      params: { playerId: player1Id },
    });
    engine.executeMove("decideMulligan", {
      playerId: createPlayerId(player1Id),
      params: { playerId: player1Id, redraw: false },
    });
    engine.executeMove("placeLifeCards", {
      playerId: createPlayerId(player1Id),
      params: { playerId: player1Id, lifeCount: 5 },
    });

    // Player 2 setup
    engine.executeMove("initializeDecks", {
      playerId: createPlayerId(player2Id),
      params: { playerId: player2Id },
    });
    engine.executeMove("placeLeader", {
      playerId: createPlayerId(player2Id),
      params: { playerId: player2Id, leaderId: `${player2Id}-leader` },
    });
    engine.executeMove("drawOpeningHand", {
      playerId: createPlayerId(player2Id),
      params: { playerId: player2Id },
    });
    engine.executeMove("decideMulligan", {
      playerId: createPlayerId(player2Id),
      params: { playerId: player2Id, redraw: true },
    });
    engine.executeMove("placeLifeCards", {
      playerId: createPlayerId(player2Id),
      params: { playerId: player2Id, lifeCount: 4 },
    });

    // Transition to game
    engine.executeMove("transitionToGame", {
      playerId: createPlayerId(player1Id),
      params: {},
    });

    const state = engine.getState();

    // Verify game is ready to start
    expect(state.phase).toBe("refresh");
    expect(state.setupStep).toBe("complete");

    // Both players should have completed mulligan
    expect(state.mulliganOffered[player1Id]).toBe(false);
    expect(state.mulliganOffered[player2Id]).toBe(false);

    // Verify Life cards are tracked
    expect(state.leaderLife[player1Id]).toBe(5);
    expect(state.leaderLife[player2Id]).toBe(4);
  });

  it("should produce deterministic setup with same seed", () => {
    const gameDefinition = createMockOnePieceGame();
    const players1 = createTestPlayers(2, ["Player1", "Player2"]);
    const players2 = createTestPlayers(2, ["Player1", "Player2"]);

    // Create two engines with same seed
    const engine1 = createTestEngine(gameDefinition, players1, {
      seed: "deterministic-setup",
    });
    const engine2 = createTestEngine(gameDefinition, players2, {
      seed: "deterministic-setup",
    });

    // Execute same setup sequence on both engines
    const playerId = players1[0]?.id || "p1";
    const setupSequence = [
      {
        move: "initializeDecks",
        playerId: createPlayerId(playerId),
        params: { playerId },
      },
      {
        move: "placeLeader",
        playerId: createPlayerId(playerId),
        params: {
          playerId,
          leaderId: `${playerId}-leader`,
        },
      },
      {
        move: "determineFirstPlayer",
        playerId: createPlayerId(playerId),
        params: { playerId },
      },
      {
        move: "drawOpeningHand",
        playerId: createPlayerId(playerId),
        params: { playerId },
      },
      {
        move: "decideMulligan",
        playerId: createPlayerId(playerId),
        params: { playerId, redraw: true },
      },
    ];

    for (const { move, playerId: pid, params } of setupSequence) {
      engine1.executeMove(move as keyof typeof gameDefinition.moves, {
        playerId: pid,
        params,
      });
      engine2.executeMove(move as keyof typeof gameDefinition.moves, {
        playerId: pid,
        params,
      });
    }

    // Both engines should have identical states
    const state1 = engine1.getState();
    const state2 = engine2.getState();

    expect(state1).toEqual(state2);
  });
});

/**
 * One Piece Card Game - Core Gameplay Moves Test
 *
 * This test suite validates the core gameplay moves including draw, DON!! placement,
 * and card playing.
 */
describe("One Piece Game - Core Gameplay Moves", () => {
  it("should handle draw move", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "gameplay-test-001",
    });

    const playerId = players[0]?.id || "p1";

    // Setup game
    engine.executeMove("initializeDecks", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });

    // Draw a card
    engine.executeMove("draw", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });

    // Move should execute without errors
  });

  it("should place DON!! cards - first turn (1 card)", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "gameplay-test-002",
    });

    const playerId = players[0]?.id || "p1";

    // Setup with first turn active
    engine.executeMove("initializeDecks", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });

    const initialState = engine.getState();
    expect(initialState.firstTurn).toBe(true);

    // Place DON!! on first turn
    engine.executeMove("placeDon", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });

    const state = engine.getState();

    // First player's first turn should place 1 DON!!
    expect(state.donThisTurn[playerId]).toBe(1);
  });

  it("should place DON!! cards - regular turn (2 cards)", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2, ["Player1", "Player2"]);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "gameplay-test-003",
    });

    const player1Id = players[0]?.id || "p1";
    const player2Id = players[1]?.id || "p2";

    // Setup both players
    engine.executeMove("initializeDecks", {
      playerId: createPlayerId(player1Id),
      params: { playerId: player1Id },
    });
    engine.executeMove("initializeDecks", {
      playerId: createPlayerId(player2Id),
      params: { playerId: player2Id },
    });

    // Disable first turn flag
    const state = engine.getState();
    state.firstTurn = false;

    // Place DON!! on non-first turn
    engine.executeMove("placeDon", {
      playerId: createPlayerId(player2Id),
      params: { playerId: player2Id },
    });

    const updatedState = engine.getState();

    // Non-first turn should place 2 DON!!
    expect(updatedState.donThisTurn[player2Id]).toBe(2);
  });

  it("should play Character card to character area", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "gameplay-test-004",
    });

    const playerId = players[0]?.id || "p1";
    const cardId = `${playerId}-character-001`;

    // Play character card
    engine.executeMove("playCharacter", {
      playerId: createPlayerId(playerId),
      params: { playerId, cardId },
    });

    // Move should execute without errors
  });

  it("should play Event card to trash", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "gameplay-test-005",
    });

    const playerId = players[0]?.id || "p1";
    const cardId = `${playerId}-event-001`;

    // Play event card
    engine.executeMove("playEvent", {
      playerId: createPlayerId(playerId),
      params: { playerId, cardId },
    });

    // Move should execute without errors
  });

  it("should play Stage card to stage area", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "gameplay-test-006",
    });

    const playerId = players[0]?.id || "p1";
    const cardId = `${playerId}-stage-001`;

    // Play stage card
    engine.executeMove("playStage", {
      playerId: createPlayerId(playerId),
      params: { playerId, cardId },
    });

    // Move should execute without errors
  });

  it("should handle concede move", () => {
    const gameDefinition = createMockOnePieceGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players);

    const playerId = players[0]?.id || "p1";

    // Concede game
    engine.executeMove("concede", {
      playerId: createPlayerId(playerId),
      params: { playerId },
    });

    const state = engine.getState();

    // Game should be over
    expect(state.phase).toBe("gameOver");
  });
});

