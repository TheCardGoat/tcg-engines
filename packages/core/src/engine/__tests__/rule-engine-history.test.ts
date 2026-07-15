import { describe, expect, it } from "bun:test";
import type { GameDefinition } from "../../game-definition/game-definition";
import type { GameMoveDefinitions } from "../../game-definition/move-definitions";
import { createPlayerId } from "../../types";
import { RuleEngine } from "../rule-engine";

/**
 * Task 11: Rule Engine History & Advanced Features Tests
 *
 * Tests for:
 * - History tracking (11.17-11.18)
 * - Undo/Redo (11.15-11.16)
 * - Replay (11.19-11.20)
 * - RNG integration (11.25-11.26)
 * - Flow integration (11.27-11.28)
 */

interface TestGameState {
  players: { id: string; name: string; score: number }[];
  currentPlayerIndex: number;
  randomValue?: number;
}

interface TestMoves {
  incrementScore: { amount: number };
  randomMove: Record<string, never>;
  nextPlayer: Record<string, never>;
}

describe("RuleEngine - History & Replay", () => {
  describe("Task 11.17, 11.18: getHistory", () => {
    it("should track move history", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        incrementScore: {
          reducer: (draft, context) => {
            const player = draft.players[draft.currentPlayerIndex];
            if (player && context.params?.amount) {
              player.score += context.params.amount as number;
            }
          },
        },
        nextPlayer: { reducer: () => {} },
        randomMove: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        moves,
        name: "Test Game",
        setup: (players) => ({
          currentPlayerIndex: 0,
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
        }),
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);

      // Execute some moves
      engine.executeMove("incrementScore", {
        params: { amount: 5 },
        playerId: createPlayerId("p1"),
      });

      engine.executeMove("incrementScore", {
        params: { amount: 3 },
        playerId: createPlayerId("p1"),
      });

      const history = engine.getReplayHistory();

      expect(history).toHaveLength(2);
      expect(history[0]?.moveId).toBe("incrementScore");
      expect(history[0]?.context.params?.amount).toBe(5);
      expect(history[1]?.moveId).toBe("incrementScore");
      expect(history[1]?.context.params?.amount).toBe(3);
    });

    it("should include patches in history", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        incrementScore: {
          reducer: (draft, context) => {
            const player = draft.players[draft.currentPlayerIndex];
            if (player && context.params?.amount) {
              player.score += context.params.amount as number;
            }
          },
        },
        nextPlayer: { reducer: () => {} },
        randomMove: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        moves,
        name: "Test Game",
        setup: (players) => ({
          currentPlayerIndex: 0,
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
        }),
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);

      engine.executeMove("incrementScore", {
        params: { amount: 5 },
        playerId: createPlayerId("p1"),
      });

      const history = engine.getReplayHistory();

      expect(history[0]?.patches).toBeDefined();
      expect(history[0]?.patches.length).toBeGreaterThan(0);
      expect(history[0]?.inversePatches).toBeDefined();
      expect(history[0]?.inversePatches.length).toBeGreaterThan(0);
    });
  });

  describe("Task 11.15, 11.16: Undo/Redo", () => {
    it("should undo last move", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        incrementScore: {
          reducer: (draft, context) => {
            const player = draft.players[draft.currentPlayerIndex];
            if (player && context.params?.amount) {
              player.score += context.params.amount as number;
            }
          },
        },
        nextPlayer: { reducer: () => {} },
        randomMove: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        moves,
        name: "Test Game",
        setup: (players) => ({
          currentPlayerIndex: 0,
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
        }),
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);

      // Execute a move
      engine.executeMove("incrementScore", {
        params: { amount: 5 },
        playerId: createPlayerId("p1"),
      });

      let state = engine.getState();
      expect(state.players[0]?.score).toBe(5);

      // Undo
      const undoSuccess = engine.undo();
      expect(undoSuccess).toBe(true);

      state = engine.getState();
      expect(state.players[0]?.score).toBe(0);
    });

    it("should redo previously undone move", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        incrementScore: {
          reducer: (draft, context) => {
            const player = draft.players[draft.currentPlayerIndex];
            if (player && context.params?.amount) {
              player.score += context.params.amount as number;
            }
          },
        },
        nextPlayer: { reducer: () => {} },
        randomMove: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        moves,
        name: "Test Game",
        setup: (players) => ({
          currentPlayerIndex: 0,
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
        }),
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);

      // Execute, undo, redo
      engine.executeMove("incrementScore", {
        params: { amount: 5 },
        playerId: createPlayerId("p1"),
      });

      engine.undo();
      const redoSuccess = engine.redo();
      expect(redoSuccess).toBe(true);

      const state = engine.getState();
      expect(state.players[0]?.score).toBe(5);
    });

    it("should return false when no moves to undo", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        incrementScore: { reducer: () => {} },
        nextPlayer: { reducer: () => {} },
        randomMove: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        moves,
        name: "Test Game",
        setup: (players) => ({
          currentPlayerIndex: 0,
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
        }),
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);
      const undoSuccess = engine.undo();

      expect(undoSuccess).toBe(false);
    });

    it("should return false when no moves to redo", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        incrementScore: { reducer: () => {} },
        nextPlayer: { reducer: () => {} },
        randomMove: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        moves,
        name: "Test Game",
        setup: (players) => ({
          currentPlayerIndex: 0,
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
        }),
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);
      const redoSuccess = engine.redo();

      expect(redoSuccess).toBe(false);
    });

    it("should truncate forward history on new move after undo", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        incrementScore: {
          reducer: (draft, context) => {
            const player = draft.players[draft.currentPlayerIndex];
            if (player && context.params?.amount) {
              player.score += context.params.amount as number;
            }
          },
        },
        nextPlayer: { reducer: () => {} },
        randomMove: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        moves,
        name: "Test Game",
        setup: (players) => ({
          currentPlayerIndex: 0,
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
        }),
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);

      // Execute two moves
      engine.executeMove("incrementScore", {
        params: { amount: 5 },
        playerId: createPlayerId("p1"),
      });

      engine.executeMove("incrementScore", {
        params: { amount: 3 },
        playerId: createPlayerId("p1"),
      });

      // Undo one
      engine.undo();

      // Execute new move
      engine.executeMove("incrementScore", {
        params: { amount: 7 },
        playerId: createPlayerId("p1"),
      });

      // Should not be able to redo (history was truncated)
      const redoSuccess = engine.redo();
      expect(redoSuccess).toBe(false);

      const state = engine.getState();
      expect(state.players[0]?.score).toBe(12); // 5 + 7
    });
  });

  describe("Task 11.21, 11.22, 11.23, 11.24: Patch Management", () => {
    it("should get patches since specific index", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        incrementScore: {
          reducer: (draft, context) => {
            const player = draft.players[draft.currentPlayerIndex];
            if (player && context.params?.amount) {
              player.score += context.params.amount as number;
            }
          },
        },
        nextPlayer: { reducer: () => {} },
        randomMove: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        moves,
        name: "Test Game",
        setup: (players) => ({
          currentPlayerIndex: 0,
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
        }),
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);

      // Execute three moves
      engine.executeMove("incrementScore", {
        params: { amount: 5 },
        playerId: createPlayerId("p1"),
      });

      engine.executeMove("incrementScore", {
        params: { amount: 3 },
        playerId: createPlayerId("p1"),
      });

      engine.executeMove("incrementScore", {
        params: { amount: 2 },
        playerId: createPlayerId("p1"),
      });

      // Get patches since move 1
      const patches = engine.getPatches(1);

      // Should include patches from moves 2 and 3
      expect(patches.length).toBeGreaterThan(0);
    });

    it("should get all patches when no index specified", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        incrementScore: {
          reducer: (draft, context) => {
            const player = draft.players[draft.currentPlayerIndex];
            if (player && context.params?.amount) {
              player.score += context.params.amount as number;
            }
          },
        },
        nextPlayer: { reducer: () => {} },
        randomMove: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        moves,
        name: "Test Game",
        setup: (players) => ({
          currentPlayerIndex: 0,
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
        }),
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);

      engine.executeMove("incrementScore", {
        params: { amount: 5 },
        playerId: createPlayerId("p1"),
      });

      const patches = engine.getPatches();
      expect(patches.length).toBeGreaterThan(0);
    });
  });

  describe("Task 11.25, 11.26: RNG Integration", () => {
    it("should provide access to seeded RNG", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        incrementScore: { reducer: () => {} },
        nextPlayer: { reducer: () => {} },
        randomMove: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        moves,
        name: "Test Game",
        setup: (players) => ({
          currentPlayerIndex: 0,
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
        }),
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);
      const rng = engine.getRNG();

      expect(rng).toBeDefined();
      expect(rng.random).toBeFunction();
    });

    it("should produce deterministic results with same seed", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        incrementScore: { reducer: () => {} },
        nextPlayer: { reducer: () => {} },
        randomMove: {
          reducer: (draft) => {
            // Moves can access RNG through game state or context
            draft.randomValue = 42; // Placeholder
          },
        },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        moves,
        name: "Test Game",
        setup: (players) => ({
          currentPlayerIndex: 0,
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
        }),
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine1 = new RuleEngine(gameDef, players, { seed: "test-123" });
      const engine2 = new RuleEngine(gameDef, players, { seed: "test-123" });

      const rng1 = engine1.getRNG();
      const rng2 = engine2.getRNG();

      // Same seed -> same random values
      expect(rng1.random()).toBe(rng2.random());
      expect(rng1.random()).toBe(rng2.random());
    });
  });
});
