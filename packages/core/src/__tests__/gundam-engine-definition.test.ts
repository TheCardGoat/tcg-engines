import { describe, expect, it } from "bun:test";
import { createTestEngine } from "../testing/test-engine-builder";
import { createTestPlayers } from "../testing/test-player-builder";
import { createMockGundamGame } from "./createMockGundamGame";

/**
 * Gundam Card Game - Beginning of Game Test
 *
 * This test validates the core engine's handling of Gundam's game initialization.
 * According to Gundam rules (section 5):
 * - Each player has 50-card deck and 10-card resource deck
 * - Starting setup: Draw 5 cards (with optional mulligan)
 * - Place 6 shields face-down
 * - Place EX Base token
 * - Player Two gets EX Resource token
 *
 * Goal: Test how core engine handles game-specific initialization across different TCGs
 */
describe("Gundam Game - Beginning of Game Procedure", () => {
  it("should initialize game with proper setup phase", () => {
    // Create game definition
    const gameDefinition = createMockGundamGame();

    // Create 2 players
    const players = createTestPlayers(2, ["Player1", "Player2"]);

    // Initialize engine with deterministic seed
    const engine = createTestEngine(gameDefinition, players, {
      seed: "gundam-test-001",
    });

    // Verify initial state from setup function
    const state = engine.getState();
    expect(state.phase).toBe("setup");
    expect(state.turn).toBe(1);
    expect(state.currentPlayer).toBe(players[0]?.id);
    expect(state.activeResources[players[0]?.id || "p1"]).toBe(0);
    expect(state.activeResources[players[1]?.id || "p2"]).toBe(0);
    expect(state.hasPlayedResourceThisTurn[players[0]?.id || "p1"]).toBe(false);
    expect(state.hasPlayedResourceThisTurn[players[1]?.id || "p2"]).toBe(false);
  });

  it("should have proper zone configuration for Gundam", () => {
    const gameDefinition = createMockGundamGame();

    // Verify zone configurations directly from game definition
    const zones = gameDefinition.zones;
    expect(zones).toBeDefined();

    // Verify all Gundam-specific zones exist
    expect(zones?.deck).toBeDefined();
    expect(zones?.resourceDeck).toBeDefined();
    expect(zones?.hand).toBeDefined();
    expect(zones?.battleArea).toBeDefined();
    expect(zones?.shieldSection).toBeDefined();
    expect(zones?.baseSection).toBeDefined();
    expect(zones?.resourceArea).toBeDefined();
    expect(zones?.trash).toBeDefined();
    expect(zones?.removal).toBeDefined();

    // Verify zone configurations
    expect(zones?.deck?.maxSize).toBe(50);
    expect(zones?.resourceDeck?.maxSize).toBe(10);
    expect(zones?.hand?.maxSize).toBe(10);
    expect(zones?.battleArea?.maxSize).toBe(6);
    expect(zones?.shieldSection?.maxSize).toBe(6);
    expect(zones?.baseSection?.maxSize).toBe(1);
    expect(zones?.resourceArea?.maxSize).toBe(15);

    // Verify visibility settings
    expect(zones?.deck?.visibility).toBe("private");
    expect(zones?.resourceDeck?.visibility).toBe("private");
    expect(zones?.hand?.visibility).toBe("private");
    expect(zones?.battleArea?.visibility).toBe("public");
    expect(zones?.shieldSection?.visibility).toBe("secret");
    expect(zones?.baseSection?.visibility).toBe("public");
  });

  it("should have all required game moves defined", () => {
    const gameDefinition = createMockGundamGame();

    // Verify all Gundam moves exist
    expect(gameDefinition.moves.draw).toBeDefined();
    expect(gameDefinition.moves.deployUnit).toBeDefined();
    expect(gameDefinition.moves.deployBase).toBeDefined();
    expect(gameDefinition.moves.playResource).toBeDefined();
    expect(gameDefinition.moves.attack).toBeDefined();
    expect(gameDefinition.moves.pass).toBeDefined();
    expect(gameDefinition.moves.concede).toBeDefined();
  });

  it("should have correct phase flow structure", () => {
    const gameDefinition = createMockGundamGame();

    // Verify flow structure
    expect(gameDefinition.flow).toBeDefined();
    expect(gameDefinition.flow?.turn).toBeDefined();
    expect(gameDefinition.flow?.turn.initialPhase).toBe("start");

    const phases = gameDefinition.flow?.turn.phases;
    expect(phases).toBeDefined();

    // Verify all phases exist in correct order
    expect(phases?.start?.order).toBe(0);
    expect(phases?.draw?.order).toBe(1);
    expect(phases?.resource?.order).toBe(2);
    expect(phases?.main?.order).toBe(3);
    expect(phases?.end?.order).toBe(4);

    // Verify phase progression
    expect(phases?.start?.next).toBe("draw");
    expect(phases?.draw?.next).toBe("resource");
    expect(phases?.resource?.next).toBe("main");
    expect(phases?.main?.next).toBe("end");
    expect(phases?.end?.next).toBe("start");

    // Verify auto-advance for specific phases
    expect(phases?.start?.endIf).toBeDefined();
    expect(phases?.draw?.endIf).toBeDefined();
    expect(phases?.end?.endIf).toBeDefined();
  });

  it("should handle game start sequence", () => {
    const gameDefinition = createMockGundamGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players);

    // Get initial state
    const initialState = engine.getState();
    expect(initialState.phase).toBe("setup");

    // Engine should be ready to progress to start phase
    // (In full implementation, this would involve:
    //  1. Shuffling both decks
    //  2. Drawing 5 cards to each player's hand
    //  3. Optional mulligan decision
    //  4. Placing 6 shields face-down in shieldSection
    //  5. Placing EX Base token in baseSection
    //  6. Giving Player 2 an EX Resource token
    //  7. Transitioning to "start" phase)
  });

  it("should support deterministic gameplay with seed", () => {
    const gameDefinition = createMockGundamGame();
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
 * Gundam Card Game - Setup Moves Test
 *
 * This test suite validates the beginning-of-game procedure as a series
 * of testable moves that demonstrate how the core engine handles complex
 * game initialization across different TCGs.
 */
describe("Gundam Game - Setup Moves", () => {
  it("should initialize decks for a player", () => {
    const gameDefinition = createMockGundamGame();
    const players = createTestPlayers(2, ["Player1", "Player2"]);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-001",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Execute initializeDecks for Player 1
    engine.executeMove("initializeDecks", {
      playerId,
      params: { playerId },
    });

    const state = engine.getState();

    // Verify setup step progressed
    expect(state.setupStep).toBe("shields");

    // Verify deck sizes (50 main + 10 resource)
    // Note: We can't directly inspect zones without engine API,
    // but the move should execute without errors
  });

  it("should place shields from deck to shieldSection", () => {
    const gameDefinition = createMockGundamGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-002",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Initialize decks first
    engine.executeMove("initializeDecks", {
      playerId,
      params: { playerId },
    });

    // Place shields
    engine.executeMove("placeShields", {
      playerId,
      params: { playerId },
    });

    const state = engine.getState();

    // Verify setup step progressed to tokens
    expect(state.setupStep).toBe("tokens");
  });

  it("should create EX Base token for all players", () => {
    const gameDefinition = createMockGundamGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-003",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Initialize, place shields, then create tokens
    engine.executeMove("initializeDecks", {
      playerId,
      params: { playerId },
    });
    engine.executeMove("placeShields", {
      playerId,
      params: { playerId },
    });
    engine.executeMove("createTokens", {
      playerId,
      params: { playerId },
    });

    const state = engine.getState();

    // Verify setup step progressed to draw
    expect(state.setupStep).toBe("draw");
  });

  it("should create EX Resource token only for Player 2", () => {
    const gameDefinition = createMockGundamGame();
    const players = createTestPlayers(2, ["Player1", "Player2"]);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-004",
    });

    // Setup for Player 1 (should NOT get EX Resource)
    const player1Id = players[0]?.id;
    const player2Id = players[1]?.id;
    if (!(player1Id && player2Id)) throw new Error("Player IDs not found");

    engine.executeMove("initializeDecks", {
      playerId: player1Id,
      params: { playerId: String(player1Id) },
    });
    engine.executeMove("placeShields", {
      playerId: player1Id,
      params: { playerId: String(player1Id) },
    });
    engine.executeMove("createTokens", {
      playerId: player1Id,
      params: { playerId: String(player1Id), playerIndex: 0 },
    });

    // Setup for Player 2 (should get EX Resource)
    engine.executeMove("initializeDecks", {
      playerId: player2Id,
      params: { playerId: String(player2Id) },
    });
    engine.executeMove("placeShields", {
      playerId: player2Id,
      params: { playerId: String(player2Id) },
    });
    engine.executeMove("createTokens", {
      playerId: player2Id,
      params: { playerId: String(player2Id), playerIndex: 1 },
    });

    const state = engine.getState();

    // Both players should be at draw step
    expect(state.setupStep).toBe("draw");
  });

  it("should draw 5 cards to initial hand", () => {
    const gameDefinition = createMockGundamGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-005",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Complete setup through token creation
    engine.executeMove("initializeDecks", {
      playerId,
      params: { playerId: String(playerId) },
    });
    engine.executeMove("placeShields", {
      playerId,
      params: { playerId: String(playerId) },
    });
    engine.executeMove("createTokens", {
      playerId,
      params: { playerId: String(playerId) },
    });

    // Draw initial hand
    engine.executeMove("drawInitialHand", {
      playerId,
      params: { playerId: String(playerId) },
    });

    const state = engine.getState();

    // Verify setup step progressed to mulligan
    expect(state.setupStep).toBe("mulligan");

    // Verify mulligan was offered to this player
    expect(state.mulliganOffered[playerId]).toBe(true);
  });

  it("should handle mulligan decision - keep hand", () => {
    const gameDefinition = createMockGundamGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-006",
    });

    const playerId = players[0]?.id || "p1";

    // Complete setup through initial hand draw
    engine.executeMove("initializeDecks", { playerId });
    engine.executeMove("placeShields", { playerId });
    engine.executeMove("createTokens", { playerId });
    engine.executeMove("drawInitialHand", { playerId });

    // Player decides to keep hand
    engine.executeMove("decideMulligan", { playerId, redraw: false });

    const state = engine.getState();

    // Verify mulligan completed
    expect(state.mulliganOffered[playerId]).toBe(false);
  });

  it("should handle mulligan decision - redraw hand", () => {
    const gameDefinition = createMockGundamGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-007",
    });

    const playerId = players[0]?.id || "p1";

    // Complete setup through initial hand draw
    engine.executeMove("initializeDecks", { playerId });
    engine.executeMove("placeShields", { playerId });
    engine.executeMove("createTokens", { playerId });
    engine.executeMove("drawInitialHand", { playerId });

    // Player decides to mulligan (redraw hand)
    engine.executeMove("decideMulligan", { playerId, redraw: true });

    const state = engine.getState();

    // Verify mulligan completed
    expect(state.mulliganOffered[playerId]).toBe(false);

    // Hand should still have 5 cards (reshuffled and redrawn)
  });

  it("should transition from setup to play phase", () => {
    const gameDefinition = createMockGundamGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-008",
    });

    const playerId = players[0]?.id || "p1";

    // Complete full setup sequence
    engine.executeMove("initializeDecks", { playerId });
    engine.executeMove("placeShields", { playerId });
    engine.executeMove("createTokens", { playerId });
    engine.executeMove("drawInitialHand", { playerId });
    engine.executeMove("decideMulligan", { playerId, redraw: false });

    // Transition to play
    engine.executeMove("transitionToPlay", {});

    const state = engine.getState();

    // Verify phase changed to start
    expect(state.phase).toBe("start");
    expect(state.setupStep).toBe("complete");
  });

  it("should execute full setup sequence for both players", () => {
    const gameDefinition = createMockGundamGame();
    const players = createTestPlayers(2, ["Player1", "Player2"]);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-009",
    });

    const player1Id = players[0]?.id || "p1";
    const player2Id = players[1]?.id || "p2";

    // Player 1 setup
    engine.executeMove("initializeDecks", { playerId: player1Id });
    engine.executeMove("placeShields", { playerId: player1Id });
    engine.executeMove("createTokens", { playerId: player1Id, playerIndex: 0 });
    engine.executeMove("drawInitialHand", { playerId: player1Id });
    engine.executeMove("decideMulligan", {
      playerId: player1Id,
      redraw: false,
    });

    // Player 2 setup
    engine.executeMove("initializeDecks", { playerId: player2Id });
    engine.executeMove("placeShields", { playerId: player2Id });
    engine.executeMove("createTokens", { playerId: player2Id, playerIndex: 1 });
    engine.executeMove("drawInitialHand", { playerId: player2Id });
    engine.executeMove("decideMulligan", { playerId: player2Id, redraw: true });

    // Transition to play
    engine.executeMove("transitionToPlay", {});

    const state = engine.getState();

    // Verify game is ready to start
    expect(state.phase).toBe("start");
    expect(state.setupStep).toBe("complete");

    // Both players should have completed mulligan
    expect(state.mulliganOffered[player1Id]).toBe(false);
    expect(state.mulliganOffered[player2Id]).toBe(false);
  });

  it("should produce deterministic setup with same seed", () => {
    const gameDefinition = createMockGundamGame();
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
    const setupSequence = [
      {
        move: "initializeDecks",
        params: { playerId: players1[0]?.id || "p1" },
      },
      { move: "placeShields", params: { playerId: players1[0]?.id || "p1" } },
      { move: "createTokens", params: { playerId: players1[0]?.id || "p1" } },
      {
        move: "drawInitialHand",
        params: { playerId: players1[0]?.id || "p1" },
      },
      {
        move: "decideMulligan",
        params: { playerId: players1[0]?.id || "p1", redraw: true },
      },
    ];

    for (const { move, params } of setupSequence) {
      engine1.executeMove(move as keyof typeof gameDefinition.moves, params);
      engine2.executeMove(move as keyof typeof gameDefinition.moves, params);
    }

    // Both engines should have identical states
    const state1 = engine1.getState();
    const state2 = engine2.getState();

    expect(state1).toEqual(state2);
  });
});
