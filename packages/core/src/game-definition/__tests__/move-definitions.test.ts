import { describe, expect, it } from "bun:test";
import { produce } from "immer";
import type { MoveContext } from "../../moves/move-system";
import type {
  GameMoveDefinition,
  GameMoveDefinitions,
} from "../move-definitions";

/**
 * Test suite for GameMoveDefinitions type system
 *
 * Task 10.5, 10.6: Write tests for moves mapping
 *
 * Validates:
 * - GameMoveDefinition structure
 * - GameMoveDefinitions exhaustive mapping
 * - Type safety for move reducers
 * - Conditional move execution
 */

type CounterState = {
  count: number;
  player: string;
  locked: boolean;
};

type CounterMoves = {
  increment: { amount: number };
  decrement: { amount: number };
  reset: Record<string, never>;
  setPlayer: { playerId: string };
};

describe("GameMoveDefinitions - Type System", () => {
  describe("GameMoveDefinition structure", () => {
    it("should create a valid GameMoveDefinition with reducer only", () => {
      const incrementMove: GameMoveDefinition<CounterState> = {
        reducer: (draft, context) => {
          const amount = (context.data?.amount as number) || 1;
          draft.count += amount;
        },
      };

      expect(incrementMove.reducer).toBeFunction();
      expect(incrementMove.condition).toBeUndefined();
    });

    it("should create a GameMoveDefinition with condition and reducer", () => {
      const incrementMove: GameMoveDefinition<CounterState> = {
        condition: (state) => !state.locked,
        reducer: (draft, context) => {
          const amount = (context.data?.amount as number) || 1;
          draft.count += amount;
        },
      };

      expect(incrementMove.condition).toBeFunction();
      expect(incrementMove.reducer).toBeFunction();
    });
  });

  describe("GameMoveDefinitions exhaustive mapping", () => {
    it("should map all moves in TMoves type", () => {
      const moves: GameMoveDefinitions<CounterState, CounterMoves> = {
        increment: {
          reducer: (draft, context) => {
            const amount = (context.data?.amount as number) || 1;
            draft.count += amount;
          },
        },
        decrement: {
          reducer: (draft, context) => {
            const amount = (context.data?.amount as number) || 1;
            draft.count -= amount;
          },
        },
        reset: {
          reducer: (draft) => {
            draft.count = 0;
          },
        },
        setPlayer: {
          reducer: (draft, context) => {
            draft.player = (context.data?.playerId as string) || "";
          },
        },
      };

      expect(Object.keys(moves)).toEqual([
        "increment",
        "decrement",
        "reset",
        "setPlayer",
      ]);
    });

    it("should enforce that all move names have definitions", () => {
      // TypeScript will error if any move is missing
      const moves: GameMoveDefinitions<CounterState, CounterMoves> = {
        increment: {
          reducer: (draft) => {
            draft.count += 1;
          },
        },
        decrement: {
          reducer: (draft) => {
            draft.count -= 1;
          },
        },
        reset: {
          reducer: (draft) => {
            draft.count = 0;
          },
        },
        setPlayer: {
          reducer: (draft) => {
            draft.player = "test";
          },
        },
      };

      // All moves should be present
      expect(moves.increment).toBeDefined();
      expect(moves.decrement).toBeDefined();
      expect(moves.reset).toBeDefined();
      expect(moves.setPlayer).toBeDefined();
    });
  });

  describe("move reducer execution", () => {
    it("should execute reducer with Immer draft", () => {
      const incrementMove: GameMoveDefinition<CounterState> = {
        reducer: (draft, context) => {
          const amount = (context.data?.amount as number) || 1;
          draft.count += amount;
        },
      };

      const initialState: CounterState = {
        count: 5,
        player: "p1",
        locked: false,
      };

      const context: MoveContext = {
        playerId: "p1" as any,
        data: { amount: 3 },
      };

      const newState = produce(initialState, (draft) => {
        incrementMove.reducer(draft, context);
      });

      expect(newState.count).toBe(8);
      expect(initialState.count).toBe(5); // Original unchanged
    });

    it("should support complex state modifications", () => {
      const complexMove: GameMoveDefinition<CounterState> = {
        reducer: (draft, context) => {
          draft.count += 1;
          draft.player = context.playerId;
          draft.locked = true;
        },
      };

      const initialState: CounterState = {
        count: 0,
        player: "",
        locked: false,
      };

      const context: MoveContext = {
        playerId: "p1" as any,
      };

      const newState = produce(initialState, (draft) => {
        complexMove.reducer(draft, context);
      });

      expect(newState).toEqual({
        count: 1,
        player: "p1",
        locked: true,
      });
    });
  });

  describe("move conditions", () => {
    it("should evaluate condition before executing move", () => {
      const lockedMove: GameMoveDefinition<CounterState> = {
        condition: (state) => !state.locked,
        reducer: (draft) => {
          draft.count += 1;
        },
      };

      const unlockedState: CounterState = {
        count: 0,
        player: "p1",
        locked: false,
      };

      const lockedState: CounterState = {
        count: 0,
        player: "p1",
        locked: true,
      };

      const context: MoveContext = { playerId: "p1" as any };

      // Should pass condition
      expect(lockedMove.condition?.(unlockedState, context)).toBe(true);

      // Should fail condition
      expect(lockedMove.condition?.(lockedState, context)).toBe(false);
    });

    it("should support complex conditions", () => {
      const conditionalMove: GameMoveDefinition<CounterState> = {
        condition: (state, context) => {
          return (
            !state.locked &&
            state.count < 10 &&
            state.player === context.playerId
          );
        },
        reducer: (draft) => {
          draft.count += 1;
        },
      };

      const validState: CounterState = {
        count: 5,
        player: "p1",
        locked: false,
      };

      const context: MoveContext = { playerId: "p1" as any };

      expect(conditionalMove.condition?.(validState, context)).toBe(true);

      // Wrong player
      expect(
        conditionalMove.condition?.(validState, {
          playerId: "p2" as any,
        }),
      ).toBe(false);

      // Locked
      expect(
        conditionalMove.condition?.({ ...validState, locked: true }, context),
      ).toBe(false);

      // Count too high
      expect(
        conditionalMove.condition?.({ ...validState, count: 10 }, context),
      ).toBe(false);
    });
  });

  describe("type safety", () => {
    it("should preserve state type through reducer", () => {
      const typedMove: GameMoveDefinition<CounterState> = {
        reducer: (draft) => {
          // TypeScript should know draft is CounterState
          draft.count += 1;
          draft.player = "updated";
          draft.locked = true;

          // These should cause TypeScript errors:
          // draft.nonExistent = true;
          // draft.count = "string";
        },
      };

      expect(typedMove.reducer).toBeFunction();
    });

    it("should preserve state type through condition", () => {
      const typedMove: GameMoveDefinition<CounterState> = {
        condition: (state) => {
          // TypeScript should know state is CounterState
          return state.count < 10 && !state.locked;

          // This should cause TypeScript error:
          // return state.nonExistent;
        },
        reducer: (draft) => {
          draft.count += 1;
        },
      };

      expect(typedMove.condition).toBeFunction();
    });
  });

  describe("metadata support", () => {
    it("should support optional metadata", () => {
      const metadataMove: GameMoveDefinition<CounterState> = {
        reducer: (draft) => {
          draft.count += 1;
        },
        metadata: {
          category: "counter",
          tags: ["increment", "basic"],
          priority: 1,
        },
      };

      expect(metadataMove.metadata?.category).toBe("counter");
      expect(metadataMove.metadata?.tags).toEqual(["increment", "basic"]);
      expect(metadataMove.metadata?.priority).toBe(1);
    });
  });
});
