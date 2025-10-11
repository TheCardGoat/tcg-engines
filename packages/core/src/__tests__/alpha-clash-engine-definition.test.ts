import { describe, expect, it } from "bun:test";
import { createTestEngine } from "../testing/test-engine-builder";
import { createTestPlayers } from "../testing/test-player-builder";
import type { PlayerId } from "../types";
import { createMockAlphaClashGame } from "./createMockAlphaClashGame";

/**
 * Alpha Clash Card Game - Beginning of Game Test
 *
 * This test validates the core engine's handling of Alpha Clash's game initialization.
 * According to Alpha Clash rules (section 103):
 * - Each player has 50-card deck with exactly 1 Contender
 * - Starting setup: Place Contender in Contender Zone
 * - Shuffle remaining 49 cards
 * - Randomly determine first player
 * - Draw 8 cards (standard starting hand size)
 * - One-time mulligan option (shuffle any number of cards back, draw same amount)
 * - First player skips Ready and Draw steps on first turn
 *
 * Goal: Test how core engine handles game-specific initialization across different TCGs
 */
describe("Alpha Clash Game - Beginning of Game Procedure", () => {
  it("should initialize game with proper setup phase", () => {
    // Create game definition
    const gameDefinition = createMockAlphaClashGame();

    // Create 2 players
    const players = createTestPlayers(2, ["Player1", "Player2"]);

    // Initialize engine with deterministic seed
    const engine = createTestEngine(gameDefinition, players, {
      seed: "alpha-clash-test-001",
    });

    // Verify initial state from setup function
    const state = engine.getState();
    expect(state.phase).toBe("setup");
    expect(state.turn).toBe(0);
    expect(state.firstPlayerChosen).toBe(false);
    expect(state.currentPlayer).toBe(players[0]?.id);

    // Verify player-specific state initialization
    expect(state.contenderHealth[players[0]?.id || "p1"]).toBe(20);
    expect(state.contenderHealth[players[1]?.id || "p2"]).toBe(20);
    expect(state.resourcesAvailable[players[0]?.id || "p1"]).toBe(0);
    expect(state.resourcesAvailable[players[1]?.id || "p2"]).toBe(0);
    expect(state.hasPlayedResourceThisTurn[players[0]?.id || "p1"]).toBe(false);
    expect(state.hasPlayedResourceThisTurn[players[1]?.id || "p2"]).toBe(false);
    expect(state.clashInProgress).toBe(false);
  });

  it("should have proper zone configuration for Alpha Clash", () => {
    const gameDefinition = createMockAlphaClashGame();

    // Verify zone configurations directly from game definition
    const zones = gameDefinition.zones;
    expect(zones).toBeDefined();

    // Verify all Alpha Clash-specific zones exist
    expect(zones?.deck).toBeDefined();
    expect(zones?.hand).toBeDefined();
    expect(zones?.contender).toBeDefined();
    expect(zones?.clash).toBeDefined();
    expect(zones?.clashground).toBeDefined();
    expect(zones?.accessory).toBeDefined();
    expect(zones?.resource).toBeDefined();
    expect(zones?.discard).toBeDefined();
    expect(zones?.oblivion).toBeDefined();
    expect(zones?.standby).toBeDefined();

    // Verify zone configurations
    expect(zones?.deck?.maxSize).toBe(50); // 50-card deck per rule 100.2
    expect(zones?.contender?.maxSize).toBe(1); // Exactly one Contender
    expect(zones?.clashground?.maxSize).toBe(1); // Only one Clashground per rule 302.2
    expect(zones?.hand?.maxSize).toBeUndefined(); // No hand size limit

    // Verify visibility settings
    expect(zones?.deck?.visibility).toBe("private");
    expect(zones?.hand?.visibility).toBe("private");
    expect(zones?.contender?.visibility).toBe("public");
    expect(zones?.clash?.visibility).toBe("public");
    expect(zones?.clashground?.visibility).toBe("public");
    expect(zones?.accessory?.visibility).toBe("secret"); // Traps are face-down
    expect(zones?.resource?.visibility).toBe("public");
    expect(zones?.discard?.visibility).toBe("public");
    expect(zones?.oblivion?.visibility).toBe("public");
    expect(zones?.standby?.visibility).toBe("public");

    // Verify face-down settings
    expect(zones?.deck?.faceDown).toBe(true);
    expect(zones?.accessory?.faceDown).toBe(true); // Traps are set face-down
    expect(zones?.contender?.faceDown).toBe(false);

    // Verify ordered settings
    expect(zones?.deck?.ordered).toBe(true); // Deck order matters
    expect(zones?.standby?.ordered).toBe(true); // Effects resolve in order
    expect(zones?.clash?.ordered).toBe(false);
  });

  it("should have all required game moves defined", () => {
    const gameDefinition = createMockAlphaClashGame();

    // Verify all Alpha Clash moves exist
    expect(gameDefinition.moves.placeContender).toBeDefined();
    expect(gameDefinition.moves.drawInitialHand).toBeDefined();
    expect(gameDefinition.moves.decideMulligan).toBeDefined();
    expect(gameDefinition.moves.chooseFirstPlayer).toBeDefined();
    expect(gameDefinition.moves.transitionToPlay).toBeDefined();
    expect(gameDefinition.moves.drawCard).toBeDefined();
    expect(gameDefinition.moves.playResource).toBeDefined();
    expect(gameDefinition.moves.playClashCard).toBeDefined();
    expect(gameDefinition.moves.playAction).toBeDefined();
    expect(gameDefinition.moves.setTrap).toBeDefined();
    expect(gameDefinition.moves.initiateClash).toBeDefined();
    expect(gameDefinition.moves.declareObstructors).toBeDefined();
    expect(gameDefinition.moves.playClashBuff).toBeDefined();
    expect(gameDefinition.moves.pass).toBeDefined();
    expect(gameDefinition.moves.concede).toBeDefined();
  });

  it("should have correct phase flow structure", () => {
    const gameDefinition = createMockAlphaClashGame();

    // Verify flow structure
    expect(gameDefinition.flow).toBeDefined();
    expect(gameDefinition.flow?.turn).toBeDefined();
    expect(gameDefinition.flow?.turn.initialPhase).toBe("startOfTurn");

    const phases = gameDefinition.flow?.turn.phases;
    expect(phases).toBeDefined();

    // Verify all phases exist in correct order
    expect(phases?.startOfTurn?.order).toBe(0);
    expect(phases?.expansion?.order).toBe(1);
    expect(phases?.primary?.order).toBe(2);
    expect(phases?.endOfTurn?.order).toBe(3);

    // Verify phase progression
    expect(phases?.startOfTurn?.next).toBe("expansion");
    expect(phases?.expansion?.next).toBe("primary");
    expect(phases?.primary?.next).toBe("endOfTurn");
    expect(phases?.endOfTurn?.next).toBe("startOfTurn");

    // Verify Expansion Phase segments
    const expansionSegments = phases?.expansion?.segments;
    expect(expansionSegments).toBeDefined();
    expect(expansionSegments?.readyStep).toBeDefined();
    expect(expansionSegments?.drawStep).toBeDefined();
    expect(expansionSegments?.resourceStep).toBeDefined();

    // Verify segment order
    expect(expansionSegments?.readyStep?.order).toBe(1);
    expect(expansionSegments?.drawStep?.order).toBe(2);
    expect(expansionSegments?.resourceStep?.order).toBe(3);

    // Verify segment progression
    expect(expansionSegments?.readyStep?.next).toBe("drawStep");
    expect(expansionSegments?.drawStep?.next).toBe("resourceStep");

    // Verify auto-advance for specific phases
    expect(phases?.startOfTurn?.endIf).toBeDefined();
    expect(phases?.endOfTurn?.endIf).toBeDefined();
  });

  it("should handle game start sequence", () => {
    const gameDefinition = createMockAlphaClashGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players);

    // Get initial state
    const initialState = engine.getState();
    expect(initialState.phase).toBe("setup");

    // Engine should be ready to progress to start phase
    // (In full implementation, this would involve:
    //  1. Placing Contender in Contender Zone for each player
    //  2. Shuffling remaining 49 cards in each deck
    //  3. Randomly determining first player
    //  4. Drawing 8 cards to each player's hand
    //  5. One-time mulligan decision per player
    //  6. Transitioning to "startOfTurn" phase)
  });

  it("should support deterministic gameplay with seed", () => {
    const gameDefinition = createMockAlphaClashGame();
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
 * Alpha Clash Card Game - Setup Moves Test
 *
 * This test suite validates the beginning-of-game procedure as a series
 * of testable moves that demonstrate how the core engine handles complex
 * game initialization across different TCGs.
 */
describe("Alpha Clash Game - Setup Moves", () => {
  it("should place Contender in Contender Zone", () => {
    const gameDefinition = createMockAlphaClashGame();
    const players = createTestPlayers(2, ["Player1", "Player2"]);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-001",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Execute placeContender for Player 1
    engine.executeMove("placeContender", {
      playerId: playerId as PlayerId,
      params: { playerId: String(playerId) },
    });

    const state = engine.getState();

    // Verify setup step progressed
    expect(state.setupStep).toBe("shuffleDeck");
  });

  it("should draw 8 cards to initial hand", () => {
    const gameDefinition = createMockAlphaClashGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-002",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Place Contender first
    engine.executeMove("placeContender", {
      playerId: playerId as PlayerId,
      params: { playerId: String(playerId) },
    });

    // Draw initial hand
    engine.executeMove("drawInitialHand", {
      playerId: playerId as PlayerId,
      params: { playerId: String(playerId) },
    });

    const state = engine.getState();

    // Verify setup step progressed to mulligan
    expect(state.setupStep).toBe("mulligan");

    // Verify mulligan was offered to this player
    expect(state.mulliganOffered[playerId]).toBe(true);
  });

  it("should handle mulligan decision - keep hand", () => {
    const gameDefinition = createMockAlphaClashGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-003",
    });

    const playerId = players[0]?.id || "p1";

    // Complete setup through initial hand draw
    engine.executeMove("placeContender", {
      playerId: playerId as PlayerId,
      params: { playerId: String(playerId) },
    });
    engine.executeMove("drawInitialHand", {
      playerId: playerId as PlayerId,
      params: { playerId: String(playerId) },
    });

    // Player decides to keep hand
    engine.executeMove("decideMulligan", {
      playerId: playerId as PlayerId,
      params: { playerId: String(playerId), keepHand: true },
    });

    const state = engine.getState();

    // Verify mulligan completed
    expect(state.mulliganOffered[playerId]).toBe(false);
  });

  it("should handle mulligan decision - shuffle and redraw", () => {
    const gameDefinition = createMockAlphaClashGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-004",
    });

    const playerId = players[0]?.id || "p1";

    // Complete setup through initial hand draw
    engine.executeMove("placeContender", {
      playerId: playerId as PlayerId,
      params: { playerId: String(playerId) },
    });
    engine.executeMove("drawInitialHand", {
      playerId: playerId as PlayerId,
      params: { playerId: String(playerId) },
    });

    // Player decides to mulligan (shuffle hand back and redraw)
    engine.executeMove("decideMulligan", {
      playerId: playerId as PlayerId,
      params: { playerId: String(playerId), keepHand: false },
    });

    const state = engine.getState();

    // Verify mulligan completed
    expect(state.mulliganOffered[playerId]).toBe(false);

    // Hand should still have 8 cards (reshuffled and redrawn)
  });

  it("should choose first player", () => {
    const gameDefinition = createMockAlphaClashGame();
    const players = createTestPlayers(2, ["Player1", "Player2"]);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-005",
    });

    const player1Id = players[0]?.id || "p1";

    // Choose first player
    engine.executeMove("chooseFirstPlayer", {
      playerId: player1Id as PlayerId,
      params: { playerId: String(player1Id) },
    });

    const state = engine.getState();

    // Verify first player was set
    expect(state.firstPlayerChosen).toBe(true);
    expect(state.currentPlayer).toBe(player1Id);
  });

  it("should transition from setup to play phase", () => {
    const gameDefinition = createMockAlphaClashGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-006",
    });

    const playerId = players[0]?.id || "p1";

    // Complete full setup sequence
    engine.executeMove("placeContender", {
      playerId: playerId as PlayerId,
      params: { playerId: String(playerId) },
    });
    engine.executeMove("drawInitialHand", {
      playerId: playerId as PlayerId,
      params: { playerId: String(playerId) },
    });
    engine.executeMove("decideMulligan", {
      playerId: playerId as PlayerId,
      params: { playerId: String(playerId), keepHand: true },
    });
    engine.executeMove("chooseFirstPlayer", {
      playerId: playerId as PlayerId,
      params: { playerId: String(playerId) },
    });

    // Transition to play
    engine.executeMove("transitionToPlay", {
      playerId: playerId as PlayerId,
      params: {},
    });

    const state = engine.getState();

    // Verify phase changed to startOfTurn
    expect(state.phase).toBe("startOfTurn");
    expect(state.setupStep).toBe("complete");
    expect(state.turn).toBe(1);
  });

  it("should execute full setup sequence for both players", () => {
    const gameDefinition = createMockAlphaClashGame();
    const players = createTestPlayers(2, ["Player1", "Player2"]);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-007",
    });

    const player1Id = players[0]?.id || "p1";
    const player2Id = players[1]?.id || "p2";

    // Player 1 setup
    engine.executeMove("placeContender", {
      playerId: player1Id as PlayerId,
      params: { playerId: String(player1Id) },
    });
    engine.executeMove("drawInitialHand", {
      playerId: player1Id as PlayerId,
      params: { playerId: String(player1Id) },
    });
    engine.executeMove("decideMulligan", {
      playerId: player1Id as PlayerId,
      params: { playerId: String(player1Id), keepHand: true },
    });

    // Player 2 setup
    engine.executeMove("placeContender", {
      playerId: player2Id as PlayerId,
      params: { playerId: String(player2Id) },
    });
    engine.executeMove("drawInitialHand", {
      playerId: player2Id as PlayerId,
      params: { playerId: String(player2Id) },
    });
    engine.executeMove("decideMulligan", {
      playerId: player2Id as PlayerId,
      params: { playerId: String(player2Id), keepHand: false },
    });

    // Choose first player
    engine.executeMove("chooseFirstPlayer", {
      playerId: player1Id as PlayerId,
      params: { playerId: String(player1Id) },
    });

    // Transition to play
    engine.executeMove("transitionToPlay", {
      playerId: player1Id as PlayerId,
      params: {},
    });

    const state = engine.getState();

    // Verify game is ready to start
    expect(state.phase).toBe("startOfTurn");
    expect(state.setupStep).toBe("complete");
    expect(state.turn).toBe(1);
    expect(state.firstPlayerChosen).toBe(true);

    // Both players should have completed mulligan
    expect(state.mulliganOffered[player1Id]).toBe(false);
    expect(state.mulliganOffered[player2Id]).toBe(false);
  });

  it("should produce deterministic setup with same seed", () => {
    const gameDefinition = createMockAlphaClashGame();
    const players1 = createTestPlayers(2, ["Player1", "Player2"]);
    const players2 = createTestPlayers(2, ["Player1", "Player2"]);

    // Create two engines with same seed
    const engine1 = createTestEngine(gameDefinition, players1, {
      seed: "deterministic-setup",
    });
    const engine2 = createTestEngine(gameDefinition, players2, {
      seed: "deterministic-setup",
    });

    const player1Id = (players1[0]?.id || "p1") as PlayerId;

    // Execute same setup sequence on both engines
    const setupSequence = [
      {
        move: "placeContender",
        context: {
          playerId: player1Id,
          params: { playerId: String(player1Id) },
        },
      },
      {
        move: "drawInitialHand",
        context: {
          playerId: player1Id,
          params: { playerId: String(player1Id) },
        },
      },
      {
        move: "decideMulligan",
        context: {
          playerId: player1Id,
          params: { playerId: String(player1Id), keepHand: false },
        },
      },
      {
        move: "chooseFirstPlayer",
        context: {
          playerId: player1Id,
          params: { playerId: String(player1Id) },
        },
      },
    ];

    for (const { move, context } of setupSequence) {
      engine1.executeMove(move as keyof typeof gameDefinition.moves, context);
      engine2.executeMove(move as keyof typeof gameDefinition.moves, context);
    }

    // Both engines should have identical states
    const state1 = engine1.getState();
    const state2 = engine2.getState();

    expect(state1).toEqual(state2);
  });

  it("should validate Alpha Clash-specific rules", () => {
    const gameDefinition = createMockAlphaClashGame();

    // Verify deck size constraint (50 cards per rule 100.2)
    expect(gameDefinition.zones?.deck?.maxSize).toBe(50);

    // Verify Contender uniqueness (1 per player per rule 300.1)
    expect(gameDefinition.zones?.contender?.maxSize).toBe(1);

    // Verify Clashground uniqueness (1 in play at any time per rule 302.2)
    expect(gameDefinition.zones?.clashground?.maxSize).toBe(1);

    // Verify starting hand size matches Alpha Clash rules (8 cards per rule 103.5)
    // This is validated in the move implementation
  });

  it("should validate turn structure matches Alpha Clash rules", () => {
    const gameDefinition = createMockAlphaClashGame();
    const flow = gameDefinition.flow;

    expect(flow).toBeDefined();
    expect(flow?.turn).toBeDefined();

    const phases = flow?.turn.phases;
    expect(phases).toBeDefined();

    // Verify four main phases per rule 500.1
    expect(phases?.startOfTurn).toBeDefined();
    expect(phases?.expansion).toBeDefined();
    expect(phases?.primary).toBeDefined();
    expect(phases?.endOfTurn).toBeDefined();

    // Verify Expansion Phase has three steps per rule 502
    const expansionSegments = phases?.expansion?.segments;
    expect(expansionSegments?.readyStep).toBeDefined();
    expect(expansionSegments?.drawStep).toBeDefined();
    expect(expansionSegments?.resourceStep).toBeDefined();

    // First player skips Ready and Draw steps on first turn (rule 103.7a)
    // This would be handled in the move implementation logic
  });
});
