import { describe, expect, it } from "bun:test";
import { produce } from "immer";
import type { CardId, PlayerId } from "../types";
import { createCardId, createPlayerId, createZoneId } from "../types";
import type {
  MoveCondition,
  MoveContext,
  MoveDefinition,
  MoveReducer,
  MoveResult,
} from "./move-system";

describe("Move System with Validation", () => {
  type TestGameState = {
    players: Record<PlayerId, { life: number; mana: number }>;
    currentPlayer: PlayerId;
    cards: Record<CardId, { name: string; cost: number }>;
  };

  const player1 = createPlayerId("p1");
  const player2 = createPlayerId("p2");
  const card1 = createCardId("card1");

  const initialState: TestGameState = {
    players: {
      [player1]: { life: 20, mana: 3 },
      [player2]: { life: 20, mana: 3 },
    },
    currentPlayer: player1,
    cards: {
      [card1]: { name: "Lightning Bolt", cost: 1 },
    },
  };

  describe("MoveDefinition", () => {
    it("should define a move with reducer and condition", () => {
      const reducer: MoveReducer<TestGameState> = (draft, context) => {
        draft.players[context.playerId].mana -= 1;
      };

      const condition: MoveCondition<TestGameState> = (state, context) => {
        return state.players[context.playerId].mana >= 1;
      };

      const moveDef: MoveDefinition<TestGameState> = {
        id: "spend-mana",
        name: "Spend Mana",
        reducer,
        condition,
      };

      expect(moveDef.id).toBe("spend-mana");
      expect(moveDef.reducer).toBe(reducer);
      expect(moveDef.condition).toBe(condition);
    });

    it("should define a move without condition (always valid)", () => {
      const reducer: MoveReducer<TestGameState> = (draft, context) => {
        draft.currentPlayer = context.playerId;
      };

      const moveDef: MoveDefinition<TestGameState> = {
        id: "pass-turn",
        name: "Pass Turn",
        reducer,
      };

      expect(moveDef.id).toBe("pass-turn");
      expect(moveDef.condition).toBeUndefined();
    });

    it("should include metadata in move definition", () => {
      const moveDef: MoveDefinition<TestGameState> = {
        id: "draw-card",
        name: "Draw Card",
        description: "Draw a card from your deck",
        reducer: (draft) => draft,
      };

      expect(moveDef.description).toBe("Draw a card from your deck");
    });
  });

  describe("MoveReducer", () => {
    it("should update state using Immer draft", () => {
      const reducer: MoveReducer<TestGameState> = (draft, context) => {
        draft.players[context.playerId].mana -= 2;
      };

      const context: MoveContext = {
        playerId: player1,
      };

      const nextState = produce(initialState, (draft) => {
        reducer(draft, context);
      });

      expect(nextState.players[player1].mana).toBe(1);
      expect(initialState.players[player1].mana).toBe(3); // Original unchanged
    });

    it("should access context data in reducer", () => {
      const reducer: MoveReducer<TestGameState> = (draft, context) => {
        if (context.targets?.[0]) {
          const targetId = context.targets[0][0] as PlayerId;
          draft.players[targetId].life -= 3;
        }
      };

      const context: MoveContext = {
        playerId: player1,
        targets: [[player2]],
      };

      const nextState = produce(initialState, (draft) => {
        reducer(draft, context);
      });

      expect(nextState.players[player2].life).toBe(17);
    });

    it("should use source card from context", () => {
      const reducer: MoveReducer<TestGameState> = (draft, context) => {
        if (context.sourceCardId) {
          const card = draft.cards[context.sourceCardId];
          draft.players[context.playerId].mana -= card.cost;
        }
      };

      const context: MoveContext = {
        playerId: player1,
        sourceCardId: card1,
      };

      const nextState = produce(initialState, (draft) => {
        reducer(draft, context);
      });

      expect(nextState.players[player1].mana).toBe(2); // 3 - 1 (card cost)
    });
  });

  describe("MoveCondition", () => {
    it("should validate move is legal before execution", () => {
      const condition: MoveCondition<TestGameState> = (state, context) => {
        return state.players[context.playerId].mana >= 2;
      };

      expect(condition(initialState, { playerId: player1 })).toBe(true);

      const lowManaState = produce(initialState, (draft) => {
        draft.players[player1].mana = 1;
      });
      expect(condition(lowManaState, { playerId: player1 })).toBe(false);
    });

    it("should access context in condition check", () => {
      const condition: MoveCondition<TestGameState> = (state, context) => {
        return state.currentPlayer === context.playerId;
      };

      expect(condition(initialState, { playerId: player1 })).toBe(true);
      expect(condition(initialState, { playerId: player2 })).toBe(false);
    });

    it("should validate based on targets", () => {
      const condition: MoveCondition<TestGameState> = (state, context) => {
        if (!context.targets?.[0]) return false;
        const targetId = context.targets[0][0] as PlayerId;
        return targetId !== context.playerId; // Can't target self
      };

      expect(
        condition(initialState, {
          playerId: player1,
          targets: [[player2]],
        }),
      ).toBe(true);

      expect(
        condition(initialState, {
          playerId: player1,
          targets: [[player1]],
        }),
      ).toBe(false);
    });
  });

  describe("MoveResult", () => {
    it("should represent successful move execution", () => {
      const result: MoveResult<TestGameState> = {
        success: true,
        state: initialState,
      };

      expect(result.success).toBe(true);
      expect(result.state).toBe(initialState);
      expect(result.error).toBeUndefined();
    });

    it("should represent failed move with error", () => {
      const result: MoveResult<TestGameState> = {
        success: false,
        error: "Not enough mana",
      };

      expect(result.success).toBe(false);
      expect(result.error).toBe("Not enough mana");
      expect(result.state).toBeUndefined();
    });

    it("should represent failed move with detailed error info", () => {
      const result: MoveResult<TestGameState> = {
        success: false,
        error: "Invalid target",
        errorCode: "INVALID_TARGET",
        errorContext: { targetId: "card1", reason: "Already destroyed" },
      };

      expect(result.errorCode).toBe("INVALID_TARGET");
      expect(result.errorContext).toEqual({
        targetId: "card1",
        reason: "Already destroyed",
      });
    });
  });

  describe("MoveContext", () => {
    it("should provide player ID to move", () => {
      const context: MoveContext = {
        playerId: player1,
      };

      expect(context.playerId).toBe(player1);
    });

    it("should provide source card ID", () => {
      const context: MoveContext = {
        playerId: player1,
        sourceCardId: card1,
      };

      expect(context.sourceCardId).toBe(card1);
    });

    it("should provide target selections", () => {
      const context: MoveContext = {
        playerId: player1,
        targets: [[card1], [player2]],
      };

      expect(context.targets).toHaveLength(2);
      expect(context.targets?.[0]).toEqual([card1]);
      expect(context.targets?.[1]).toEqual([player2]);
    });

    it("should provide additional data", () => {
      const context: MoveContext = {
        playerId: player1,
        data: {
          choiceIndex: 2,
          amount: 5,
        },
      };

      expect(context.data?.choiceIndex).toBe(2);
      expect(context.data?.amount).toBe(5);
    });

    it("should provide timestamp", () => {
      const now = Date.now();
      const context: MoveContext = {
        playerId: player1,
        timestamp: now,
      };

      expect(context.timestamp).toBe(now);
    });
  });

  describe("Move Validation Flow", () => {
    it("should execute valid move successfully", () => {
      const moveDef: MoveDefinition<TestGameState> = {
        id: "spend-mana",
        name: "Spend Mana",
        condition: (state, context) =>
          state.players[context.playerId].mana >= 2,
        reducer: (draft, context) => {
          draft.players[context.playerId].mana -= 2;
        },
      };

      const context: MoveContext = { playerId: player1 };

      // Check condition
      const isValid = moveDef.condition?.(initialState, context);
      expect(isValid).toBe(true);

      // Execute if valid
      if (isValid) {
        const nextState = produce(initialState, (draft) => {
          moveDef.reducer(draft, context);
        });

        expect(nextState.players[player1].mana).toBe(1);
      }
    });

    it("should reject invalid move before execution", () => {
      const moveDef: MoveDefinition<TestGameState> = {
        id: "expensive-spell",
        name: "Expensive Spell",
        condition: (state, context) =>
          state.players[context.playerId].mana >= 5,
        reducer: (draft, context) => {
          draft.players[context.playerId].mana -= 5;
        },
      };

      const context: MoveContext = { playerId: player1 };

      const isValid = moveDef.condition?.(initialState, context);
      expect(isValid).toBe(false);

      // Reducer should NOT be called when invalid
    });

    it("should handle moves without conditions", () => {
      const moveDef: MoveDefinition<TestGameState> = {
        id: "pass",
        name: "Pass",
        reducer: (draft) => {
          // No-op move
        },
      };

      const context: MoveContext = { playerId: player1 };

      // No condition means always valid
      const isValid = moveDef.condition?.(initialState, context) ?? true;
      expect(isValid).toBe(true);
    });
  });
});
