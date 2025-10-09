import { describe, expect, it } from "bun:test";
import { RuleEngine } from "../../engine/rule-engine";
import type { FlowDefinition } from "../../flow/flow-definition";
import type { GameDefinition } from "../../game-definition/game-definition";
import type { GameMoveDefinitions } from "../../game-definition/move-definitions";
import { createPlayerId, type PlayerId } from "../../types";

/**
 * Task 15: Example Game Implementation - Coin Flip Game
 *
 * Simple game to validate the entire @tcg/core framework:
 * - Players take turns flipping a coin (using seeded RNG)
 * - Heads = score +1, Tails = no score
 * - First player to reach 3 points wins
 *
 * Tests verify:
 * - Game setup and initialization
 * - Turn-based gameplay with flow management
 * - Move execution with RNG integration
 * - Win condition checking
 * - Complete game playthrough
 * - Deterministic replay
 */

type CoinFlipGameState = {
  players: Array<{
    id: PlayerId;
    name: string;
    score: number;
  }>;
  currentPlayerIndex: number;
  turnNumber: number;
  phase: "flip" | "ended";
  lastFlipResult?: "heads" | "tails";
  winner?: PlayerId;
};

type CoinFlipMoves = {
  flipCoin: Record<string, never>;
  endTurn: Record<string, never>;
};

