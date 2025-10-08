import { describe, expect, it } from "bun:test";
import type { GameDefinition } from "../../game-definition/game-definition";
import type { GameMoveDefinitions } from "../../game-definition/move-definitions";
import { createPlayerId } from "../../types";
import { RuleEngine } from "../rule-engine";

/**
 * Task 11: Rule Engine Move Execution Tests
 *
 * Tests for:
 * - Move execution and validation (11.7-11.10)
 * - canExecuteMove checks (11.11-11.12)
 * - Valid move enumeration (11.13-11.14)
 * - Patch generation (11.21-11.24)
 */

type TestGameState = {
  players: Array<{ id: string; name: string; score: number; hand: string[] }>;
  currentPlayerIndex: number;
  deck: string[];
  phase: "setup" | "draw" | "play" | "ended";
  turnNumber: number;
  winner?: string;
};

type TestMoves = {
  drawCard: Record<string, never>;
  playCard: { cardId: string };
  nextPhase: Record<string, never>;
  endGame: { winnerId: string };
};

describe("RuleEngine - Move Execution", () => {
  describe("Task 11.7, 11.8, 11.9, 11.10: executeMove", () => {
    it("should execute a valid move successfully", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        drawCard: {
          reducer: (draft) => {
            const player = draft.players[draft.currentPlayerIndex];
            if (player && draft.deck.length > 0) {
              const card = draft.deck.pop();
              if (card) {
                player.hand.push(card);
              }
            }
          },
        },
        playCard: { reducer: () => {} },
        nextPhase: { reducer: () => {} },
        endGame: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
            hand: [],
          })),
          currentPlayerIndex: 0,
          deck: ["card1", "card2", "card3"],
          phase: "setup",
          turnNumber: 1,
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);
      const result = engine.executeMove("drawCard", {
        playerId: createPlayerId("p1"),
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.patches).toBeDefined();
        expect(result.patches.length).toBeGreaterThan(0);
      }

      const state = engine.getState();
      expect(state.players[0]?.hand).toHaveLength(1);
      expect(state.deck).toHaveLength(2);
    });

    it("should reject unknown move", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        drawCard: { reducer: () => {} },
        playCard: { reducer: () => {} },
        nextPhase: { reducer: () => {} },
        endGame: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
            hand: [],
          })),
          currentPlayerIndex: 0,
          deck: [],
          phase: "setup",
          turnNumber: 1,
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);
      const result = engine.executeMove("unknownMove" as any, {
        playerId: createPlayerId("p1"),
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("not found");
        expect(result.errorCode).toBe("MOVE_NOT_FOUND");
      }
    });

    it("should reject move when condition fails", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        drawCard: { reducer: () => {} },
        playCard: {
          condition: (state, context) => {
            const player = state.players[state.currentPlayerIndex];
            const cardId = context.data?.cardId as string;
            return player?.hand.includes(cardId) ?? false;
          },
          reducer: (draft, context) => {
            const player = draft.players[draft.currentPlayerIndex];
            const cardId = context.data?.cardId as string;
            if (player && cardId) {
              const index = player.hand.indexOf(cardId);
              if (index >= 0) {
                player.hand.splice(index, 1);
              }
            }
          },
        },
        nextPhase: { reducer: () => {} },
        endGame: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
            hand: [],
          })),
          currentPlayerIndex: 0,
          deck: [],
          phase: "setup",
          turnNumber: 1,
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);
      const result = engine.executeMove("playCard", {
        playerId: createPlayerId("p1"),
        data: { cardId: "card-not-in-hand" },
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toContain("condition not met");
        expect(result.errorCode).toBe("CONDITION_FAILED");
      }
    });

    it("should capture patches for network sync", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        drawCard: {
          reducer: (draft) => {
            const player = draft.players[draft.currentPlayerIndex];
            if (player && draft.deck.length > 0) {
              const card = draft.deck.pop();
              if (card) {
                player.hand.push(card);
              }
            }
          },
        },
        playCard: { reducer: () => {} },
        nextPhase: { reducer: () => {} },
        endGame: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
            hand: [],
          })),
          currentPlayerIndex: 0,
          deck: ["card1"],
          phase: "setup",
          turnNumber: 1,
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);
      const result = engine.executeMove("drawCard", {
        playerId: createPlayerId("p1"),
      });

      expect(result.success).toBe(true);
      if (result.success) {
        // Patches should describe the state changes
        expect(result.patches).toBeDefined();
        expect(result.patches.length).toBeGreaterThan(0);

        // Inverse patches for undo
        expect(result.inversePatches).toBeDefined();
        expect(result.inversePatches.length).toBeGreaterThan(0);
      }
    });
  });

  describe("Task 11.11, 11.12: canExecuteMove", () => {
    it("should return true for valid move", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        drawCard: {
          condition: (state) => state.deck.length > 0,
          reducer: () => {},
        },
        playCard: { reducer: () => {} },
        nextPhase: { reducer: () => {} },
        endGame: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
            hand: [],
          })),
          currentPlayerIndex: 0,
          deck: ["card1", "card2"],
          phase: "setup",
          turnNumber: 1,
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);
      const canDraw = engine.canExecuteMove("drawCard", {
        playerId: createPlayerId("p1"),
      });

      expect(canDraw).toBe(true);
    });

    it("should return false when condition fails", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        drawCard: {
          condition: (state) => state.deck.length > 0,
          reducer: () => {},
        },
        playCard: { reducer: () => {} },
        nextPhase: { reducer: () => {} },
        endGame: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
            hand: [],
          })),
          currentPlayerIndex: 0,
          deck: [], // Empty deck
          phase: "setup",
          turnNumber: 1,
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);
      const canDraw = engine.canExecuteMove("drawCard", {
        playerId: createPlayerId("p1"),
      });

      expect(canDraw).toBe(false);
    });

    it("should not mutate state when checking", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        drawCard: {
          condition: (state) => state.deck.length > 0,
          reducer: (draft) => {
            draft.deck.pop();
          },
        },
        playCard: { reducer: () => {} },
        nextPhase: { reducer: () => {} },
        endGame: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
            hand: [],
          })),
          currentPlayerIndex: 0,
          deck: ["card1", "card2"],
          phase: "setup",
          turnNumber: 1,
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);
      engine.canExecuteMove("drawCard", { playerId: createPlayerId("p1") });

      // State should be unchanged
      const state = engine.getState();
      expect(state.deck).toHaveLength(2);
    });
  });

  describe("Task 11.13, 11.14: getValidMoves", () => {
    it("should return all valid moves for player", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        drawCard: {
          condition: (state) => state.deck.length > 0,
          reducer: () => {},
        },
        playCard: {
          condition: (state) => {
            const player = state.players[state.currentPlayerIndex];
            return (player?.hand.length ?? 0) > 0;
          },
          reducer: () => {},
        },
        nextPhase: {
          reducer: () => {},
        },
        endGame: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
            hand: ["card-a"],
          })),
          currentPlayerIndex: 0,
          deck: ["card1"],
          phase: "setup",
          turnNumber: 1,
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);
      const validMoves = engine.getValidMoves(createPlayerId("p1"));

      // Should include drawCard (deck has cards)
      expect(validMoves).toContain("drawCard");
      // Should include playCard (hand has cards)
      expect(validMoves).toContain("playCard");
      // Should include nextPhase (no condition)
      expect(validMoves).toContain("nextPhase");
    });

    it("should exclude moves that fail conditions", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        drawCard: {
          condition: (state) => state.deck.length > 0,
          reducer: () => {},
        },
        playCard: {
          condition: (state) => {
            const player = state.players[state.currentPlayerIndex];
            return (player?.hand.length ?? 0) > 0;
          },
          reducer: () => {},
        },
        nextPhase: { reducer: () => {} },
        endGame: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
            hand: [], // Empty hand
          })),
          currentPlayerIndex: 0,
          deck: [], // Empty deck
          phase: "setup",
          turnNumber: 1,
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);
      const validMoves = engine.getValidMoves(createPlayerId("p1"));

      // Should NOT include drawCard (no cards in deck)
      expect(validMoves).not.toContain("drawCard");
      // Should NOT include playCard (no cards in hand)
      expect(validMoves).not.toContain("playCard");
      // Should include nextPhase (no condition)
      expect(validMoves).toContain("nextPhase");
    });
  });
});
