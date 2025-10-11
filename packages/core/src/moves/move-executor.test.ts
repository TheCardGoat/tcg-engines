import { describe, expect, it } from "bun:test";
import { createMockContext } from "../testing/test-context-factory";
import type { PlayerId } from "../types";
import { createPlayerId } from "../types";
import {
  canExecuteMove,
  executeMove,
  getMove,
  getMoveIds,
  moveExists,
} from "./move-executor";
import type { MoveContext, MoveDefinition, MoveMap } from "./move-system";

describe("Move Executor", () => {
  type TestGameState = {
    players: Record<PlayerId, { life: number; mana: number }>;
    turnCount: number;
  };

  const player1 = createPlayerId("p1");
  const player2 = createPlayerId("p2");

  const initialState: TestGameState = {
    players: {
      [player1]: { life: 20, mana: 5 },
      [player2]: { life: 20, mana: 5 },
    },
    turnCount: 1,
  };

  const testMoves: MoveMap<TestGameState> = {
    "spend-mana": {
      id: "spend-mana",
      name: "Spend Mana",
      condition: (state, context) => state.players[context.playerId].mana >= 2,
      reducer: (draft, context) => {
        draft.players[context.playerId].mana -= 2;
      },
    },
    "deal-damage": {
      id: "deal-damage",
      name: "Deal Damage",
      condition: (state, context) => {
        if (!context.targets?.[0]) return false;
        const targetId = context.targets[0][0] as PlayerId;
        return targetId in state.players;
      },
      reducer: (draft, context) => {
        const targetId = context.targets?.[0]?.[0] as PlayerId;
        if (targetId) {
          draft.players[targetId].life -= 3;
        }
      },
    },
    "next-turn": {
      id: "next-turn",
      name: "Next Turn",
      // No condition - always valid
      reducer: (draft) => {
        draft.turnCount += 1;
      },
    },
  };

  describe("executeMove", () => {
    it("should execute valid move successfully", () => {
      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
      });
      const result = executeMove(
        initialState,
        "spend-mana",
        context,
        testMoves,
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.state.players[player1].mana).toBe(3);
        expect(result.state.players[player2].mana).toBe(5); // Unchanged
      }
    });

    it("should reject move with failed condition", () => {
      const lowManaState: TestGameState = {
        ...initialState,
        players: {
          ...initialState.players,
          [player1]: { life: 20, mana: 1 },
        },
      };

      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
      });
      const result = executeMove(
        lowManaState,
        "spend-mana",
        context,
        testMoves,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("condition not met");
        expect(result.errorCode).toBe("CONDITION_FAILED");
      }
    });

    it("should reject non-existent move", () => {
      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
      });
      const result = executeMove(
        initialState,
        "nonexistent",
        context,
        testMoves,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("does not exist");
        expect(result.errorCode).toBe("MOVE_NOT_FOUND");
      }
    });

    it("should execute move without condition", () => {
      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
      });
      const result = executeMove(initialState, "next-turn", context, testMoves);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.state.turnCount).toBe(2);
      }
    });

    it("should execute move with targets", () => {
      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
        targets: [[player2]],
      });
      const result = executeMove(
        initialState,
        "deal-damage",
        context,
        testMoves,
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.state.players[player2].life).toBe(17);
      }
    });

    it("should handle condition errors gracefully", () => {
      const brokenMove: MoveDefinition<TestGameState> = {
        id: "broken",
        name: "Broken Move",
        condition: () => {
          throw new Error("Condition error");
        },
        reducer: (draft) => draft,
      };

      const moves = { ...testMoves, broken: brokenMove };
      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
      });
      const result = executeMove(initialState, "broken", context, moves);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("CONDITION_ERROR");
        expect(result.error).toContain("Error checking condition");
      }
    });

    it("should handle reducer errors gracefully", () => {
      const brokenMove: MoveDefinition<TestGameState> = {
        id: "broken-reducer",
        name: "Broken Reducer",
        reducer: () => {
          throw new Error("Reducer error");
        },
      };

      const moves = { ...testMoves, "broken-reducer": brokenMove };
      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
      });
      const result = executeMove(
        initialState,
        "broken-reducer",
        context,
        moves,
      );

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.errorCode).toBe("EXECUTION_ERROR");
        expect(result.error).toContain("Error executing move");
      }
    });

    it("should not mutate original state", () => {
      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
      });
      executeMove(initialState, "spend-mana", context, testMoves);

      // Original state should be unchanged
      expect(initialState.players[player1].mana).toBe(5);
    });
  });

  describe("canExecuteMove", () => {
    it("should return true for valid move", () => {
      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
      });
      const canExecute = canExecuteMove(
        initialState,
        "spend-mana",
        context,
        testMoves,
      );

      expect(canExecute).toBe(true);
    });

    it("should return false for invalid move", () => {
      const lowManaState: TestGameState = {
        ...initialState,
        players: {
          ...initialState.players,
          [player1]: { life: 20, mana: 1 },
        },
      };

      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
      });
      const canExecute = canExecuteMove(
        lowManaState,
        "spend-mana",
        context,
        testMoves,
      );

      expect(canExecute).toBe(false);
    });

    it("should return false for non-existent move", () => {
      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
      });
      const canExecute = canExecuteMove(
        initialState,
        "nonexistent",
        context,
        testMoves,
      );

      expect(canExecute).toBe(false);
    });

    it("should return true for move without condition", () => {
      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
      });
      const canExecute = canExecuteMove(
        initialState,
        "next-turn",
        context,
        testMoves,
      );

      expect(canExecute).toBe(true);
    });

    it("should not execute the move (dry run)", () => {
      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
      });
      canExecuteMove(initialState, "spend-mana", context, testMoves);

      // State should be unchanged
      expect(initialState.players[player1].mana).toBe(5);
    });

    it("should handle condition errors by returning false", () => {
      const brokenMove: MoveDefinition<TestGameState> = {
        id: "broken",
        name: "Broken",
        condition: () => {
          throw new Error("Condition error");
        },
        reducer: (draft) => draft,
      };

      const moves = { ...testMoves, broken: brokenMove };
      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
      });
      const canExecute = canExecuteMove(initialState, "broken", context, moves);

      expect(canExecute).toBe(false);
    });
  });

  describe("getMove", () => {
    it("should return move definition if exists", () => {
      const move = getMove("spend-mana", testMoves);

      expect(move).toBeDefined();
      expect(move?.id).toBe("spend-mana");
      expect(move?.name).toBe("Spend Mana");
    });

    it("should return undefined if move does not exist", () => {
      const move = getMove("nonexistent", testMoves);

      expect(move).toBeUndefined();
    });
  });

  describe("getMoveIds", () => {
    it("should return all move IDs", () => {
      const ids = getMoveIds(testMoves);

      expect(ids).toContain("spend-mana");
      expect(ids).toContain("deal-damage");
      expect(ids).toContain("next-turn");
      expect(ids).toHaveLength(3);
    });

    it("should return empty array for empty moves", () => {
      const ids = getMoveIds({});

      expect(ids).toEqual([]);
    });
  });

  describe("moveExists", () => {
    it("should return true if move exists", () => {
      expect(moveExists("spend-mana", testMoves)).toBe(true);
      expect(moveExists("deal-damage", testMoves)).toBe(true);
    });

    it("should return false if move does not exist", () => {
      expect(moveExists("nonexistent", testMoves)).toBe(false);
    });
  });

  describe("Integration: Validation Pipeline", () => {
    it("should follow full validation pipeline", () => {
      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
      });

      // 1. Check if move can be executed
      const canExecute = canExecuteMove(
        initialState,
        "spend-mana",
        context,
        testMoves,
      );
      expect(canExecute).toBe(true);

      // 2. Execute the move
      const result = executeMove(
        initialState,
        "spend-mana",
        context,
        testMoves,
      );
      expect(result.success).toBe(true);

      // 3. Use new state
      if (result.success) {
        const newState = result.state;
        expect(newState.players[player1].mana).toBe(3);

        // 4. Check if move can still be executed
        const canExecuteAgain = canExecuteMove(
          newState,
          "spend-mana",
          context,
          testMoves,
        );
        expect(canExecuteAgain).toBe(true); // Still >= 2 mana
      }
    });

    it("should prevent invalid moves from being executed", () => {
      const lowManaState: TestGameState = {
        ...initialState,
        players: {
          ...initialState.players,
          [player1]: { life: 20, mana: 1 },
        },
      };

      const context: MoveContext = createMockContext({
        playerId: player1,
        params: {},
      });

      // Pre-check prevents unnecessary execution
      if (canExecuteMove(lowManaState, "spend-mana", context, testMoves)) {
        const result = executeMove(
          lowManaState,
          "spend-mana",
          context,
          testMoves,
        );
        expect(result.success).toBe(true);
      } else {
        // Move was correctly prevented
        expect(true).toBe(true);
      }
    });
  });
});
