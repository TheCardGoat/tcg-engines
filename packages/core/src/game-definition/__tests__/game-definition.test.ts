import { describe, expect, it } from "bun:test";
import type { Draft } from "immer";
import { createPlayerId } from "../../types";
import type { GameDefinition } from "../game-definition";
import type { GameMoveDefinitions } from "../move-definitions";

/**
 * Test suite for GameDefinition type system
 *
 * Task 10.1: Write tests for GameDefinition type with generics
 *
 * Validates:
 * - Generic type parameters work correctly
 * - All required fields are present
 * - Optional fields work as expected
 * - Type safety is preserved
 */

// Example game state for testing
type TestGameState = {
  players: Array<{ id: string; name: string; score: number }>;
  currentPlayerIndex: number;
  phase: "setup" | "playing" | "ended";
  winner?: string;
};

// Example moves for testing
type TestMoves = {
  incrementScore: { playerId: string; amount: number };
  nextPlayer: Record<string, never>;
  endGame: { winnerId: string };
};

describe("GameDefinition - Type System", () => {
  describe("basic structure", () => {
    it("should create a valid GameDefinition with all required fields", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        incrementScore: {
          reducer: (draft, context) => {
            const player = draft.players.find((p) => p.id === context.playerId);
            if (player && context.params?.amount) {
              player.score += context.params.amount as number;
            }
          },
        },
        nextPlayer: {
          reducer: (draft) => {
            draft.currentPlayerIndex =
              (draft.currentPlayerIndex + 1) % draft.players.length;
          },
        },
        endGame: {
          reducer: (draft, context) => {
            draft.phase = "ended";
            if (context.params?.winnerId) {
              draft.winner = context.params.winnerId as string;
            }
          },
        },
      };

      const definition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p, i) => ({
            id: p.id,
            name: p.name || `Player ${i + 1}`,
            score: 0,
          })),
          currentPlayerIndex: 0,
          phase: "setup",
        }),
        moves,
      };

      expect(definition.name).toBe("Test Game");
      expect(definition.setup).toBeFunction();
      expect(definition.moves).toEqual(moves);
    });

    it("should work with optional endIf field", () => {
      const definition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: () => ({
          players: [],
          currentPlayerIndex: 0,
          phase: "setup",
        }),
        moves: {} as GameMoveDefinitions<TestGameState, TestMoves>,
        endIf: (state) => {
          if (state.phase === "ended" && state.winner) {
            return {
              winner: state.winner,
              reason: "game-ended",
            };
          }
          return undefined;
        },
      };

      expect(definition.endIf).toBeFunction();
    });

    it("should work with optional playerView field", () => {
      const definition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: () => ({
          players: [],
          currentPlayerIndex: 0,
          phase: "setup",
        }),
        moves: {} as GameMoveDefinitions<TestGameState, TestMoves>,
        playerView: (state, playerId) => {
          // Filter state for this player
          return {
            ...state,
            players: state.players.map((p) => ({
              ...p,
              // Hide scores from other players
              score: p.id === playerId ? p.score : 0,
            })),
          };
        },
      };

      expect(definition.playerView).toBeFunction();
    });
  });

  describe("generic type safety", () => {
    it("should enforce state type in setup function", () => {
      const definition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: (players) => {
          // TypeScript should enforce return type
          const state: TestGameState = {
            players: players.map((p) => ({
              id: p.id,
              name: p.name || "Player",
              score: 0,
            })),
            currentPlayerIndex: 0,
            phase: "setup",
          };
          return state;
        },
        moves: {} as GameMoveDefinitions<TestGameState, TestMoves>,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];
      const initialState = definition.setup(players);

      expect(initialState.players).toHaveLength(2);
      expect(initialState.phase).toBe("setup");
    });

    it("should enforce move types in MoveDefinitions", () => {
      // This test validates type safety at compile time
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        incrementScore: {
          reducer: (draft: Draft<TestGameState>, context) => {
            // context.params should be type-checked
            const amount = context.params?.amount as number;
            const player = draft.players[0];
            if (player) {
              player.score += amount;
            }
          },
        },
        nextPlayer: {
          reducer: (draft: Draft<TestGameState>) => {
            draft.currentPlayerIndex += 1;
          },
        },
        endGame: {
          reducer: (draft: Draft<TestGameState>, context) => {
            draft.phase = "ended";
            draft.winner = context.params?.winnerId as string;
          },
        },
      };

      expect(Object.keys(moves)).toEqual([
        "incrementScore",
        "nextPlayer",
        "endGame",
      ]);
    });

    it("should enforce state type in endIf function", () => {
      const definition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: () => ({
          players: [],
          currentPlayerIndex: 0,
          phase: "setup",
        }),
        moves: {} as GameMoveDefinitions<TestGameState, TestMoves>,
        endIf: (state: TestGameState) => {
          // Should have access to all state fields
          if (state.phase === "ended") {
            return {
              winner: state.winner || "none",
              reason: "phase-ended",
            };
          }
          return undefined;
        },
      };

      const testState: TestGameState = {
        players: [],
        currentPlayerIndex: 0,
        phase: "ended",
        winner: "p1",
      };

      const result = definition.endIf?.(testState);
      expect(result).toEqual({ winner: "p1", reason: "phase-ended" });
    });

    it("should enforce state type in playerView function", () => {
      const definition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: () => ({
          players: [],
          currentPlayerIndex: 0,
          phase: "setup",
        }),
        moves: {} as GameMoveDefinitions<TestGameState, TestMoves>,
        playerView: (state: TestGameState, playerId: string) => {
          // Should have access to all state fields
          return {
            ...state,
            players: state.players.map((p) => ({
              ...p,
              score: p.id === playerId ? p.score : 0,
            })),
          };
        },
      };

      const testState: TestGameState = {
        players: [
          { id: "p1", name: "Alice", score: 10 },
          { id: "p2", name: "Bob", score: 20 },
        ],
        currentPlayerIndex: 0,
        phase: "playing",
      };

      const filteredState = definition.playerView?.(testState, "p1");
      expect(filteredState?.players[0]?.score).toBe(10);
      expect(filteredState?.players[1]?.score).toBe(0);
    });
  });

  describe("setup function", () => {
    it("should be deterministic (same players -> same state)", () => {
      const definition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p, i) => ({
            id: p.id,
            name: p.name || `Player ${i + 1}`,
            score: 0,
          })),
          currentPlayerIndex: 0,
          phase: "setup",
        }),
        moves: {} as GameMoveDefinitions<TestGameState, TestMoves>,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const state1 = definition.setup(players);
      const state2 = definition.setup(players);

      expect(state1).toEqual(state2);
    });
  });

  // Note: minPlayers and maxPlayers are not part of GameDefinition spec
  // Player count validation is handled at the application level, not in the core engine
});