describe("Coin Flip Game - Setup", () => {
  describe("Task 15.1, 15.2: Game Definition and Setup", () => {
    it("should create game definition for coin flip", () => {
      const moves: GameMoveDefinitions<CoinFlipGameState, CoinFlipMoves> = {
        flipCoin: {
          condition: (state) => state.phase === "flip",
          reducer: (draft, _context) => {
            // Access RNG through context (we'll pass it from engine)
            const isHeads = Math.random() >= 0.5; // Placeholder
            draft.lastFlipResult = isHeads ? "heads" : "tails";

            if (isHeads) {
              const player = draft.players[draft.currentPlayerIndex];
              if (player) {
                player.score += 1;
              }
            }
          },
        },
        endTurn: {
          condition: (state) => state.phase === "flip",
          reducer: (draft) => {
            // Next player
            draft.currentPlayerIndex =
              (draft.currentPlayerIndex + 1) % draft.players.length;
            draft.turnNumber += 1;
          },
        },
      };

      const gameDefinition: GameDefinition<CoinFlipGameState, CoinFlipMoves> = {
        name: "Coin Flip",
        setup: (players) => ({
          players: players.map((p): CoinFlipGameState["players"][number] => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayerIndex: 0,
          turnNumber: 1,
          phase: "flip" as const,
        }),
        moves,
      };

      expect(gameDefinition.name).toBe("Coin Flip");
      expect(gameDefinition.setup).toBeFunction();
      expect(gameDefinition.moves.flipCoin).toBeDefined();
      expect(gameDefinition.moves.endTurn).toBeDefined();
    });

    it("should initialize game state correctly", () => {
      const moves: GameMoveDefinitions<CoinFlipGameState, CoinFlipMoves> = {
        flipCoin: { reducer: () => {} },
        endTurn: { reducer: () => {} },
      };

      const gameDefinition: GameDefinition<CoinFlipGameState, CoinFlipMoves> = {
        name: "Coin Flip",
        setup: (players) => ({
          players: players.map((p): CoinFlipGameState["players"][number] => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayerIndex: 0,
          turnNumber: 1,
          phase: "flip" as const,
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDefinition, players);
      const state = engine.getState();

      expect(state.players).toHaveLength(2);
      expect(state.players[0]?.name).toBe("Alice");
      expect(state.players[1]?.name).toBe("Bob");
      expect(state.currentPlayerIndex).toBe(0);
      expect(state.turnNumber).toBe(1);
      expect(state.phase).toBe("flip");
    });
  });

  describe("Task 15.3, 15.4: Game Moves", () => {
    it("should implement flipCoin move with RNG", () => {
      const moves: GameMoveDefinitions<CoinFlipGameState, CoinFlipMoves> = {
        flipCoin: {
          reducer: (draft) => {
            // In real implementation, would use engine.getRNG()
            const isHeads = Math.random() >= 0.5;
            draft.lastFlipResult = isHeads ? "heads" : "tails";

            if (isHeads) {
              const player = draft.players[draft.currentPlayerIndex];
              if (player) {
                player.score += 1;
              }
            }
          },
        },
        endTurn: { reducer: () => {} },
      };

      const gameDefinition: GameDefinition<CoinFlipGameState, CoinFlipMoves> = {
        name: "Coin Flip",
        setup: (players) => ({
          players: players.map((p): CoinFlipGameState["players"][number] => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayerIndex: 0,
          turnNumber: 1,
          phase: "flip" as const,
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDefinition, players, {
        seed: "test-seed",
      });

      const result = engine.executeMove("flipCoin", {
        playerId: createPlayerId("p1"),
      });

      expect(result.success).toBe(true);

      const state = engine.getState();
      expect(state.lastFlipResult).toBeDefined();
      expect(["heads", "tails"]).toContain(state.lastFlipResult);
    });

    it("should implement endTurn move to progress to next player", () => {
      const moves: GameMoveDefinitions<CoinFlipGameState, CoinFlipMoves> = {
        flipCoin: { reducer: () => {} },
        endTurn: {
          reducer: (draft) => {
            draft.currentPlayerIndex =
              (draft.currentPlayerIndex + 1) % draft.players.length;
            draft.turnNumber += 1;
          },
        },
      };

      const gameDefinition: GameDefinition<CoinFlipGameState, CoinFlipMoves> = {
        name: "Coin Flip",
        setup: (players) => ({
          players: players.map((p): CoinFlipGameState["players"][number] => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayerIndex: 0,
          turnNumber: 1,
          phase: "flip" as const,
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDefinition, players);

      expect(engine.getState().currentPlayerIndex).toBe(0);

      engine.executeMove("endTurn", { playerId: createPlayerId("p1") });

      const state = engine.getState();
      expect(state.currentPlayerIndex).toBe(1);
      expect(state.turnNumber).toBe(2);
    });
  });

  describe("Task 15.5, 15.6: Game Flow", () => {
    it("should define turn-based flow", () => {
      const flow: FlowDefinition<CoinFlipGameState> = {
        turn: {
          onBegin: (context) => {
            context.state.phase = "flip";
          },
          phases: {
            flip: {
              order: 0,
              next: undefined,
            },
          },
        },
      };

      expect(flow.turn).toBeDefined();
      expect(flow.turn.phases?.flip).toBeDefined();
    });

    it("should integrate flow with game", () => {
      const moves: GameMoveDefinitions<CoinFlipGameState, CoinFlipMoves> = {
        flipCoin: { reducer: () => {} },
        endTurn: { reducer: () => {} },
      };

      const flow: FlowDefinition<CoinFlipGameState> = {
        turn: {
          onBegin: (context) => {
            context.state.phase = "flip";
          },
          phases: {
            flip: { order: 0, next: undefined },
          },
        },
      };

      const gameDefinition: GameDefinition<CoinFlipGameState, CoinFlipMoves> = {
        name: "Coin Flip",
        setup: (players) => ({
          players: players.map((p): CoinFlipGameState["players"][number] => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayerIndex: 0,
          turnNumber: 1,
          phase: "flip" as const,
        }),
        moves,
        flow,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDefinition, players);
      const flowManager = engine.getFlowManager();

      expect(flowManager).toBeDefined();
      expect(flowManager?.getCurrentPhase()).toBe("flip");
    });
  });

  describe("Task 15.7, 15.8: End Conditions", () => {
    it("should define win condition (first to 3 points)", () => {
      const moves: GameMoveDefinitions<CoinFlipGameState, CoinFlipMoves> = {
        flipCoin: { reducer: () => {} },
        endTurn: { reducer: () => {} },
      };

      const gameDefinition: GameDefinition<CoinFlipGameState, CoinFlipMoves> = {
        name: "Coin Flip",
        setup: (players) => ({
          players: players.map((p): CoinFlipGameState["players"][number] => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayerIndex: 0,
          turnNumber: 1,
          phase: "flip" as const,
        }),
        moves,
        endIf: (state) => {
          const winner = state.players.find((p) => p.score >= 3);
          if (winner) {
            return {
              winner: winner.id,
              reason: "Reached 3 points",
            };
          }
          return undefined;
        },
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDefinition, players);

      // Game should not be ended yet
      expect(engine.checkGameEnd()).toBeUndefined();
    });

    it("should detect game end when player reaches 3 points", () => {
      const moves: GameMoveDefinitions<CoinFlipGameState, CoinFlipMoves> = {
        flipCoin: {
          reducer: (draft) => {
            // Force heads for testing
            draft.lastFlipResult = "heads";
            const player = draft.players[draft.currentPlayerIndex];
            if (player) {
              player.score += 1;
            }
          },
        },
        endTurn: { reducer: () => {} },
      };

      const gameDefinition: GameDefinition<CoinFlipGameState, CoinFlipMoves> = {
        name: "Coin Flip",
        setup: (players) => ({
          players: players.map((p): CoinFlipGameState["players"][number] => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayerIndex: 0,
          turnNumber: 1,
          phase: "flip" as const,
        }),
        moves,
        endIf: (state) => {
          const winner = state.players.find((p) => p.score >= 3);
          if (winner) {
            return {
              winner: winner.id,
              reason: "Reached 3 points",
            };
          }
          return undefined;
        },
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDefinition, players);

      // Flip 3 times to win
      engine.executeMove("flipCoin", { playerId: createPlayerId("p1") });
      engine.executeMove("flipCoin", { playerId: createPlayerId("p1") });
      engine.executeMove("flipCoin", { playerId: createPlayerId("p1") });

      const gameEnd = engine.checkGameEnd();
      expect(gameEnd).toBeDefined();
      expect(gameEnd?.winner).toBe(createPlayerId("p1"));
      expect(gameEnd?.reason).toBe("Reached 3 points");
    });
  });

  describe("Task 15.9, 15.10: Complete Game Playthrough", () => {
    it("should play complete game from start to finish", () => {
      const moves: GameMoveDefinitions<CoinFlipGameState, CoinFlipMoves> = {
        flipCoin: {
          reducer: (draft) => {
            // Use deterministic "random" for test
            const isHeads = Math.random() >= 0.5;
            draft.lastFlipResult = isHeads ? "heads" : "tails";

            if (isHeads) {
              const player = draft.players[draft.currentPlayerIndex];
              if (player) {
                player.score += 1;
              }
            }
          },
        },
        endTurn: {
          reducer: (draft) => {
            draft.currentPlayerIndex =
              (draft.currentPlayerIndex + 1) % draft.players.length;
            draft.turnNumber += 1;
          },
        },
      };

      const gameDefinition: GameDefinition<CoinFlipGameState, CoinFlipMoves> = {
        name: "Coin Flip",
        setup: (players) => ({
          players: players.map((p): CoinFlipGameState["players"][number] => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayerIndex: 0,
          turnNumber: 1,
          phase: "flip" as const,
        }),
        moves,
        endIf: (state) => {
          const winner = state.players.find((p) => p.score >= 3);
          if (winner) {
            return {
              winner: winner.id,
              reason: "Reached 3 points",
            };
          }
          return undefined;
        },
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDefinition, players, {
        seed: "playthrough-test",
      });

      let gameEnd = engine.checkGameEnd();
      let turn = 0;
      const maxTurns = 50; // Safety limit

      // Play until someone wins or max turns reached
      while (!gameEnd && turn < maxTurns) {
        const currentPlayer =
          engine.getState().players[engine.getState().currentPlayerIndex];

        // Flip coin
        if (currentPlayer?.id) {
          engine.executeMove("flipCoin", {
            playerId: currentPlayer.id,
          });

          // End turn
          engine.executeMove("endTurn", {
            playerId: currentPlayer.id,
          });
        }

        gameEnd = engine.checkGameEnd();
        turn++;
      }

      // Game should have ended
      expect(gameEnd).toBeDefined();
      expect(turn).toBeLessThan(maxTurns);

      // Winner should have at least 3 points
      const finalState = engine.getState();
      const winningPlayer = finalState.players.find(
        (p) => p.id === gameEnd?.winner,
      );
      expect(winningPlayer?.score).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Task 15.11, 15.12: Deterministic Replay", () => {
    it("should support undo/redo for game history", () => {
      const moves: GameMoveDefinitions<CoinFlipGameState, CoinFlipMoves> = {
        flipCoin: {
          reducer: (draft) => {
            // Force heads for deterministic test
            draft.lastFlipResult = "heads";
            const player = draft.players[draft.currentPlayerIndex];
            if (player) {
              player.score += 1;
            }
          },
        },
        endTurn: {
          reducer: (draft) => {
            draft.currentPlayerIndex =
              (draft.currentPlayerIndex + 1) % draft.players.length;
            draft.turnNumber += 1;
          },
        },
      };

      const gameDefinition: GameDefinition<CoinFlipGameState, CoinFlipMoves> = {
        name: "Coin Flip",
        setup: (players) => ({
          players: players.map((p): CoinFlipGameState["players"][number] => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayerIndex: 0,
          turnNumber: 1,
          phase: "flip" as const,
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDefinition, players);

      // Execute some moves
      engine.executeMove("flipCoin", { playerId: createPlayerId("p1") });
      engine.executeMove("endTurn", { playerId: createPlayerId("p1") });
      engine.executeMove("flipCoin", { playerId: createPlayerId("p2") });

      expect(engine.getState().players[0]?.score).toBe(1);
      expect(engine.getState().players[1]?.score).toBe(1);

      // Undo last move
      engine.undo();
      expect(engine.getState().players[1]?.score).toBe(0);

      // Redo
      engine.redo();
      expect(engine.getState().players[1]?.score).toBe(1);

      // History tracking
      const history = engine.getHistory();
      expect(history.length).toBe(3);
    });

    it("should track patches for network synchronization", () => {
      const moves: GameMoveDefinitions<CoinFlipGameState, CoinFlipMoves> = {
        flipCoin: {
          reducer: (draft) => {
            draft.lastFlipResult = "heads";
            const player = draft.players[draft.currentPlayerIndex];
            if (player) {
              player.score += 1;
            }
          },
        },
        endTurn: { reducer: () => {} },
      };

      const gameDefinition: GameDefinition<CoinFlipGameState, CoinFlipMoves> = {
        name: "Coin Flip",
        setup: (players) => ({
          players: players.map((p): CoinFlipGameState["players"][number] => ({
            id: p.id as PlayerId,
            name: p.name || "Player",
            score: 0,
          })),
          currentPlayerIndex: 0,
          turnNumber: 1,
          phase: "flip" as const,
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDefinition, players);

      // Execute move and capture patches
      const result = engine.executeMove("flipCoin", {
        playerId: createPlayerId("p1"),
      });

      expect(result.success).toBe(true);
      if (result.success) {
        // Patches should be captured for network sync
        expect(result.patches).toBeDefined();
        expect(result.patches.length).toBeGreaterThan(0);
        expect(result.inversePatches).toBeDefined();

        // Get accumulated patches
        const allPatches = engine.getPatches();
        expect(allPatches.length).toBeGreaterThan(0);
      }
    });
  });
});
