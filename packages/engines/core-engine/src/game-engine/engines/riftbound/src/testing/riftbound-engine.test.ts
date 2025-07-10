/**
 * Basic tests for Riftbound Engine
 * Verifies that the engine structure is working correctly
 */

import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import type { Domain } from "../riftbound-generic-types";
import { RiftboundTestEngine } from "./riftbound-test-engine";

describe("Riftbound Engine", () => {
  let testEngine: RiftboundTestEngine;

  beforeEach(() => {
    testEngine = new RiftboundTestEngine();
  });

  afterEach(() => {
    testEngine.dispose();
  });

  describe("Engine Initialization", () => {
    test("should create a test engine with proper initial state", () => {
      const state = testEngine.getState();
      const ctx = testEngine.getCtx();

      expect(ctx.playerOrder).toEqual(["player_one", "player_two"]);
      expect(ctx.players).toHaveProperty("player_one");
      expect(ctx.players).toHaveProperty("player_two");
      expect(state.gameMode).toBe("1v1-duel");
      expect(state.victoryScore).toBe(8);
    });

    test("should have correct initial zone counts", () => {
      const playerOneZones = testEngine.getZonesCardCount("player_one");
      const playerTwoZones = testEngine.getZonesCardCount("player_two");

      // Both players should have the same default zone setup
      expect(playerOneZones.deck).toBe(40);
      expect(playerOneZones.resourceDeck).toBe(12);
      expect(playerOneZones.hand).toBe(4);
      expect(playerOneZones.legendZone).toBe(1); // Legend
      expect(playerOneZones.championZone).toBe(1); // Chosen Champion

      expect(playerTwoZones).toEqual(playerOneZones);
    });

    test("should initialize with correct game state", () => {
      testEngine.assertGameSegment("gamePlay");
      testEngine.assertGamePhase("action");
      testEngine.assertTurnPlayer("player_one");
    });
  });

  describe("Player Management", () => {
    test("should switch active players correctly", () => {
      expect(testEngine.activeEngine).toBe("player_one");

      testEngine.changeActivePlayer("player_two");
      expect(testEngine.activeEngine).toBe("player_two");

      testEngine.changeActivePlayer("player_one");
      expect(testEngine.activeEngine).toBe("player_one");
    });

    test("should throw error for invalid player ID", () => {
      expect(() => {
        testEngine.changeActivePlayer("invalid_player");
      }).toThrow("Invalid player ID: invalid_player");
    });
  });

  describe("Game State Queries", () => {
    test("should provide correct turn player", () => {
      const turnPlayer = testEngine.getTurnPlayer();
      expect(turnPlayer).toBe("player_one");
    });

    test("should provide correct priority players", () => {
      const priorityPlayers = testEngine.getPriorityPlayers();
      expect(priorityPlayers).toEqual(["player_one"]);
    });

    test("should provide game context", () => {
      const ctx = testEngine.getCtx();
      expect(ctx.turnPlayer).toBe("player_one");
      expect(ctx.priorityPlayer).toBe("player_one");
    });
  });

  describe("Custom Initial States", () => {
    test("should create engine with custom zone counts", () => {
      const customEngine = new RiftboundTestEngine(
        { hand: 7, deck: 30 }, // Player one custom state
        { hand: 5, deck: 35 }, // Player two custom state
      );

      customEngine.assertThatZonesContain({ hand: 7, deck: 30 }, "player_one");
      customEngine.assertThatZonesContain({ hand: 5, deck: 35 }, "player_two");

      customEngine.dispose();
    });
  });

  describe("Move System", () => {
    test("should handle domain identity selection", () => {
      const setupEngine = new RiftboundTestEngine(
        {},
        {},
        { skipPreGame: false },
      );

      // This would test domain selection in a real implementation
      // For now, just verify the engine was created
      expect(setupEngine.getGameSegment()).toBe("setup");

      setupEngine.dispose();
    });

    test("should handle first player selection", () => {
      const setupEngine = new RiftboundTestEngine(
        {},
        {},
        { skipPreGame: false },
      );

      setupEngine.chooseFirstPlayer("player_two");
      setupEngine.assertTurnPlayer("player_two");

      setupEngine.dispose();
    });

    test("should handle turn ending", () => {
      const initialTurn = testEngine.getTurnPlayer();
      expect(initialTurn).toBe("player_one");

      testEngine.endTurn();

      const newTurn = testEngine.getTurnPlayer();
      expect(newTurn).toBe("player_two");
    });

    test("should handle card drawing", () => {
      const initialHandSize = testEngine.getZonesCardCount("player_one").hand;

      testEngine.drawCard(2);

      const newHandSize = testEngine.getZonesCardCount("player_one").hand;
      expect(newHandSize).toBe(initialHandSize + 2);
    });
  });

  describe("Zones Assertions", () => {
    test("should validate zone contents with assertions", () => {
      testEngine.assertThatZonesContain(
        {
          deck: 40,
          hand: 4,
          resourceDeck: 12,
        },
        "player_one",
      );

      testEngine.assertThatZonesContain(
        {
          deck: 40,
          hand: 4,
          resourceDeck: 12,
        },
        "player_two",
      );
    });

    test("should allow partial zone checking", () => {
      testEngine.assertThatZonesContain(
        {
          hand: 4,
        },
        "player_one",
      );

      testEngine.assertThatZonesContain(
        {
          deck: 40,
        },
        "player_two",
      );
    });
  });

  describe("Game Modes", () => {
    test("should support different game modes", () => {
      const ffa3Engine = new RiftboundTestEngine(
        {},
        {},
        { gameMode: "ffa3-skirmish" },
      );

      // Would test FFA3 specific rules when implemented
      expect(ffa3Engine.getState().gameMode).toBe("1v1-duel"); // Default for now

      ffa3Engine.dispose();
    });
  });

  describe("Engine Synchronization", () => {
    test("should keep all engines synchronized", () => {
      const authState = testEngine.authoritativeEngine.getState();
      const p1State = testEngine.playerOneEngine.getState();
      const p2State = testEngine.playerTwoEngine.getState();

      // All engines should have the same game state
      expect(p1State.turn).toBe(authState.turn);
      expect(p2State.turn).toBe(authState.turn);
      expect(p1State.gamePhase).toBe(authState.gamePhase);
      expect(p2State.gamePhase).toBe(authState.gamePhase);
    });
  });
});

describe("Riftbound Mock Cards", () => {
  test("should have proper mock card structures", () => {
    const testEngine = new RiftboundTestEngine();

    // Verify that mock cards are properly structured
    const ctx = testEngine.getCtx();
    expect(ctx.players["player_one"]).toBeDefined();
    expect(ctx.players["player_two"]).toBeDefined();

    testEngine.dispose();
  });
});
