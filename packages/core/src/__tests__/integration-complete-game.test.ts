import { describe, expect, it } from "bun:test";
import { RuleEngine } from "../engine/rule-engine";
import type { FlowDefinition } from "../flow/flow-definition";
import type { GameDefinition } from "../game-definition/game-definition";
import type { GameMoveDefinitions } from "../game-definition/move-definitions";
import { type PlayerId, createPlayerId } from "../types";

/**
 * Task 16.3, 16.4: Integration Tests - Complete Game Flow
 *
 * Tests that all systems work together in a complete game:
 * - Game setup → Initial state
 * - Move execution with validation
 * - Flow management (turns/phases)
 * - End conditions
 * - History and replay
 * - Player views
 *
 * This validates the entire @tcg/core framework works cohesively.
 */

interface CompleteGameState {
  players: {
    id: PlayerId;
    name: string;
    health: number;
    hand: string[];
    deck: string[];
    field: string[];
  }[];
  currentPlayerIndex: number;
  turnNumber: number;
  phase: "draw" | "main" | "end" | "gameover";
  winner?: PlayerId;
}

interface CompleteGameMoves {
  drawCard: Record<string, never>;
  playCard: { cardId: string };
  attackPlayer: { targetPlayerId: PlayerId };
  endPhase: Record<string, never>;
}

