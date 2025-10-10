import { describe, expect, it, mock } from "bun:test";
import type { Patch } from "immer";
import { MultiplayerEngine } from "../engine/multiplayer-engine";
import type { GameDefinition } from "../game-definition/game-definition";
import type { GameMoveDefinitions } from "../game-definition/move-definitions";
import { createPlayerId } from "../types";

/**
 * MultiplayerEngine Tests
 *
 * Tests the multiplayer engine wrapper that encapsulates
 * server-authoritative patterns for network gameplay.
 */

type TestGameState = {
  players: Array<{
    id: string;
    name: string;
    hand: string[];
    score: number;
  }>;
  currentPlayerIndex: number;
  deck: string[];
  turnNumber: number;
};

type TestMoves = {
  drawCard: Record<string, never>;
  playCard: { cardId: string };
  endTurn: Record<string, never>;
};

describe("MultiplayerEngine", () => {
  const createTestGame = (): GameDefinition<TestGameState, TestMoves> => {
    const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
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
          if (player && context.params?.cardId) {
            const cardId = context.params.cardId as string;
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

    return {
      name: "Test Game",
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
      }),
      moves,
    };
  };

  describe("Server Mode", () => {
    it("should create server-mode engine", () => {
      const gameDefinition = createTestGame();
      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
        seed: "test-seed",
      });

      expect(server.getMode()).toBe("server");
      expect(server.getState()).toBeDefined();
    });

    it("should execute moves and broadcast patches via callback", () => {
      const gameDefinition = createTestGame();
      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const onPatchBroadcast = mock((broadcast) => {
        expect(broadcast.patches).toBeDefined();
        expect(broadcast.inversePatches).toBeDefined();
        expect(broadcast.moveId).toBe("drawCard");
        expect(broadcast.historyIndex).toBeGreaterThanOrEqual(0);
      });

      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
        onPatchBroadcast,
      });

      const result = server.executeMove("drawCard", {
        playerId: createPlayerId("p1"),
        params: {},
      });

      expect(result.success).toBe(true);
      expect(onPatchBroadcast).toHaveBeenCalledTimes(1);

      // Verify state changed
      const state = server.getState();
      expect(state.players[0]?.hand.length).toBe(1);
    });

    it("should call onMoveRejected callback for invalid moves", () => {
      const moves: GameMoveDefinitions<TestGameState, TestMoves> = {
        drawCard: {
          condition: () => false, // Always fails
          reducer: () => {},
        },
        playCard: { reducer: () => {} },
        endTurn: { reducer: () => {} },
      };

      const gameDefinition: GameDefinition<TestGameState, TestMoves> = {
        name: "Test",
        setup: createTestGame().setup,
        moves,
      };

      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const onMoveRejected = mock((moveId, error, errorCode) => {
        expect(moveId).toBe("drawCard");
        expect(error).toContain("condition not met");
        expect(errorCode).toBe("CONDITION_FAILED");
      });

      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
        onMoveRejected,
      });

      const result = server.executeMove("drawCard", {
        playerId: createPlayerId("p1"),
        params: {},
      });

      expect(result.success).toBe(false);
      expect(onMoveRejected).toHaveBeenCalledTimes(1);
    });

    it("should provide catchup patches for reconnecting clients", () => {
      const gameDefinition = createTestGame();
      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
      });

      // Execute 3 moves
      server.executeMove("drawCard", {
        playerId: createPlayerId("p1"),
        params: {},
      });
      server.executeMove("playCard", {
        playerId: createPlayerId("p1"),
        params: { cardId: "card5" },
      });
      server.executeMove("endTurn", {
        playerId: createPlayerId("p1"),
        params: {},
      });

      // Get all patches
      const allPatches = server.getCatchupPatches(0);
      expect(allPatches.length).toBeGreaterThan(0);

      // Get patches from index 1
      const partialPatches = server.getCatchupPatches(1);
      expect(partialPatches.length).toBeLessThan(allPatches.length);
    });

    it("should manage client registration and tracking", () => {
      const gameDefinition = createTestGame();
      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
      });

      // Register clients
      server.registerClient("client-1", -1);
      server.registerClient("client-2", -1);

      const clients = server.getAllClients();
      expect(clients.length).toBe(2);
      expect(clients[0]?.connected).toBe(true);

      // Update sync index
      server.updateClientSyncIndex("client-1", 5);
      const client1 = server.getClientState("client-1");
      expect(client1?.lastSyncedIndex).toBe(5);

      // Unregister client
      server.unregisterClient("client-1");
      const disconnectedClient = server.getClientState("client-1");
      expect(disconnectedClient?.connected).toBe(false);
    });

    it("should provide current history index", () => {
      const gameDefinition = createTestGame();
      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
      });

      expect(server.getCurrentHistoryIndex()).toBe(-1); // No moves yet

      server.executeMove("drawCard", {
        playerId: createPlayerId("p1"),
        params: {},
      });
      expect(server.getCurrentHistoryIndex()).toBe(0);

      server.executeMove("endTurn", {
        playerId: createPlayerId("p1"),
        params: {},
      });
      expect(server.getCurrentHistoryIndex()).toBe(1);
    });

    it("should throw error when client tries server-only operations", () => {
      const gameDefinition = createTestGame();
      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const client = new MultiplayerEngine(gameDefinition, players, {
        mode: "client",
      });

      expect(() =>
        client.executeMove("drawCard", {
          playerId: createPlayerId("p1"),
          params: {},
        }),
      ).toThrow("Only server can execute moves");

      expect(() => client.getCatchupPatches()).toThrow(
        "Only server can provide catchup patches",
      );

      expect(() => client.registerClient("test")).toThrow(
        "Only server can register clients",
      );

      expect(() => client.getHistory()).toThrow(
        "Only server maintains authoritative history",
      );
    });
  });

  describe("Client Mode", () => {
    it("should create client-mode engine", () => {
      const gameDefinition = createTestGame();
      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      const client = new MultiplayerEngine(gameDefinition, players, {
        mode: "client",
      });

      expect(client.getMode()).toBe("client");
      expect(client.getState()).toBeDefined();
    });

    it("should apply patches from server", () => {
      const gameDefinition = createTestGame();
      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const onPatchesApplied = mock((patches: Patch[]) => {
        expect(patches.length).toBeGreaterThan(0);
      });

      const client = new MultiplayerEngine(gameDefinition, players, {
        mode: "client",
        onPatchesApplied,
      });

      // Simulate receiving patches from server
      // Create patches by executing on a server engine
      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
      });

      const result = server.executeMove("drawCard", {
        playerId: createPlayerId("p1"),
        params: {},
      });

      if (result.success) {
        // Client applies patches
        client.applyServerPatches(result.patches);

        expect(onPatchesApplied).toHaveBeenCalledTimes(1);

        // States should match
        expect(client.getState()).toEqual(server.getState());
      }
    });

    it("should throw error when server tries client-only operations", () => {
      const gameDefinition = createTestGame();
      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
      });

      expect(() => server.applyServerPatches([])).toThrow(
        "Only clients can apply server patches",
      );
    });
  });

  describe("Server-Client Synchronization", () => {
    it("should keep server and clients in sync through patches", () => {
      const gameDefinition = createTestGame();
      const players = [
        { id: createPlayerId("p1"), name: "Alice" },
        { id: createPlayerId("p2"), name: "Bob" },
      ];

      // Create server
      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
        seed: "test-seed",
      });

      // Create clients
      const client1 = new MultiplayerEngine(gameDefinition, players, {
        mode: "client",
      });

      const client2 = new MultiplayerEngine(gameDefinition, players, {
        mode: "client",
      });

      // Initial states match
      expect(server.getState()).toEqual(client1.getState());
      expect(server.getState()).toEqual(client2.getState());

      // Execute move on server
      const result = server.executeMove("drawCard", {
        playerId: createPlayerId("p1"),
        params: {},
      });

      if (result.success) {
        // Broadcast to clients
        client1.applyServerPatches(result.patches);
        client2.applyServerPatches(result.patches);

        // All states match
        expect(server.getState()).toEqual(client1.getState());
        expect(server.getState()).toEqual(client2.getState());

        // Verify move executed
        expect(server.getState().players[0]?.hand.length).toBe(1);
      }
    });

    it("should handle multiple sequential moves with synchronization", () => {
      const gameDefinition = createTestGame();
      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
      });

      const client = new MultiplayerEngine(gameDefinition, players, {
        mode: "client",
      });

      const moves = [
        { move: "drawCard", params: {} },
        { move: "playCard", params: { cardId: "card5" } },
        { move: "endTurn", params: {} },
      ];

      for (const moveData of moves) {
        const result = server.executeMove(moveData.move, {
          playerId: createPlayerId("p1"),
          params: moveData.params,
        });

        if (result.success) {
          client.applyServerPatches(result.patches);
          expect(server.getState()).toEqual(client.getState());
        }
      }

      // Final state verification
      const finalState = server.getState();
      expect(finalState.players[0]?.hand.length).toBe(0);
      expect(finalState.players[0]?.score).toBe(1);
      expect(finalState.turnNumber).toBe(2);
    });

    it("should handle client reconnection with batch patches", () => {
      const gameDefinition = createTestGame();
      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
      });

      // Execute moves while client is disconnected
      server.executeMove("drawCard", {
        playerId: createPlayerId("p1"),
        params: {},
      });
      server.executeMove("endTurn", {
        playerId: createPlayerId("p1"),
        params: {},
      });

      // Client reconnects
      const reconnectedClient = new MultiplayerEngine(gameDefinition, players, {
        mode: "client",
      });

      // Get all patches and apply
      const allPatches = server.getCatchupPatches();
      reconnectedClient.applyServerPatches(allPatches);

      // Client is synced
      expect(reconnectedClient.getState()).toEqual(server.getState());
    });
  });

  describe("Common Operations", () => {
    it("should support getState on both server and client", () => {
      const gameDefinition = createTestGame();
      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
      });

      const client = new MultiplayerEngine(gameDefinition, players, {
        mode: "client",
      });

      expect(server.getState()).toBeDefined();
      expect(client.getState()).toBeDefined();
    });

    it("should support getPlayerView on both server and client", () => {
      const gameDefinition = createTestGame();
      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
      });

      const client = new MultiplayerEngine(gameDefinition, players, {
        mode: "client",
      });

      const serverView = server.getPlayerView(createPlayerId("p1"));
      const clientView = client.getPlayerView(createPlayerId("p1"));

      expect(serverView).toBeDefined();
      expect(clientView).toBeDefined();
    });

    it("should support canExecuteMove on both server and client", () => {
      const gameDefinition = createTestGame();
      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
      });

      const client = new MultiplayerEngine(gameDefinition, players, {
        mode: "client",
      });

      const canExecuteServer = server.canExecuteMove("drawCard", {
        playerId: createPlayerId("p1"),
        params: {},
      });

      const canExecuteClient = client.canExecuteMove("drawCard", {
        playerId: createPlayerId("p1"),
        params: {},
      });

      expect(canExecuteServer).toBe(true);
      expect(canExecuteClient).toBe(true);
    });

    it("should support getValidMoves on both server and client", () => {
      const gameDefinition = createTestGame();
      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
      });

      const client = new MultiplayerEngine(gameDefinition, players, {
        mode: "client",
      });

      const serverMoves = server.getValidMoves(createPlayerId("p1"));
      const clientMoves = client.getValidMoves(createPlayerId("p1"));

      expect(serverMoves.length).toBeGreaterThan(0);
      expect(clientMoves.length).toBeGreaterThan(0);
    });

    it("should provide access to underlying engine", () => {
      const gameDefinition = createTestGame();
      const players = [{ id: createPlayerId("p1"), name: "Alice" }];

      const server = new MultiplayerEngine(gameDefinition, players, {
        mode: "server",
      });

      const engine = server.getEngine();
      expect(engine).toBeDefined();
      expect(engine.getState).toBeDefined();
    });
  });
});
