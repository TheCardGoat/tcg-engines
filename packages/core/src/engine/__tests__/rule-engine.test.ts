import { describe, expect, it } from "bun:test";
import type { GameDefinition } from "../../game-definition/game-definition";
import type { GameMoveDefinitions } from "../../game-definition/move-definitions";
import { createPlayerId } from "../../types";
import { RuleEngine } from "../rule-engine";

/**
 * Task 11: Rule Engine Core Tests
 *
 * Tests verify the RuleEngine integrates all systems:
 * - GameDefinition initialization
 * - State management
 * - Move execution with validation
 * - Player views
 * - History tracking
 * - Patch generation
 * - RNG integration
 * - Flow orchestration
 */

// Test game state
type TestGameState = {
  players: Array<{ id: string; name: string; score: number; hand: string[] }>;
  currentPlayerIndex: number;
  deck: string[];
  phase: "setup" | "draw" | "play" | "ended";
  turnNumber: number;
  winner?: string;
};

// Test moves
type TestMoves = {
  drawCard: Record<string, never>;
  playCard: { cardId: string };
  nextPhase: Record<string, never>;
  endGame: { winnerId: string };
};

describe("RuleEngine - Constructor", () => {
  describe("Task 11.1, 11.2: Constructor and Initialization", () => {
    it("should initialize with GameDefinition", () => {
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
        playCard: {
          condition: (state, context) => {
            const player = state.players[state.currentPlayerIndex];
            const cardId = context.params?.cardId as string;
            return player?.hand.includes(cardId) ?? false;
          },
          reducer: (draft, context) => {
            const player = draft.players[draft.currentPlayerIndex];
            const cardId = context.params?.cardId as string;
            if (player && cardId) {
              const index = player.hand.indexOf(cardId);
              if (index >= 0) {
                player.hand.splice(index, 1);
                player.score += 1;
              }
            }
          },
        },
        nextPhase: {
          reducer: (draft) => {
            if (draft.phase === "setup") draft.phase = "draw";
            else if (draft.phase === "draw") draft.phase = "play";
            else if (draft.phase === "play") draft.phase = "ended";
          },
        },
        endGame: {
          reducer: (draft, context) => {
            draft.phase = "ended";
            draft.winner = context.params?.winnerId as string;
          },
        },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Card Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            score: 0,
            hand: [],
          })),
          currentPlayerIndex: 0,
          deck: ["card1", "card2", "card3", "card4"],
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

      expect(engine).toBeDefined();
      expect(engine.getState()).toBeDefined();
    });

    it("should call setup function to initialize state", () => {
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
          deck: ["a", "b", "c"],
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
      const state = engine.getState();

      expect(state.players).toHaveLength(2);
      expect(state.players[0]?.id).toBe(createPlayerId("p1"));
      expect(state.deck).toEqual(["a", "b", "c"]);
      expect(state.phase).toBe("setup");
    });

    it("should accept optional RNG seed", () => {
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

      const engine = new RuleEngine(gameDef, players, {
        seed: "test-seed-123",
      });

      expect(engine).toBeDefined();
      expect(engine.getState()).toBeDefined();
    });
  });
});

describe("RuleEngine - State Access", () => {
  describe("Task 11.3, 11.4: getState Method", () => {
    it("should return current game state", () => {
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
      const state = engine.getState();

      expect(state.players).toHaveLength(2);
      expect(state.deck).toEqual(["card1", "card2"]);
      expect(state.phase).toBe("setup");
    });

    it("should return immutable state (modifications don't affect engine)", () => {
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
            score: 42,
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
      const state1 = engine.getState();

      // Try to mutate the returned state
      state1.players[0]!.score = 999;
      state1.deck.push("hacked-card");

      // Engine state should be unchanged
      const state2 = engine.getState();
      expect(state2.players[0]?.score).toBe(42);
      expect(state2.deck).toEqual([]);
    });
  });

  describe("Task 11.5, 11.6: getPlayerView Method", () => {
    it("should return full state when no playerView defined", () => {
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
          deck: ["secret1", "secret2"],
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
      const view = engine.getPlayerView(createPlayerId("p1"));

      expect(view.deck).toEqual(["secret1", "secret2"]);
    });

    it("should filter state using playerView function", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        drawCard: { reducer: () => {} },
        playCard: { reducer: () => {} },
        nextPhase: { reducer: () => {} },
        endGame: { reducer: () => {} },
      };

      const gameDef: GameDefinition<TestGameState, TestMoves> = {
        name: "Test Game",
        setup: (players) => ({
          players: players.map((p, i) => ({
            id: p.id,
            name: p.name || "Player",
            score: i * 10,
            hand: [`hand-${i}-1`, `hand-${i}-2`],
          })),
          currentPlayerIndex: 0,
          deck: ["secret1", "secret2"],
          phase: "setup",
          turnNumber: 1,
        }),
        moves,
        playerView: (state, playerId) => ({
          ...state,
          // Hide other players' hands
          players: state.players.map((p) => ({
            ...p,
            hand: p.id === playerId ? p.hand : [],
          })),
          // Hide deck contents
          deck: [],
        }),
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDef, players);
      const p1View = engine.getPlayerView(createPlayerId("p1"));

      // P1 should see their own hand
      expect(p1View.players[0]?.hand).toEqual(["hand-0-1", "hand-0-2"]);
      // But not P2's hand
      expect(p1View.players[1]?.hand).toEqual([]);
      // Deck should be hidden
      expect(p1View.deck).toEqual([]);
    });
  });
});
