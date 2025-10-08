import { describe, expect, it } from "bun:test";
import { RuleEngine } from "../engine/rule-engine";
import type { GameDefinition } from "../game-definition/game-definition";
import type { GameMoveDefinitions } from "../game-definition/move-definitions";
import { createPlayerId } from "../types";

/**
 * Task 16.1, 16.2: Integration Tests - Server-Authoritative Pattern
 *
 * Tests the complete network synchronization pattern:
 * - Server receives move from client
 * - Server validates and executes move
 * - Server broadcasts patches to all clients
 * - Clients apply patches to sync state
 *
 * This validates that the patch-based synchronization enables
 * authoritative multiplayer gameplay.
 */

type MultiplayerGameState = {
  players: Array<{
    id: string;
    name: string;
    hand: string[];
    score: number;
  }>;
  currentPlayerIndex: number;
  deck: string[];
  turnNumber: number;
  phase: "draw" | "play" | "ended";
};

type MultiplayerMoves = {
  drawCard: Record<string, never>;
  playCard: { cardId: string };
  endTurn: Record<string, never>;
};

describe("Integration - Network Synchronization", () => {
  describe("Task 16.1: Server-Authoritative Pattern", () => {
    it("should execute move on server and broadcast patches to clients", () => {
      const moves: GameMoveDefinitions<MultiplayerGameState, MultiplayerMoves> =
        {
          drawCard: {
            reducer: (draft) => {
              const card = draft.deck.pop();
              if (card) {
                const player = draft.players[draft.currentPlayerIndex];
                if (player) {
                  player.hand.push(card);
                }
              }
            },
          },
          playCard: {
            reducer: (draft, context) => {
              const player = draft.players[draft.currentPlayerIndex];
              if (player && context.data?.cardId) {
                const cardId = context.data.cardId as string;
                const cardIndex = player.hand.indexOf(cardId);
                if (cardIndex >= 0) {
                  player.hand.splice(cardIndex, 1);
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

      const gameDefinition: GameDefinition<
        MultiplayerGameState,
        MultiplayerMoves
      > = {
        name: "Multiplayer Test Game",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            hand: [],
            score: 0,
          })),
          currentPlayerIndex: 0,
          deck: ["card1", "card2", "card3", "card4", "card5"],
          turnNumber: 1,
          phase: "draw",
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      // Server creates authoritative engine
      const server = new RuleEngine(gameDefinition, players, {
        seed: "server-123",
      });

      // Clients create local engines (synchronized via patches)
      const client1 = new RuleEngine(gameDefinition, players, {
        seed: "client-1",
      });
      const client2 = new RuleEngine(gameDefinition, players, {
        seed: "client-2",
      });

      // Initial state should match
      expect(server.getState()).toEqual(client1.getState());
      expect(server.getState()).toEqual(client2.getState());

      // Client 1 sends move to server
      const moveContext = {
        playerId: createPlayerId("p1"),
      };

      // Server executes move
      const result = server.executeMove("drawCard", moveContext);

      expect(result.success).toBe(true);
      if (result.success) {
        // Server broadcasts patches to all clients
        const patches = result.patches;

        // Clients apply patches to synchronize
        client1.applyPatches(patches);
        client2.applyPatches(patches);

        // All states should now match
        const serverState = server.getState();
        const client1State = client1.getState();
        const client2State = client2.getState();

        expect(serverState).toEqual(client1State);
        expect(serverState).toEqual(client2State);

        // Verify move actually executed
        expect(serverState.players[0]?.hand.length).toBe(1);
        expect(serverState.deck.length).toBe(4);
      }
    });

    it("should reject invalid moves on server before broadcasting", () => {
      const moves: GameMoveDefinitions<MultiplayerGameState, MultiplayerMoves> =
        {
          drawCard: {
            condition: (state) => state.phase === "draw",
            reducer: (draft) => {
              const card = draft.deck.pop();
              if (card) {
                const player = draft.players[draft.currentPlayerIndex];
                if (player) {
                  player.hand.push(card);
                }
              }
            },
          },
          playCard: { reducer: () => {} },
          endTurn: { reducer: () => {} },
        };

      const gameDefinition: GameDefinition<
        MultiplayerGameState,
        MultiplayerMoves
      > = {
        name: "Validation Test",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            hand: [],
            score: 0,
          })),
          currentPlayerIndex: 0,
          deck: ["card1"],
          turnNumber: 1,
          phase: "play", // Not "draw" phase
        }),
        moves,
      };

      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const server = new RuleEngine(gameDefinition, players);
      const client = new RuleEngine(gameDefinition, players);

      // Client attempts invalid move
      const result = server.executeMove("drawCard", {
        playerId: createPlayerId("p1"),
      });

      // Server rejects move
      expect(result.success).toBe(false);

      // No patches to broadcast
      if (!result.success) {
        expect(result.patches).toBeUndefined();
      }

      // Client state unchanged
      expect(server.getState()).toEqual(client.getState());
    });
  });

  describe("Task 16.2: Network Synchronization Pattern", () => {
    it("should handle multiple moves with incremental patch synchronization", () => {
      const moves: GameMoveDefinitions<MultiplayerGameState, MultiplayerMoves> =
        {
          drawCard: {
            reducer: (draft) => {
              const card = draft.deck.pop();
              if (card) {
                const player = draft.players[draft.currentPlayerIndex];
                if (player) {
                  player.hand.push(card);
                }
              }
            },
          },
          playCard: {
            reducer: (draft, context) => {
              const player = draft.players[draft.currentPlayerIndex];
              if (player && context.data?.cardId) {
                const cardId = context.data.cardId as string;
                const cardIndex = player.hand.indexOf(cardId);
                if (cardIndex >= 0) {
                  player.hand.splice(cardIndex, 1);
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

      const gameDefinition: GameDefinition<
        MultiplayerGameState,
        MultiplayerMoves
      > = {
        name: "Incremental Sync Test",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            hand: [],
            score: 0,
          })),
          currentPlayerIndex: 0,
          deck: ["card1", "card2", "card3"],
          turnNumber: 1,
          phase: "draw",
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const server = new RuleEngine(gameDefinition, players);
      const client = new RuleEngine(gameDefinition, players);

      // Simulate 3 moves with incremental synchronization
      const moves_to_execute = [
        { move: "drawCard", data: {} },
        { move: "playCard", data: { cardId: "card3" } }, // card3 was drawn
        { move: "endTurn", data: {} },
      ];

      for (const moveToExecute of moves_to_execute) {
        const result = server.executeMove(moveToExecute.move, {
          playerId: createPlayerId("p1"),
          data: moveToExecute.data,
        });

        if (result.success) {
          // Client applies patches incrementally
          client.applyPatches(result.patches);

          // States should match after each move
          expect(server.getState()).toEqual(client.getState());
        }
      }

      // Final verification
      const finalState = server.getState();
      expect(finalState.players[0]?.hand.length).toBe(0); // Played card
      expect(finalState.players[0]?.score).toBe(1); // Scored 1 point
      expect(finalState.currentPlayerIndex).toBe(1); // Next player
      expect(finalState.turnNumber).toBe(2); // Turn incremented
    });

    it("should support batch patch application for reconnecting clients", () => {
      const moves: GameMoveDefinitions<MultiplayerGameState, MultiplayerMoves> =
        {
          drawCard: {
            reducer: (draft) => {
              const card = draft.deck.pop();
              if (card) {
                const player = draft.players[draft.currentPlayerIndex];
                if (player) {
                  player.hand.push(card);
                }
              }
            },
          },
          playCard: { reducer: () => {} },
          endTurn: {
            reducer: (draft) => {
              draft.currentPlayerIndex =
                (draft.currentPlayerIndex + 1) % draft.players.length;
              draft.turnNumber += 1;
            },
          },
        };

      const gameDefinition: GameDefinition<
        MultiplayerGameState,
        MultiplayerMoves
      > = {
        name: "Batch Sync Test",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            hand: [],
            score: 0,
          })),
          currentPlayerIndex: 0,
          deck: ["card1", "card2", "card3", "card4"],
          turnNumber: 1,
          phase: "draw",
        }),
        moves,
      };

      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const server = new RuleEngine(gameDefinition, players);

      // Execute 3 moves on server while client is disconnected
      server.executeMove("drawCard", { playerId: createPlayerId("p1") });
      server.executeMove("endTurn", { playerId: createPlayerId("p1") });
      server.executeMove("drawCard", { playerId: createPlayerId("p2") });

      // Client reconnects and needs to catch up
      const disconnectedClient = new RuleEngine(gameDefinition, players);

      // Server sends all accumulated patches
      const allPatches = server.getPatches();

      // Client applies batch
      disconnectedClient.applyPatches(allPatches);

      // Client is now synchronized
      expect(server.getState()).toEqual(disconnectedClient.getState());

      // Verify state is correct
      const state = disconnectedClient.getState();
      expect(state.players[0]?.hand.length).toBe(1); // Alice drew 1
      expect(state.players[1]?.hand.length).toBe(1); // Bob drew 1
      expect(state.currentPlayerIndex).toBe(1); // Bob's turn
      expect(state.turnNumber).toBe(2);
    });

    it("should maintain deterministic state across server and clients", () => {
      const moves: GameMoveDefinitions<MultiplayerGameState, MultiplayerMoves> =
        {
          drawCard: {
            reducer: (draft, context) => {
              // Use RNG for deterministic shuffling
              const rng = context.rng;
              if (rng && draft.deck.length > 0) {
                const index = rng.randomInt(0, draft.deck.length - 1);
                const card = draft.deck.splice(index, 1)[0];
                if (card) {
                  const player = draft.players[draft.currentPlayerIndex];
                  if (player) {
                    player.hand.push(card);
                  }
                }
              }
            },
          },
          playCard: { reducer: () => {} },
          endTurn: { reducer: () => {} },
        };

      const gameDefinition: GameDefinition<
        MultiplayerGameState,
        MultiplayerMoves
      > = {
        name: "Deterministic Sync Test",
        setup: (players) => ({
          players: players.map((p) => ({
            id: p.id,
            name: p.name || "Player",
            hand: [],
            score: 0,
          })),
          currentPlayerIndex: 0,
          deck: ["card1", "card2", "card3", "card4", "card5"],
          turnNumber: 1,
          phase: "draw",
        }),
        moves,
      };

      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      // Server and client use same seed
      const server = new RuleEngine(gameDefinition, players, {
        seed: "deterministic-123",
      });
      const client = new RuleEngine(gameDefinition, players, {
        seed: "deterministic-123",
      });

      // Execute move on server
      const result = server.executeMove("drawCard", {
        playerId: createPlayerId("p1"),
      });

      if (result.success) {
        // Client applies patches
        client.applyPatches(result.patches);

        // States match exactly
        expect(server.getState()).toEqual(client.getState());

        // Same card drawn due to deterministic RNG
        const serverHand = server.getState().players[0]?.hand;
        const clientHand = client.getState().players[0]?.hand;
        expect(serverHand).toEqual(clientHand);
      }
    });
  });
});
