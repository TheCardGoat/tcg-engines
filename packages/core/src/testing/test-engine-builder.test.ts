import { describe, expect, it } from "bun:test";
import type { GameDefinition } from "../game-definition/game-definition";
import type { GameMoveDefinitions } from "../game-definition/move-definitions";
import { createPlayerId } from "../types";
import { createTestEngine } from "./test-engine-builder";
import { createTestPlayers } from "./test-player-builder";

/**
 * Tests for createTestEngine - Engine builder for tests
 *
 * Task 2.1: Write tests for test builders (createTestEngine)
 *
 * Tests verify:
 * - Creating engine with minimal game definition
 * - Creating engine with custom players
 * - Creating engine with options (seed)
 * - Default player generation
 * - Engine is properly initialized and functional
 */

type SimpleGameState = {
  players: Array<{ id: string; name: string; score: number }>;
  currentPlayer: number;
};

type SimpleMoves = {
  incrementScore: Record<string, never>;
  pass: Record<string, never>;
};

describe("createTestEngine", () => {
  describe("Basic Functionality", () => {
    it("should create engine with minimal game definition and default players", () => {
      const moves: GameMoveDefinitions<SimpleGameState, SimpleMoves> = {
        incrementScore: {
          reducer: (draft: SimpleGameState) => {
            const player = draft.players[draft.currentPlayer];
            if (player) {
              player.score += 1;
            }
          },
        },
        pass: {
          reducer: (draft: SimpleGameState) => {
            draft.currentPlayer =
              (draft.currentPlayer + 1) % draft.players.length;
          },
        },
      };

      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayer: 0,
        }),
        moves,
      };

      const engine = createTestEngine(definition);

      // Engine should be initialized
      expect(engine).toBeDefined();

      // Should have default 2 players
      const state = engine.getState();
      expect(state.players).toHaveLength(2);
      expect(state.players[0]?.name).toBe("Player 1");
      expect(state.players[1]?.name).toBe("Player 2");
    });

    it("should create engine with custom players", () => {
      const moves: GameMoveDefinitions<SimpleGameState, SimpleMoves> = {
        incrementScore: { reducer: () => {} },
        pass: { reducer: () => {} },
      };

      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayer: 0,
        }),
        moves,
      };

      const customPlayers = createTestPlayers(3, ["Alice", "Bob", "Charlie"]);
      const engine = createTestEngine(definition, customPlayers);

      const state = engine.getState();
      expect(state.players).toHaveLength(3);
      expect(state.players[0]?.name).toBe("Alice");
      expect(state.players[1]?.name).toBe("Bob");
      expect(state.players[2]?.name).toBe("Charlie");
    });

    it("should create engine with seed option for deterministic RNG", () => {
      const moves: GameMoveDefinitions<SimpleGameState, SimpleMoves> = {
        incrementScore: { reducer: () => {} },
        pass: { reducer: () => {} },
      };

      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayer: 0,
        }),
        moves,
      };

      const engine = createTestEngine(definition, undefined, {
        seed: "test-seed",
      });

      // Engine should have seeded RNG
      expect(engine.getRNG()).toBeDefined();
      expect(engine.getRNG().getSeed()).toBe("test-seed");
    });
  });

  describe("Engine Functionality", () => {
    it("should create functional engine that can execute moves", () => {
      const moves: GameMoveDefinitions<SimpleGameState, SimpleMoves> = {
        incrementScore: {
          reducer: (draft: SimpleGameState) => {
            const player = draft.players[draft.currentPlayer];
            if (player) {
              player.score += 1;
            }
          },
        },
        pass: { reducer: () => {} },
      };

      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayer: 0,
        }),
        moves,
      };

      const engine = createTestEngine(definition);

      const result = engine.executeMove("incrementScore", {
        playerId: createPlayerId("test-p1"),
        params: {},
      });

      expect(result.success).toBe(true);

      const state = engine.getState();
      expect(state.players[0]?.score).toBe(1);
    });

    it("should create engine with history tracking", () => {
      const moves: GameMoveDefinitions<SimpleGameState, SimpleMoves> = {
        incrementScore: {
          reducer: (draft: SimpleGameState) => {
            const player = draft.players[draft.currentPlayer];
            if (player) {
              player.score += 1;
            }
          },
        },
        pass: { reducer: () => {} },
      };

      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayer: 0,
        }),
        moves,
      };

      const engine = createTestEngine(definition);

      engine.executeMove("incrementScore", {
        playerId: createPlayerId("test-p1"),
        params: {},
      });
      engine.executeMove("incrementScore", {
        playerId: createPlayerId("test-p1"),
        params: {},
      });

      const history = engine.getHistory();
      expect(history.length).toBe(2);
    });

    it("should create engine that supports undo/redo", () => {
      const moves: GameMoveDefinitions<SimpleGameState, SimpleMoves> = {
        incrementScore: {
          reducer: (draft: SimpleGameState) => {
            const player = draft.players[draft.currentPlayer];
            if (player) {
              player.score += 1;
            }
          },
        },
        pass: { reducer: () => {} },
      };

      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayer: 0,
        }),
        moves,
      };

      const engine = createTestEngine(definition);

      engine.executeMove("incrementScore", {
        playerId: createPlayerId("test-p1"),
        params: {},
      });
      expect(engine.getState().players[0]?.score).toBe(1);

      engine.undo();
      expect(engine.getState().players[0]?.score).toBe(0);

      engine.redo();
      expect(engine.getState().players[0]?.score).toBe(1);
    });
  });

  describe("Options", () => {
    it("should accept undefined players and use defaults", () => {
      const moves: GameMoveDefinitions<SimpleGameState, SimpleMoves> = {
        incrementScore: { reducer: () => {} },
        pass: { reducer: () => {} },
      };

      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayer: 0,
        }),
        moves,
      };

      const engine = createTestEngine(definition, undefined);

      const state = engine.getState();
      expect(state.players).toHaveLength(2);
    });

    it("should accept undefined options", () => {
      const moves: GameMoveDefinitions<SimpleGameState, SimpleMoves> = {
        incrementScore: { reducer: () => {} },
        pass: { reducer: () => {} },
      };

      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayer: 0,
        }),
        moves,
      };

      const engine = createTestEngine(definition, undefined, undefined);

      expect(engine).toBeDefined();
      expect(engine.getRNG()).toBeDefined();
    });

    it("should merge custom options with defaults", () => {
      const moves: GameMoveDefinitions<SimpleGameState, SimpleMoves> = {
        incrementScore: { reducer: () => {} },
        pass: { reducer: () => {} },
      };

      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayer: 0,
        }),
        moves,
      };

      const engine = createTestEngine(definition, undefined, {
        seed: "custom-seed",
      });

      expect(engine.getRNG().getSeed()).toBe("custom-seed");
    });
  });

  describe("Edge Cases", () => {
    it("should create engine with single player", () => {
      const moves: GameMoveDefinitions<SimpleGameState, SimpleMoves> = {
        incrementScore: { reducer: () => {} },
        pass: { reducer: () => {} },
      };

      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayer: 0,
        }),
        moves,
      };

      const singlePlayer = createTestPlayers(1, ["Solo"]);
      const engine = createTestEngine(definition, singlePlayer);

      const state = engine.getState();
      expect(state.players).toHaveLength(1);
      expect(state.players[0]?.name).toBe("Solo");
    });

    it("should create engine with many players", () => {
      const moves: GameMoveDefinitions<SimpleGameState, SimpleMoves> = {
        incrementScore: { reducer: () => {} },
        pass: { reducer: () => {} },
      };

      const definition: GameDefinition<SimpleGameState, SimpleMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayer: 0,
        }),
        moves,
      };

      const manyPlayers = createTestPlayers(6);
      const engine = createTestEngine(definition, manyPlayers);

      const state = engine.getState();
      expect(state.players).toHaveLength(6);
    });
  });
});
