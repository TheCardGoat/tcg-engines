import { describe, expect, it } from "bun:test";
import type {
  MoveContext,
  MoveDefinition,
  MoveDefinitions,
  MoveResult,
} from "../move-definition";

// Test state
type TestState = {
  counter: number;
  playerScores: Record<string, number>;
};

// Test moves
type TestMoves = {
  increment: { amount: number };
  decrement: Record<string, never>;
  scorePoint: { playerId: string };
};

describe("MoveDefinition type system", () => {
  describe("MoveDefinition with reducer", () => {
    it("should define a move with a reducer function", () => {
      const incrementMove: MoveDefinition<TestState, TestMoves["increment"]> = {
        reducer: (state, context) => {
          state.counter += context.move.params.amount;
          return state;
        },
      };

      expect(typeof incrementMove.reducer).toBe("function");
    });

    it("should allow reducer to modify state via Immer draft", () => {
      const _testState: TestState = {
        counter: 0,
        playerScores: {},
      };

      const move: MoveDefinition<TestState, TestMoves["increment"]> = {
        reducer: (state, context) => {
          state.counter += context.move.params.amount;
          return state;
        },
      };

      const context: MoveContext<TestState, TestMoves["increment"]> = {
        move: {
          name: "increment",
          params: { amount: 5 },
          playerId: "player-1",
        },
        rng: {
          random: () => 0.5,
          randomInt: (min, max) => Math.floor((max - min) / 2) + min,
          pick: (arr) => arr[0],
          shuffle: (arr) => arr,
          rollDice: (sides) => Math.ceil(sides / 2),
          flipCoin: () => true,
          getSeed: () => "test-seed",
          setSeed: () => {},
          createChild: () => ({}) as never,
        },
      };

      // We'll test actual execution with Immer in implementation
      expect(move.reducer).toBeDefined();
      expect(context.move.params.amount).toBe(5);
    });
  });

  describe("MoveDefinition with optional condition", () => {
    it("should support optional condition function", () => {
      const conditionalMove: MoveDefinition<TestState, TestMoves["increment"]> =
        {
          condition: (state, _context) => {
            return state.counter < 10;
          },
          reducer: (state, context) => {
            state.counter += context.move.params.amount;
            return state;
          },
        };

      expect(typeof conditionalMove.condition).toBe("function");
      expect(typeof conditionalMove.reducer).toBe("function");
    });
  });

  describe("MoveDefinition with metadata", () => {
    it("should support move metadata for documentation and tooling", () => {
      const documentedMove: MoveDefinition<TestState, TestMoves["increment"]> =
        {
          reducer: (state, context) => {
            state.counter += context.move.params.amount;
            return state;
          },
          metadata: {
            description: "Increments the counter by a specified amount",
            requiresTarget: false,
            tags: ["basic", "counter"],
          },
        };

      expect(documentedMove.metadata?.description).toBe(
        "Increments the counter by a specified amount",
      );
      expect(documentedMove.metadata?.requiresTarget).toBe(false);
      expect(documentedMove.metadata?.tags).toEqual(["basic", "counter"]);
    });
  });

  describe("MoveDefinitions exhaustive mapping", () => {
    it("should create exhaustive mapping of move names to definitions", () => {
      const moves: MoveDefinitions<TestState, TestMoves> = {
        increment: {
          reducer: (state, context) => {
            state.counter += context.move.params.amount;
            return state;
          },
        },
        decrement: {
          reducer: (state) => {
            state.counter -= 1;
            return state;
          },
        },
        scorePoint: {
          reducer: (state, context) => {
            const { playerId } = context.move.params;
            state.playerScores[playerId] =
              (state.playerScores[playerId] || 0) + 1;
            return state;
          },
        },
      };

      expect(moves.increment).toBeDefined();
      expect(moves.decrement).toBeDefined();
      expect(moves.scorePoint).toBeDefined();
      expect(Object.keys(moves)).toHaveLength(3);
    });

    it("should enforce all moves are present at type level", () => {
      // @ts-expect-error - missing 'decrement' move
      const incompleteMoves: MoveDefinitions<TestState, TestMoves> = {
        increment: {
          reducer: (state) => state,
        },
        scorePoint: {
          reducer: (state) => state,
        },
      };

      expect(incompleteMoves).toBeDefined();
    });
  });

  describe("MoveContext type", () => {
    it("should provide move information and RNG in context", () => {
      const context: MoveContext<TestState, TestMoves["increment"]> = {
        move: {
          name: "increment",
          params: { amount: 3 },
          playerId: "player-1",
        },
        rng: {
          random: () => 0.5,
          randomInt: (min, _max) => min,
          pick: (arr) => arr[0],
          shuffle: (arr) => arr,
          rollDice: (_sides) => 1,
          flipCoin: () => true,
          getSeed: () => "test-seed",
          setSeed: () => {},
          createChild: () => ({}) as never,
        },
      };

      expect(context.move.name).toBe("increment");
      expect(context.move.params.amount).toBe(3);
      expect(context.move.playerId).toBe("player-1");
      expect(typeof context.rng.random).toBe("function");
    });
  });

  describe("MoveResult type", () => {
    it("should represent successful move execution", () => {
      const successResult: MoveResult<TestState> = {
        success: true,
        state: {
          counter: 5,
          playerScores: {},
        },
      };

      expect(successResult.success).toBe(true);
      expect(successResult.state.counter).toBe(5);
    });

    it("should represent failed move execution with error", () => {
      const failureResult: MoveResult<TestState> = {
        success: false,
        error: "Move condition not met",
      };

      expect(failureResult.success).toBe(false);
      expect(failureResult.error).toBe("Move condition not met");
    });
  });
});
