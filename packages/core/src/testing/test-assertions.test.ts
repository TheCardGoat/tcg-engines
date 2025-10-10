import { describe, expect, it } from "bun:test";
import { RuleEngine } from "../engine/rule-engine";
import type { GameDefinition } from "../game-definition/game-definition";
import type { GameMoveDefinitions } from "../game-definition/move-definitions";
import { createPlayerId, type PlayerId } from "../types";
import {
  expectMoveFailure,
  expectMoveSuccess,
  expectStateProperty,
} from "./test-assertions";

/**
 * Test state for assertions
 */
type TestGameState = {
  players: Array<{
    id: PlayerId;
    name: string;
    score: number;
    hand: string[];
  }>;
  currentPlayerIndex: number;
  turnNumber: number;
  phase: "main" | "end";
  nested: {
    deep: {
      value: number;
    };
  };
};

type TestMoves = {
  addScore: { amount: number };
  drawCard: Record<string, never>;
  invalidMove: Record<string, never>;
};

describe("test-assertions", () => {
  function createTestEngine() {
    const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
      addScore: {
        reducer: (draft, context) => {
          const player = draft.players[draft.currentPlayerIndex];
          if (player && context.params?.amount) {
            player.score += context.params.amount as number;
          }
        },
      },
      drawCard: {
        reducer: (draft) => {
          const player = draft.players[draft.currentPlayerIndex];
          if (player) {
            player.hand.push("card");
          }
        },
      },
      invalidMove: {
        condition: () => false, // Always fails
        reducer: () => {},
      },
    };

    const gameDefinition: GameDefinition<TestGameState, TestMoves> = {
      name: "Test Game",
      setup: (players) => ({
        players: players.map((p) => ({
          id: p.id as PlayerId,
          name: p.name || "Player",
          score: 0,
          hand: [] as string[],
        })),
        currentPlayerIndex: 0,
        turnNumber: 1,
        phase: "main" as const,
        nested: {
          deep: {
            value: 42,
          },
        },
      }),
      moves,
    };

    const players = [
      { id: createPlayerId("p1"), name: "Alice" },
      { id: createPlayerId("p2"), name: "Bob" },
    ];

    return new RuleEngine(gameDefinition, players);
  }

  describe("expectMoveSuccess", () => {
    it("should pass when move succeeds", () => {
      const engine = createTestEngine();

      // Should not throw
      expectMoveSuccess(engine, "addScore", {
        playerId: createPlayerId("p1"),
        params: { amount: 5 },
      });
    });

    it("should fail when move does not succeed", () => {
      const engine = createTestEngine();

      // Should throw because condition fails
      expect(() => {
        expectMoveSuccess(engine, "invalidMove", {
          playerId: createPlayerId("p1"),
          params: {},
        });
      }).toThrow();
    });

    it("should return move result for further assertions", () => {
      const engine = createTestEngine();

      const result = expectMoveSuccess(engine, "addScore", {
        playerId: createPlayerId("p1"),
        params: { amount: 5 },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.patches.length).toBeGreaterThan(0);
      }
    });

    it("should throw with descriptive error message on failure", () => {
      const engine = createTestEngine();

      expect(() => {
        expectMoveSuccess(engine, "invalidMove", {
          playerId: createPlayerId("p1"),
          params: {},
        });
      }).toThrow(/Expected move 'invalidMove' to succeed/);
    });
  });

  describe("expectMoveFailure", () => {
    it("should pass when move fails", () => {
      const engine = createTestEngine();

      // Should not throw
      expectMoveFailure(engine, "invalidMove", {
        playerId: createPlayerId("p1"),
        params: {},
      });
    });

    it("should fail when move succeeds", () => {
      const engine = createTestEngine();

      // Should throw because move succeeds
      expect(() => {
        expectMoveFailure(engine, "addScore", {
          playerId: createPlayerId("p1"),
          params: { amount: 5 },
        });
      }).toThrow();
    });

    it("should return failure result with error", () => {
      const engine = createTestEngine();

      const result = expectMoveFailure(engine, "invalidMove", {
        playerId: createPlayerId("p1"),
        params: {},
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeDefined();
        expect(result.errorCode).toBeDefined();
      }
    });

    it("should optionally check error code", () => {
      const engine = createTestEngine();

      // Should not throw because error code matches
      expectMoveFailure(
        engine,
        "invalidMove",
        { playerId: createPlayerId("p1"), params: {} },
        "CONDITION_FAILED",
      );
    });

    it("should throw when error code does not match", () => {
      const engine = createTestEngine();

      expect(() => {
        expectMoveFailure(
          engine,
          "invalidMove",
          { playerId: createPlayerId("p1"), params: {} },
          "WRONG_CODE",
        );
      }).toThrow(/Expected error code 'WRONG_CODE'/);
    });

    it("should throw with descriptive error message when move succeeds", () => {
      const engine = createTestEngine();

      expect(() => {
        expectMoveFailure(engine, "addScore", {
          playerId: createPlayerId("p1"),
          params: { amount: 5 },
        });
      }).toThrow(/Expected move 'addScore' to fail/);
    });
  });

  describe("expectStateProperty", () => {
    it("should verify top-level property", () => {
      const engine = createTestEngine();

      // Should not throw
      expectStateProperty(engine, "turnNumber", 1);
      expectStateProperty(engine, "phase", "main");
    });

    it("should verify nested property with dot notation", () => {
      const engine = createTestEngine();

      // Should not throw
      expectStateProperty(engine, "nested.deep.value", 42);
    });

    it("should verify array element", () => {
      const engine = createTestEngine();

      expectStateProperty(engine, "players[0].name", "Alice");
      expectStateProperty(engine, "players[1].name", "Bob");
    });

    it("should verify array length", () => {
      const engine = createTestEngine();

      expectStateProperty(engine, "players.length", 2);
    });

    it("should throw when property value does not match", () => {
      const engine = createTestEngine();

      expect(() => {
        expectStateProperty(engine, "turnNumber", 99);
      }).toThrow(/Expected state.turnNumber to be 99/);
    });

    it("should throw when property path does not exist", () => {
      const engine = createTestEngine();

      expect(() => {
        expectStateProperty(
          engine,
          "nonexistent.path" as any,
          "anything" as any,
        );
      }).toThrow(/Property path 'nonexistent.path' not found/);
    });

    it("should work with undefined values", () => {
      const engine = createTestEngine();
      engine.executeMove("addScore", {
        playerId: createPlayerId("p1"),
        params: { amount: 5 },
      });

      // Non-existent property should be undefined
      expect(() => {
        expectStateProperty(
          engine,
          "players[0].nonexistent" as any,
          undefined as any,
        );
      }).toThrow();
    });

    it("should verify state changes after moves", () => {
      const engine = createTestEngine();

      expectStateProperty(engine, "players[0].score", 0);

      engine.executeMove("addScore", {
        playerId: createPlayerId("p1"),
        params: { amount: 10 },
      });

      expectStateProperty(engine, "players[0].score", 10);
    });

    it("should handle complex nested paths", () => {
      const engine = createTestEngine();

      // Draw some cards
      engine.executeMove("drawCard", {
        playerId: createPlayerId("p1"),
        params: {},
      });
      engine.executeMove("drawCard", {
        playerId: createPlayerId("p1"),
        params: {},
      });

      expectStateProperty(engine, "players[0].hand.length", 2);
      expectStateProperty(engine, "players[0].hand[0]", "card");
    });
  });

  describe("integration with RuleEngine", () => {
    it("should work together in a typical test scenario", () => {
      const engine = createTestEngine();

      // Initial state assertions
      expectStateProperty(engine, "turnNumber", 1);
      expectStateProperty(engine, "players[0].score", 0);

      // Execute and verify success
      expectMoveSuccess(engine, "addScore", {
        playerId: createPlayerId("p1"),
        params: { amount: 5 },
      });

      // Verify state changed
      expectStateProperty(engine, "players[0].score", 5);

      // Verify invalid move fails
      expectMoveFailure(engine, "invalidMove", {
        playerId: createPlayerId("p1"),
        params: {},
      });

      // State should be unchanged after failed move
      expectStateProperty(engine, "players[0].score", 5);
    });
  });
});