describe("Integration - Complete Game Flow", () => {
  describe("Task 16.3: Setup → Moves → End", () => {
    it("should play complete game from setup to victory", () => {
      const moves: GameMoveDefinitions<CompleteGameState, CompleteGameMoves> = {
        attackPlayer: {
          condition: (state) => state.phase === "main",
          reducer: (draft, context) => {
            if (context.params?.targetPlayerId) {
              const target = draft.players.find((p) => p.id === context.params?.targetPlayerId);
              if (target) {
                target.health -= 1;
                if (target.health <= 0) {
                  draft.phase = "gameover";
                  // Find winner (player with health > 0)
                  const winner = draft.players.find((p) => p.health > 0);
                  if (winner) {
                    draft.winner = winner.id;
                  }
                }
              }
            }
          },
        },
        drawCard: {
          condition: (state) => state.phase === "draw",
          reducer: (draft) => {
            const player = draft.players[draft.currentPlayerIndex];
            if (player && player.deck.length > 0) {
              const card = player.deck.pop();
              if (card) {
                player.hand.push(card);
              }
            }
          },
        },
        endPhase: {
          reducer: (draft) => {
            if (draft.phase === "draw") {
              draft.phase = "main";
            } else if (draft.phase === "main") {
              draft.phase = "end";
            } else if (draft.phase === "end") {
              // Next player's turn
              draft.currentPlayerIndex = (draft.currentPlayerIndex + 1) % draft.players.length;
              draft.turnNumber += 1;
              draft.phase = "draw";
            }
          },
        },
        playCard: {
          condition: (state) => state.phase === "main",
          reducer: (draft, context) => {
            const player = draft.players[draft.currentPlayerIndex];
            if (player && context.params?.cardId) {
              const cardId = context.params.cardId as string;
              const cardIndex = player.hand.indexOf(cardId);
              if (cardIndex !== -1) {
                player.hand.splice(cardIndex, 1);
                player.field.push(cardId);
              }
            }
          },
        },
      };

      const flow: FlowDefinition<CompleteGameState> = {
        turn: {
          onBegin: (context) => {
            context.state.phase = "draw";
          },
          phases: {
            draw: {
              next: "main",
              order: 0,
            },
            end: {
              next: undefined,
              order: 2,
            },
            main: {
              next: "end",
              order: 1,
            },
          },
        },
      };

      const gameDefinition: GameDefinition<CompleteGameState, CompleteGameMoves> = {
        endIf: (state) => {
          if (state.winner) {
            return {
              reason: "Opponent eliminated",
              winner: state.winner,
            };
          }
          return undefined;
        },
        flow,
        moves,
        name: "Complete Game Test",
        setup: (players) => ({
          currentPlayerIndex: 0,
          phase: "draw",
          players: players.map((p) => ({
            deck: ["card1", "card2", "card3"] as string[],
            field: [] as string[],
            hand: [] as string[],
            health: 3,
            id: p.id as PlayerId,
            name: p.name || "Player",
          })),
          turnNumber: 1,
        }),
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDefinition, players, {
        seed: "complete-game-123",
      });

      // Verify initial setup
      let state = engine.getState();
      expect(state.players).toHaveLength(2);
      expect(state.players[0]?.health).toBe(3);
      expect(state.phase).toBe("draw");
      expect(state.turnNumber).toBe(1);

      // Play through a complete turn sequence
      // Turn 1 - Player 1
      engine.executeMove("drawCard", {
        params: {},
        playerId: createPlayerId("p1"),
      });
      state = engine.getState();
      expect(state.players[0]?.hand.length).toBe(1);

      engine.executeMove("endPhase", {
        params: {},
        playerId: createPlayerId("p1"),
      }); // Draw -> main
      state = engine.getState();
      expect(state.phase).toBe("main");

      engine.executeMove("playCard", {
        params: { cardId: "card3" },
        playerId: createPlayerId("p1"),
      });
      state = engine.getState();
      expect(state.players[0]?.field.length).toBe(1);

      engine.executeMove("attackPlayer", {
        params: { targetPlayerId: createPlayerId("p2") },
        playerId: createPlayerId("p1"),
      });
      state = engine.getState();
      expect(state.players[1]?.health).toBe(2);

      engine.executeMove("endPhase", {
        params: {},
        playerId: createPlayerId("p1"),
      }); // Main -> end
      state = engine.getState();
      expect(state.phase).toBe("end");

      engine.executeMove("endPhase", {
        params: {},
        playerId: createPlayerId("p1"),
      }); // End -> next turn
      state = engine.getState();
      expect(state.phase).toBe("draw");
      expect(state.turnNumber).toBe(2);
      expect(state.currentPlayerIndex).toBe(1);

      // Continue until win condition
      let turns = 0;
      const maxTurns = 20;

      while (!engine.checkGameEnd() && turns < maxTurns) {
        const currentPlayer = state.players[state.currentPlayerIndex];
        if (!currentPlayer) {
          break;
        }

        // Draw phase
        if (state.phase === "draw" && currentPlayer.deck.length > 0) {
          engine.executeMove("drawCard", {
            params: {},
            playerId: currentPlayer.id,
          });
        }
        engine.executeMove("endPhase", {
          params: {},
          playerId: currentPlayer.id,
        });

        // Main phase - attack if possible
        state = engine.getState();
        if (state.phase === "main") {
          const opponentIndex = (state.currentPlayerIndex + 1) % state.players.length;
          const opponent = state.players[opponentIndex];
          if (opponent) {
            engine.executeMove("attackPlayer", {
              params: { targetPlayerId: opponent.id },
              playerId: currentPlayer.id,
            });
          }
        }
        engine.executeMove("endPhase", {
          params: {},
          playerId: currentPlayer.id,
        });

        // End phase
        state = engine.getState();
        if (state.phase === "end") {
          engine.executeMove("endPhase", {
            params: {},
            playerId: currentPlayer.id,
          });
        }

        state = engine.getState();
        turns++;
      }

      // Game should have ended
      const gameEnd = engine.checkGameEnd();
      expect(gameEnd).toBeDefined();
      expect(gameEnd?.winner).toBeDefined();
      expect(turns).toBeLessThan(maxTurns);

      // Verify winner has health > 0
      const winner = state.players.find((p) => p.id === gameEnd?.winner);
      expect(winner?.health).toBeGreaterThan(0);

      // Verify loser has health <= 0
      const loser = state.players.find((p) => p.id !== gameEnd?.winner);
      expect(loser?.health).toBeLessThanOrEqual(0);
    });
  });

  describe("Task 16.4: All Systems Working Together", () => {
    it("should integrate zones, cards, moves, flow, RNG, and history", () => {
      const moves: GameMoveDefinitions<CompleteGameState, CompleteGameMoves> = {
        attackPlayer: { reducer: () => {} },
        drawCard: {
          reducer: (draft, context) => {
            const player = draft.players[draft.currentPlayerIndex];
            if (player && player.deck.length > 0) {
              // Use RNG to draw random card (deterministic)
              const { rng } = context;
              if (rng) {
                const index = rng.randomInt(0, player.deck.length - 1);
                const card = player.deck.splice(index, 1)[0];
                if (card) {
                  player.hand.push(card);
                }
              }
            }
          },
        },
        endPhase: { reducer: () => {} },
        playCard: { reducer: () => {} },
      };

      const gameDefinition: GameDefinition<CompleteGameState, CompleteGameMoves> = {
        moves,
        name: "Integration Test",
        playerView: (state, playerId) => ({
          ...state,
          players: state.players.map((p) => ({
            ...p,
            // Hide opponent's hand
            hand: p.id === playerId ? p.hand : [],
            // Hide opponent's deck
            deck: p.id === playerId ? p.deck : [],
          })),
        }),
        setup: (players) => ({
          currentPlayerIndex: 0,
          phase: "draw",
          players: players.map((p) => ({
            deck: ["A", "B", "C", "D", "E"] as string[],
            field: [] as string[],
            hand: [] as string[],
            health: 5,
            id: p.id as PlayerId,
            name: p.name || "Player",
          })),
          turnNumber: 1,
        }),
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDefinition, players, {
        seed: "integration-test-456",
      });

      // Test RNG integration
      engine.executeMove("drawCard", {
        params: {},
        playerId: createPlayerId("p1"),
      });
      const state1 = engine.getState();
      expect(state1.players[0]?.hand.length).toBe(1);

      // Test history tracking
      engine.executeMove("drawCard", {
        params: {},
        playerId: createPlayerId("p1"),
      });
      const history = engine.getHistory();
      expect(history.length).toBe(2);

      // Test undo/redo
      engine.undo();
      const stateAfterUndo = engine.getState();
      expect(stateAfterUndo.players[0]?.hand.length).toBe(1);

      engine.redo();
      const stateAfterRedo = engine.getState();
      expect(stateAfterRedo.players[0]?.hand.length).toBe(2);

      // Test player views
      const p1View = engine.getPlayerView(createPlayerId("p1"));
      const p2View = engine.getPlayerView(createPlayerId("p2"));

      // P1 can see their own hand
      expect(p1View.players[0]?.hand.length).toBe(2);
      // P1 cannot see P2's hand
      expect(p1View.players[1]?.hand.length).toBe(0);

      // P2 cannot see P1's hand
      expect(p2View.players[0]?.hand.length).toBe(0);

      // Test patches for network sync
      const patches = engine.getPatches();
      expect(patches.length).toBeGreaterThan(0);

      // Test deterministic replay
      const finalState = engine.getState();
      const replayedState = engine.replay();
      expect(replayedState).toEqual(finalState);
    });

    it("should handle complex game state with multiple systems", () => {
      const moves: GameMoveDefinitions<CompleteGameState, CompleteGameMoves> = {
        attackPlayer: { reducer: () => {} },
        drawCard: {
          condition: (state) => {
            const player = state.players[state.currentPlayerIndex];
            return player !== undefined && player.deck.length > 0;
          },
          reducer: (draft) => {
            const player = draft.players[draft.currentPlayerIndex];
            if (player) {
              const card = player.deck.pop();
              if (card) {
                player.hand.push(card);
              }
            }
          },
        },
        endPhase: { reducer: () => {} },
        playCard: {
          condition: (state, context) => {
            const player = state.players[state.currentPlayerIndex];
            if (!(player && context.params?.cardId)) {
              return false;
            }
            return player.hand.includes(context.params.cardId as string);
          },
          reducer: (draft, context) => {
            const player = draft.players[draft.currentPlayerIndex];
            if (player && context.params?.cardId) {
              const cardId = context.params.cardId as string;
              const index = player.hand.indexOf(cardId);
              if (index !== -1) {
                player.hand.splice(index, 1);
                player.field.push(cardId);
              }
            }
          },
        },
      };

      const gameDefinition: GameDefinition<CompleteGameState, CompleteGameMoves> = {
        moves,
        name: "Complex State Test",
        setup: (players) => ({
          currentPlayerIndex: 0,
          phase: "draw",
          players: players.map((p) => ({
            deck: Array.from({ length: 20 }, (_, i) => `card${i}`) as string[],
            field: [] as string[],
            hand: [] as string[],
            health: 10,
            id: p.id as PlayerId,
            name: p.name || "Player",
          })),
          turnNumber: 1,
        }),
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const engine = new RuleEngine(gameDefinition, players);

      // Execute multiple moves with validation
      for (let i = 0; i < 5; i++) {
        const result = engine.executeMove("drawCard", {
          params: {},
          playerId: createPlayerId("p1"),
        });
        expect(result.success).toBe(true);
      }

      const state = engine.getState();
      expect(state.players[0]?.hand.length).toBe(5);
      expect(state.players[0]?.deck.length).toBe(15);

      // Try invalid move
      const invalidResult = engine.executeMove("playCard", {
        params: { cardId: "nonexistent" },
        playerId: createPlayerId("p1"),
      });
      expect(invalidResult.success).toBe(false);

      // Valid move
      const validResult = engine.executeMove("playCard", {
        params: { cardId: state.players[0]?.hand[0] },
        playerId: createPlayerId("p1"),
      });
      expect(validResult.success).toBe(true);

      const finalState = engine.getState();
      expect(finalState.players[0]?.hand.length).toBe(4);
      expect(finalState.players[0]?.field.length).toBe(1);

      // Verify history captured all successful moves
      const history = engine.getHistory({ includeFailures: false });
      expect(history.length).toBe(6); // 5 draws + 1 successful play (failed moves filtered out)
    });
  });
});
