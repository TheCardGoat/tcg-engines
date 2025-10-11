import { describe, expect, it } from "bun:test";
import { createTestEngine } from "../testing/test-engine-builder";
import { createTestPlayers } from "../testing/test-player-builder";
import type { PlayerId } from "../types";
import { createMockGrandArchiveGame } from "./createMockGrandArchiveGame";

/**
 * Grand Archive Card Game - Beginning of Game Test
 *
 * This test validates the core engine's handling of Grand Archive's game initialization.
 * According to Grand Archive rules:
 * - Each player has 40-card main deck and 15-card material deck
 * - Each player starts with a champion at level 0
 * - Turn structure: Wake Up → Materialize → Recollection → Draw → Main → End
 * - Opportunity system: Players get priority windows in specific phases
 *
 * Goal: Test how core engine handles Grand Archive's unique mechanics and flow
 */
describe("Grand Archive Game - Beginning of Game Procedure", () => {
  it("should initialize game with proper setup phase", () => {
    // Create game definition
    const gameDefinition = createMockGrandArchiveGame();

    // Create 2 players
    const players = createTestPlayers(2, ["Player1", "Player2"]);

    // Initialize engine with deterministic seed
    const engine = createTestEngine(gameDefinition, players, {
      seed: "ga-test-001",
    });

    // Verify initial state from setup function
    const state = engine.getState();
    expect(state.phase).toBe("setup");
    expect(state.turn).toBe(0);
    expect(state.currentPlayer).toBe(players[0]?.id);
    expect(state.opportunityPlayer).toBeNull();

    // Verify champions start at level 0 with no damage
    for (const playerId of players.map((p) => p.id)) {
      expect(state.champions[playerId].level).toBe(0);
      expect(state.champions[playerId].damage).toBe(0);
    }

    expect(state.hasDrawnThisTurn[players[0]?.id || "p1"]).toBe(false);
    expect(state.hasDrawnThisTurn[players[1]?.id || "p2"]).toBe(false);
    expect(state.hasMaterializedThisTurn[players[0]?.id || "p1"]).toBe(false);
    expect(state.hasMaterializedThisTurn[players[1]?.id || "p2"]).toBe(false);
  });

  it("should have proper zone configuration for Grand Archive", () => {
    const gameDefinition = createMockGrandArchiveGame();

    // Verify zone configurations directly from game definition
    const zones = gameDefinition.zones;
    expect(zones).toBeDefined();

    // Verify all Grand Archive zones exist
    expect(zones?.hand).toBeDefined();
    expect(zones?.mainDeck).toBeDefined();
    expect(zones?.materialDeck).toBeDefined();
    expect(zones?.memory).toBeDefined();
    expect(zones?.field).toBeDefined();
    expect(zones?.graveyard).toBeDefined();
    expect(zones?.banishment).toBeDefined();
    expect(zones?.effectsStack).toBeDefined();
    expect(zones?.intent).toBeDefined();

    // Verify zone configurations
    expect(zones?.mainDeck?.maxSize).toBe(40);
    expect(zones?.materialDeck?.maxSize).toBe(15);

    // Verify visibility settings
    expect(zones?.hand?.visibility).toBe("private");
    expect(zones?.mainDeck?.visibility).toBe("secret");
    expect(zones?.materialDeck?.visibility).toBe("secret");
    expect(zones?.memory?.visibility).toBe("private");
    expect(zones?.field?.visibility).toBe("public");
    expect(zones?.graveyard?.visibility).toBe("public");
    expect(zones?.banishment?.visibility).toBe("public");
    expect(zones?.effectsStack?.visibility).toBe("public");
    expect(zones?.intent?.visibility).toBe("public");

    // Verify ordered settings
    expect(zones?.mainDeck?.ordered).toBe(true);
    expect(zones?.materialDeck?.ordered).toBe(true);
    expect(zones?.effectsStack?.ordered).toBe(true);
    expect(zones?.hand?.ordered).toBe(false);
    expect(zones?.field?.ordered).toBe(false);
  });

  it("should have all required game moves defined", () => {
    const gameDefinition = createMockGrandArchiveGame();

    // Verify all setup moves exist
    expect(gameDefinition.moves.initializeGame).toBeDefined();
    expect(gameDefinition.moves.chooseFirstPlayer).toBeDefined();
    expect(gameDefinition.moves.shuffleDecks).toBeDefined();
    expect(gameDefinition.moves.drawStartingHand).toBeDefined();

    // Verify all gameplay moves exist
    expect(gameDefinition.moves.materializeCard).toBeDefined();
    expect(gameDefinition.moves.playCard).toBeDefined();
    expect(gameDefinition.moves.declareAttack).toBeDefined();
    expect(gameDefinition.moves.declareRetaliation).toBeDefined();
    expect(gameDefinition.moves.activateAbility).toBeDefined();
    expect(gameDefinition.moves.passOpportunity).toBeDefined();
    expect(gameDefinition.moves.endPhase).toBeDefined();
    expect(gameDefinition.moves.concede).toBeDefined();
  });

  it("should have correct phase flow structure", () => {
    const gameDefinition = createMockGrandArchiveGame();

    // Verify flow structure
    expect(gameDefinition.flow).toBeDefined();
    expect(gameDefinition.flow?.turn).toBeDefined();
    expect(gameDefinition.flow?.turn.initialPhase).toBe("wakeUp");

    const phases = gameDefinition.flow?.turn.phases;
    expect(phases).toBeDefined();

    // Verify all phases exist in correct order
    expect(phases?.wakeUp?.order).toBe(1);
    expect(phases?.materialize?.order).toBe(2);
    expect(phases?.recollection?.order).toBe(3);
    expect(phases?.draw?.order).toBe(4);
    expect(phases?.main?.order).toBe(5);
    expect(phases?.end?.order).toBe(6);

    // Verify phase progression
    expect(phases?.wakeUp?.next).toBe("materialize");
    expect(phases?.materialize?.next).toBe("recollection");
    expect(phases?.recollection?.next).toBe("draw");
    expect(phases?.draw?.next).toBe("main");
    expect(phases?.main?.next).toBe("end");
    expect(phases?.end?.next).toBe("wakeUp");

    // Verify auto-advance for specific phases
    expect(phases?.wakeUp?.endIf).toBeDefined();
    expect(phases?.materialize?.endIf).toBeDefined();
    expect(phases?.draw?.endIf).toBeDefined();
    expect(phases?.end?.endIf).toBeDefined();
  });

  it("should support deterministic gameplay with seed", () => {
    const gameDefinition = createMockGrandArchiveGame();
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
 * Grand Archive Card Game - Setup Moves Test
 *
 * This test suite validates the beginning-of-game procedure as a series
 * of testable moves that demonstrate how the core engine handles Grand Archive's
 * dual deck system and champion initialization.
 */
describe("Grand Archive Game - Setup Moves", () => {
  it("should initialize decks for a player", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const players = createTestPlayers(2, ["Player1", "Player2"]);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-001",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Execute initializeGame for Player 1
    engine.executeMove("initializeGame", {
      playerId: playerId as PlayerId,
      params: { playerId },
    });

    // Move should execute without errors
    // In full implementation, this would create 40 main deck + 15 material deck cards
  });

  it("should choose first player", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-002",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Choose first player
    engine.executeMove("chooseFirstPlayer", {
      playerId: playerId as PlayerId,
      params: { playerId },
    });

    const state = engine.getState();

    // Verify game transitioned to wakeUp phase
    expect(state.phase).toBe("wakeUp");
    expect(state.turn).toBe(1);
    expect(state.currentPlayer).toBe(playerId);
  });

  it("should shuffle both decks for a player", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-003",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Initialize decks first
    engine.executeMove("initializeGame", {
      playerId: playerId as PlayerId,
      params: { playerId },
    });

    // Shuffle decks
    engine.executeMove("shuffleDecks", {
      playerId: playerId as PlayerId,
      params: { playerId },
    });

    // Move should execute without errors
    // In full implementation, this would shuffle both main and material decks
  });

  it("should draw starting hand", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const players = createTestPlayers(2);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-004",
    });

    const playerId = players[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Complete setup through deck initialization
    engine.executeMove("initializeGame", {
      playerId: playerId as PlayerId,
      params: { playerId },
    });
    engine.executeMove("shuffleDecks", {
      playerId: playerId as PlayerId,
      params: { playerId },
    });

    // Draw starting hand (5 cards)
    engine.executeMove("drawStartingHand", {
      playerId: playerId as PlayerId,
      params: { playerId, count: 5 },
    });

    // Move should execute without errors
    // In full implementation, this would draw 5 cards to hand
  });

  it("should execute full setup sequence for both players", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const players = createTestPlayers(2, ["Player1", "Player2"]);
    const engine = createTestEngine(gameDefinition, players, {
      seed: "setup-test-005",
    });

    const player1Id = players[0]?.id;
    const player2Id = players[1]?.id;
    if (!player1Id) throw new Error("Player 1 ID not found");
    if (!player2Id) throw new Error("Player 2 ID not found");

    // Player 1 setup
    engine.executeMove("initializeGame", {
      playerId: player1Id as PlayerId,
      params: { playerId: player1Id },
    });
    engine.executeMove("shuffleDecks", {
      playerId: player1Id as PlayerId,
      params: { playerId: player1Id },
    });
    engine.executeMove("drawStartingHand", {
      playerId: player1Id as PlayerId,
      params: { playerId: player1Id, count: 5 },
    });

    // Player 2 setup
    engine.executeMove("initializeGame", {
      playerId: player2Id as PlayerId,
      params: { playerId: player2Id },
    });
    engine.executeMove("shuffleDecks", {
      playerId: player2Id as PlayerId,
      params: { playerId: player2Id },
    });
    engine.executeMove("drawStartingHand", {
      playerId: player2Id as PlayerId,
      params: { playerId: player2Id, count: 5 },
    });

    // Choose first player
    engine.executeMove("chooseFirstPlayer", {
      playerId: player1Id as PlayerId,
      params: { playerId: player1Id },
    });

    const state = engine.getState();

    // Verify game is ready to start
    expect(state.phase).toBe("wakeUp");
    expect(state.turn).toBe(1);
    expect(state.currentPlayer).toBe(player1Id);
  });

  it("should produce deterministic setup with same seed", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const players1 = createTestPlayers(2, ["Player1", "Player2"]);
    const players2 = createTestPlayers(2, ["Player1", "Player2"]);

    // Create two engines with same seed
    const engine1 = createTestEngine(gameDefinition, players1, {
      seed: "deterministic-setup",
    });
    const engine2 = createTestEngine(gameDefinition, players2, {
      seed: "deterministic-setup",
    });

    const playerId = players1[0]?.id;
    if (!playerId) throw new Error("Player ID not found");

    // Execute same setup sequence on both engines
    const setupSequence = [
      {
        move: "initializeGame" as const,
        params: { playerId: playerId as PlayerId, params: { playerId } },
      },
      {
        move: "shuffleDecks" as const,
        params: { playerId: playerId as PlayerId, params: { playerId } },
      },
      {
        move: "drawStartingHand" as const,
        params: {
          playerId: playerId as PlayerId,
          params: { playerId, count: 5 },
        },
      },
    ];

    for (const { move, params } of setupSequence) {
      engine1.executeMove(move, params);
      engine2.executeMove(move, params);
    }

    // Both engines should have identical states
    const state1 = engine1.getState();
    const state2 = engine2.getState();

    expect(state1).toEqual(state2);
  });
});

