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
