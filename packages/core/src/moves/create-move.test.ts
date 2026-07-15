import { describe, expect, it } from "bun:test";
import { produce } from "immer";
import { createMockContext } from "../testing/test-context-factory";
import type { CardId, PlayerId } from "../types";
import { createCardId, createPlayerId } from "../types";
import { createMove } from "./create-move";
import type { MoveContext } from "./move-system";

describe("createMove Helper", () => {
  /**
   * Test game state structure
   */
  interface TestGameState {
    players: Record<PlayerId, { health: number; mana: number }>;
    cards: Record<CardId, { name: string; damage: number }>;
  }

  /**
   * Test move parameter types - using a record type like real game implementations
   */
  interface TestMoveParams {
    // Move with specific params
    quest: { cardId: CardId };
    // Move with multiple params
    challenge: { attackerId: CardId; defenderId: CardId };
    // Move with optional params
    playCard: { cardId: CardId; alternativeCost?: number };
    // Move with no params
    pass: Record<string, never>;
  }

  const player1 = createPlayerId("p1");
  const player2 = createPlayerId("p2");
  const card1 = createCardId("card1");
  const card2 = createCardId("card2");

  const initialState: TestGameState = {
    cards: {
      [card1]: { damage: 0, name: "Character A" },
      [card2]: { damage: 0, name: "Character B" },
    },
    players: {
      [player1]: { health: 20, mana: 5 },
      [player2]: { health: 20, mana: 5 },
    },
  };

  describe("Type Narrowing", () => {
    it("should narrow params for single-param move", () => {
      // Create a move with narrowed params using createMove
      const questMove = createMove<
        TestGameState,
        TestMoveParams,
        "quest" // ✅ Narrows to TestMoveParams["quest"]
      >({
        condition: (state, context) => {
          // ✅ context.params is { cardId: CardId }
          const { cardId } = context.params;
          return Boolean(state.cards[cardId]);
        },
        reducer: (draft, context) => {
          // ✅ context.params is { cardId: CardId }
          const { cardId } = context.params;
          const card = draft.cards[cardId];
          if (card) {
            card.damage += 1;
          }
        },
      });

      // Verify the move works correctly
      const context: MoveContext<TestMoveParams["quest"]> = createMockContext({
        params: { cardId: card1 },
        playerId: player1,
      });

      // Test condition
      expect(questMove.condition?.(initialState, context)).toBe(true);

      // Test reducer
      const nextState = produce(initialState, (draft) => {
        questMove.reducer(draft, context);
      });

      expect(nextState.cards[card1].damage).toBe(1);
    });

    it("should narrow params for multi-param move", () => {
      // Create a move with multiple params
      const challengeMove = createMove<
        TestGameState,
        TestMoveParams,
        "challenge" // ✅ Narrows to TestMoveParams["challenge"]
      >({
        condition: (state, context) => {
          // ✅ context.params is { attackerId: CardId; defenderId: CardId }
          const { attackerId, defenderId } = context.params;
          return Boolean(state.cards[attackerId]) && Boolean(state.cards[defenderId]);
        },
        reducer: (draft, context) => {
          // ✅ context.params is { attackerId: CardId; defenderId: CardId }
          const { attackerId, defenderId } = context.params;
          const attacker = draft.cards[attackerId];
          const defender = draft.cards[defenderId];
          if (attacker && defender) {
            defender.damage += 3;
          }
        },
      });

      const context: MoveContext<TestMoveParams["challenge"]> = createMockContext({
        params: { attackerId: card1, defenderId: card2 },
        playerId: player1,
      });

      expect(challengeMove.condition?.(initialState, context)).toBe(true);

      const nextState = produce(initialState, (draft) => {
        challengeMove.reducer(draft, context);
      });

      expect(nextState.cards[card2].damage).toBe(3);
    });

    it("should narrow params for move with optional fields", () => {
      // Create a move with optional params
      const playCardMove = createMove<
        TestGameState,
        TestMoveParams,
        "playCard" // ✅ Narrows to TestMoveParams["playCard"]
      >({
        reducer: (draft, context) => {
          // ✅ context.params is { cardId: CardId; alternativeCost?: number }
          const { cardId, alternativeCost } = context.params;
          const player = draft.players[context.playerId];
          const cost = alternativeCost ?? 3;
          player.mana -= cost;

          // Use cardId (verify it's available)
          const card = draft.cards[cardId];
          if (card) {
            card.damage = 0; // Reset damage on play
          }
        },
      });

      // Test with alternativeCost
      const contextWithAlt: MoveContext<TestMoveParams["playCard"]> = createMockContext({
        params: { alternativeCost: 2, cardId: card1 },
        playerId: player1,
      });

      const nextState1 = produce(initialState, (draft) => {
        playCardMove.reducer(draft, contextWithAlt);
      });

      expect(nextState1.players[player1].mana).toBe(3); // 5 - 2

      // Test without alternativeCost
      const contextWithoutAlt: MoveContext<TestMoveParams["playCard"]> = createMockContext({
        params: { cardId: card1 },
        playerId: player1, // AlternativeCost is optional
      });

      const nextState2 = produce(initialState, (draft) => {
        playCardMove.reducer(draft, contextWithoutAlt);
      });

      expect(nextState2.players[player1].mana).toBe(2); // 5 - 3 (default)
    });

    it("should narrow params for no-param move", () => {
      // Create a move with no params
      const passMove = createMove<
        TestGameState,
        TestMoveParams,
        "pass" // ✅ Narrows to TestMoveParams["pass"] (empty object)
      >({
        reducer: (draft, context) => {
          // ✅ context.params is {} (empty object)
          const player = draft.players[context.playerId];
          player.mana = 10; // Reset mana on pass
        },
      });

      const context: MoveContext<TestMoveParams["pass"]> = createMockContext({
        params: {},
        playerId: player1,
      });

      const nextState = produce(initialState, (draft) => {
        passMove.reducer(draft, context);
      });

      expect(nextState.players[player1].mana).toBe(10);
    });
  });

  describe("Runtime Behavior", () => {
    it("should return the definition unchanged", () => {
      const definition = {
        condition: (state: TestGameState) => state.players[player1].mana >= 1,
        reducer: (draft: any) => {
          draft.players[player1].mana -= 1;
        },
      };

      const result = createMove<TestGameState, TestMoveParams, "quest">(definition);

      // Runtime behavior: returns the same object
      expect(result).toBe(definition);
      expect(result.condition).toBe(definition.condition);
      expect(result.reducer).toBe(definition.reducer);
    });

    it("should work with move definitions without conditions", () => {
      const definition = {
        reducer: (draft: any) => {
          draft.players[player1].health -= 1;
        },
      };

      const result = createMove<TestGameState, TestMoveParams, "pass">(definition);

      expect(result).toBe(definition);
      expect(result.condition).toBeUndefined();
    });

    it("should work with move definitions with metadata", () => {
      const definition = {
        metadata: {
          category: "healing",
          tags: ["buff"],
        },
        reducer: (draft: any) => {
          draft.players[player1].health += 5;
        },
      };

      const result = createMove<TestGameState, TestMoveParams, "pass">(definition);

      expect(result.metadata?.category).toBe("healing");
      expect(result.metadata?.tags).toEqual(["buff"]);
    });
  });

  describe("Integration with GameMoveDefinitions", () => {
    it("should work correctly when aggregated into move map", () => {
      // Create individual moves using createMove
      const quest = createMove<TestGameState, TestMoveParams, "quest">({
        reducer: (draft, context) => {
          const { cardId } = context.params;
          draft.cards[cardId].damage += 1;
        },
      });

      const challenge = createMove<TestGameState, TestMoveParams, "challenge">({
        reducer: (draft, context) => {
          const { attackerId, defenderId } = context.params;
          draft.cards[defenderId].damage += 2;
        },
      });

      const pass = createMove<TestGameState, TestMoveParams, "pass">({
        reducer: (draft, context) => {
          draft.players[context.playerId].mana = 10;
        },
      });

      // Aggregate into a move map (simulating GameMoveDefinitions)
      const moves = {
        challenge,
        pass,
        quest,
      };

      // Verify all moves are accessible and work correctly
      expect(moves.quest).toBe(quest);
      expect(moves.challenge).toBe(challenge);
      expect(moves.pass).toBe(pass);

      // Test executing quest move
      const questContext: MoveContext<TestMoveParams["quest"]> = createMockContext({
        params: { cardId: card1 },
        playerId: player1,
      });

      const state1 = produce(initialState, (draft) => {
        moves.quest.reducer(draft, questContext);
      });

      expect(state1.cards[card1].damage).toBe(1);

      // Test executing challenge move
      const challengeContext: MoveContext<TestMoveParams["challenge"]> = createMockContext({
        params: { attackerId: card1, defenderId: card2 },
        playerId: player1,
      });

      const state2 = produce(state1, (draft) => {
        moves.challenge.reducer(draft, challengeContext);
      });

      expect(state2.cards[card2].damage).toBe(2);

      // Test executing pass move
      const passContext: MoveContext<TestMoveParams["pass"]> = createMockContext({
        params: {},
        playerId: player1,
      });

      const state3 = produce(state2, (draft) => {
        moves.pass.reducer(draft, passContext);
      });

      expect(state3.players[player1].mana).toBe(10);
    });
  });
});
