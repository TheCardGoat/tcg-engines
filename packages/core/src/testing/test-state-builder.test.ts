import { describe, expect, it } from "bun:test";
import { createTestState } from "./test-state-builder";

/**
 * Tests for createTestState - State builder for tests
 *
 * Task 2.1: Write tests for test builders (createTestState)
 *
 * Tests verify:
 * - Creating state with default values
 * - Creating state with partial overrides
 * - Creating state with deep overrides
 * - Type safety and inference
 * - Immutability of defaults
 */

type TestGameState = {
  turn: number;
  phase: "setup" | "play" | "end";
  players: Array<{
    id: string;
    name: string;
    health: number;
  }>;
  deck: string[];
};

describe("createTestState", () => {
  describe("Basic Functionality", () => {
    it("should create state with defaults", () => {
      const defaults: TestGameState = {
        turn: 1,
        phase: "setup",
        players: [],
        deck: [],
      };

      const state = createTestState(defaults);

      expect(state).toEqual(defaults);
      expect(state.turn).toBe(1);
      expect(state.phase).toBe("setup");
      expect(state.players).toHaveLength(0);
      expect(state.deck).toHaveLength(0);
    });

    it("should override specific fields", () => {
      const defaults: TestGameState = {
        turn: 1,
        phase: "setup",
        players: [],
        deck: [],
      };

      const state = createTestState(defaults, {
        turn: 5,
        phase: "play",
      });

      expect(state.turn).toBe(5);
      expect(state.phase).toBe("play");
      expect(state.players).toHaveLength(0);
      expect(state.deck).toHaveLength(0);
    });

    it("should override nested fields", () => {
      const defaults: TestGameState = {
        turn: 1,
        phase: "setup",
        players: [
          { id: "p1", name: "Player 1", health: 20 },
          { id: "p2", name: "Player 2", health: 20 },
        ],
        deck: ["card1", "card2"],
      };

      const state = createTestState(defaults, {
        players: [
          { id: "p1", name: "Alice", health: 15 },
          { id: "p2", name: "Bob", health: 18 },
        ],
      });

      expect(state.players[0]?.name).toBe("Alice");
      expect(state.players[0]?.health).toBe(15);
      expect(state.players[1]?.name).toBe("Bob");
      expect(state.players[1]?.health).toBe(18);
      expect(state.turn).toBe(1);
      expect(state.phase).toBe("setup");
    });

    it("should override array fields", () => {
      const defaults: TestGameState = {
        turn: 1,
        phase: "setup",
        players: [],
        deck: ["card1", "card2"],
      };

      const state = createTestState(defaults, {
        deck: ["card3", "card4", "card5"],
      });

      expect(state.deck).toEqual(["card3", "card4", "card5"]);
      expect(state.turn).toBe(1);
    });
  });

  describe("Immutability", () => {
    it("should not modify defaults when creating state", () => {
      const defaults: TestGameState = {
        turn: 1,
        phase: "setup",
        players: [{ id: "p1", name: "Player 1", health: 20 }],
        deck: ["card1"],
      };

      createTestState(defaults, {
        turn: 2,
        players: [{ id: "p1", name: "Modified", health: 10 }],
      });

      // Defaults should remain unchanged
      expect(defaults.turn).toBe(1);
      expect(defaults.players[0]?.name).toBe("Player 1");
      expect(defaults.players[0]?.health).toBe(20);
    });

    it("should not modify defaults when creating multiple states", () => {
      const defaults: TestGameState = {
        turn: 1,
        phase: "setup",
        players: [],
        deck: [],
      };

      const state1 = createTestState(defaults, { turn: 2 });
      const state2 = createTestState(defaults, { turn: 3 });

      expect(defaults.turn).toBe(1);
      expect(state1.turn).toBe(2);
      expect(state2.turn).toBe(3);
    });

    it("should create independent state copies", () => {
      const defaults: TestGameState = {
        turn: 1,
        phase: "setup",
        players: [{ id: "p1", name: "Player 1", health: 20 }],
        deck: ["card1"],
      };

      const state1 = createTestState(defaults);
      const state2 = createTestState(defaults);

      // Modify state1
      state1.players[0]!.health = 10;
      state1.deck.push("card2");

      // state2 should be unaffected
      expect(state2.players[0]?.health).toBe(20);
      expect(state2.deck).toHaveLength(1);
    });
  });

  describe("Type Safety", () => {
    it("should infer correct type from defaults", () => {
      type SimpleState = {
        value: number;
        label: string;
      };

      const defaults: SimpleState = {
        value: 0,
        label: "test",
      };

      const state = createTestState(defaults, { value: 42 });

      // TypeScript should infer state as SimpleState
      expect(state.value).toBe(42);
      expect(state.label).toBe("test");
    });

    it("should allow partial overrides", () => {
      const defaults: TestGameState = {
        turn: 1,
        phase: "setup",
        players: [],
        deck: [],
      };

      // Should accept partial overrides without type errors
      const state1 = createTestState(defaults, { turn: 5 });
      const state2 = createTestState(defaults, { phase: "play" });
      const state3 = createTestState(defaults, {});

      expect(state1.turn).toBe(5);
      expect(state2.phase).toBe("play");
      expect(state3).toEqual(defaults);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty overrides", () => {
      const defaults: TestGameState = {
        turn: 1,
        phase: "setup",
        players: [],
        deck: [],
      };

      const state = createTestState(defaults, {});

      expect(state).toEqual(defaults);
    });

    it("should handle undefined overrides", () => {
      const defaults: TestGameState = {
        turn: 1,
        phase: "setup",
        players: [],
        deck: [],
      };

      const state = createTestState(defaults);

      expect(state).toEqual(defaults);
    });

    it("should handle complex nested structures", () => {
      type ComplexState = {
        meta: {
          gameId: string;
          created: number;
        };
        config: {
          rules: {
            maxPlayers: number;
            turnLimit: number;
          };
        };
      };

      const defaults: ComplexState = {
        meta: {
          gameId: "game-1",
          created: 1000,
        },
        config: {
          rules: {
            maxPlayers: 4,
            turnLimit: 100,
          },
        },
      };

      const state = createTestState(defaults, {
        config: {
          rules: {
            maxPlayers: 6,
            turnLimit: 200,
          },
        },
      });

      expect(state.config.rules.maxPlayers).toBe(6);
      expect(state.config.rules.turnLimit).toBe(200);
      expect(state.meta.gameId).toBe("game-1");
    });

    it("should handle arrays of primitives", () => {
      type ArrayState = {
        numbers: number[];
        strings: string[];
        booleans: boolean[];
      };

      const defaults: ArrayState = {
        numbers: [1, 2, 3],
        strings: ["a", "b"],
        booleans: [true, false],
      };

      const state = createTestState(defaults, {
        numbers: [4, 5, 6, 7],
        strings: ["x"],
      });

      expect(state.numbers).toEqual([4, 5, 6, 7]);
      expect(state.strings).toEqual(["x"]);
      expect(state.booleans).toEqual([true, false]);
    });

    it("should handle null and undefined values", () => {
      type NullableState = {
        optional?: string;
        nullable: string | null;
        value: number;
      };

      const defaults: NullableState = {
        optional: "default",
        nullable: null,
        value: 0,
      };

      const state = createTestState(defaults, {
        optional: undefined,
        nullable: "not-null",
      });

      expect(state.optional).toBeUndefined();
      expect(state.nullable).toBe("not-null");
      expect(state.value).toBe(0);
    });
  });

  describe("Practical Test Scenarios", () => {
    it("should simplify test setup for game states", () => {
      const defaults: TestGameState = {
        turn: 1,
        phase: "setup",
        players: [
          { id: "p1", name: "Player 1", health: 20 },
          { id: "p2", name: "Player 2", health: 20 },
        ],
        deck: Array.from({ length: 40 }, (_, i) => `card${i}`),
      };

      // Test scenario: mid-game state
      const midGameState = createTestState(defaults, {
        turn: 5,
        phase: "play",
        deck: defaults.deck.slice(10),
      });

      expect(midGameState.turn).toBe(5);
      expect(midGameState.phase).toBe("play");
      expect(midGameState.deck).toHaveLength(30);
      expect(midGameState.players).toHaveLength(2);
    });

    it("should support testing edge cases with minimal setup", () => {
      const defaults: TestGameState = {
        turn: 1,
        phase: "setup",
        players: [
          { id: "p1", name: "Player 1", health: 20 },
          { id: "p2", name: "Player 2", health: 20 },
        ],
        deck: ["card1", "card2"],
      };

      // Test scenario: player at low health
      const lowHealthState = createTestState(defaults, {
        players: [
          { id: "p1", name: "Player 1", health: 1 },
          { id: "p2", name: "Player 2", health: 20 },
        ],
      });

      expect(lowHealthState.players[0]?.health).toBe(1);

      // Test scenario: empty deck
      const emptyDeckState = createTestState(defaults, {
        deck: [],
      });

      expect(emptyDeckState.deck).toHaveLength(0);
    });
  });
});