/**
 * Grand Archive Card Game - Flow Validation Test
 *
 * This test suite validates the turn structure and Opportunity system.
 * Tests ensure phases progress correctly and Opportunity windows are
 * properly configured.
 */
describe("Grand Archive Game - Flow Validation", () => {
  it("should verify Wake Up phase auto-advances", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const flow = gameDefinition.flow;

    // Wake Up phase should have endIf that returns true
    expect(flow?.turn.phases?.wakeUp?.endIf).toBeDefined();
    const wakeUpEndIf = flow?.turn.phases?.wakeUp?.endIf;
    if (wakeUpEndIf) {
      expect(wakeUpEndIf({} as any)).toBe(true);
    }
  });

  it("should verify Materialize phase auto-advances", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const flow = gameDefinition.flow;

    // Materialize phase should have endIf that returns true
    expect(flow?.turn.phases?.materialize?.endIf).toBeDefined();
    const materializeEndIf = flow?.turn.phases?.materialize?.endIf;
    if (materializeEndIf) {
      expect(materializeEndIf({} as any)).toBe(true);
    }
  });

  it("should verify Recollection phase has Opportunity", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const flow = gameDefinition.flow;

    // Recollection phase should have onBegin (grants Opportunity)
    expect(flow?.turn.phases?.recollection?.onBegin).toBeDefined();
    expect(flow?.turn.phases?.recollection?.next).toBe("draw");
  });

  it("should verify Draw phase auto-advances", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const flow = gameDefinition.flow;

    // Draw phase should have endIf that returns true
    expect(flow?.turn.phases?.draw?.endIf).toBeDefined();
    const drawEndIf = flow?.turn.phases?.draw?.endIf;
    if (drawEndIf) {
      expect(drawEndIf({} as any)).toBe(true);
    }
  });

  it("should verify Main phase has Opportunity", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const flow = gameDefinition.flow;

    // Main phase should have onBegin (grants Opportunity)
    expect(flow?.turn.phases?.main?.onBegin).toBeDefined();
    expect(flow?.turn.phases?.main?.next).toBe("end");
  });

  it("should verify End phase has Opportunity", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const flow = gameDefinition.flow;

    // End phase should have onBegin (grants Opportunity)
    expect(flow?.turn.phases?.end?.onBegin).toBeDefined();
    expect(flow?.turn.phases?.end?.next).toBe("wakeUp");
  });

  it("should verify complete phase progression cycle", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const flow = gameDefinition.flow;

    if (!flow?.turn.phases) {
      throw new Error("Phases not defined");
    }

    // Verify complete cycle: wakeUp → materialize → recollection → draw → main → end → wakeUp
    const phases = flow.turn.phases;
    expect(phases.wakeUp.next).toBe("materialize");
    expect(phases.materialize.next).toBe("recollection");
    expect(phases.recollection.next).toBe("draw");
    expect(phases.draw.next).toBe("main");
    expect(phases.main.next).toBe("end");
    expect(phases.end.next).toBe("wakeUp");
  });

  it("should verify Opportunity system phases have onBegin hooks", () => {
    const gameDefinition = createMockGrandArchiveGame();
    const flow = gameDefinition.flow;

    // Phases with Opportunity should have onBegin hooks
    expect(flow?.turn.phases?.recollection?.onBegin).toBeDefined();
    expect(flow?.turn.phases?.main?.onBegin).toBeDefined();
    expect(flow?.turn.phases?.end?.onBegin).toBeDefined();

    // Phases without Opportunity also have onBegin (to set opportunityPlayer = null)
    expect(flow?.turn.phases?.wakeUp?.onBegin).toBeDefined();
    expect(flow?.turn.phases?.materialize?.onBegin).toBeDefined();
    expect(flow?.turn.phases?.draw?.onBegin).toBeDefined();
  });
});

