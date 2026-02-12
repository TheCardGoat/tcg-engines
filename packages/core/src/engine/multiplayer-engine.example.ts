/**
 * MultiplayerEngine Usage Examples
 *
 * This file demonstrates how to use the MultiplayerEngine for
 * server-authoritative multiplayer gameplay with network synchronization.
 */

import type { Patch } from "immer";
import type { GameDefinition } from "../game-definition/game-definition";
import type { GameMoveDefinitions } from "../game-definition/move-definitions";
import { createPlayerId } from "../types";
import { MultiplayerEngine } from "./multiplayer-engine";

// ============================================================================
// Example 1: Basic Server Setup
// ============================================================================

interface CardGameState {
  players: {
    id: string;
    name: string;
    hand: string[];
    deck: string[];
    score: number;
  }[];
  currentPlayerIndex: number;
  turnNumber: number;
}

interface CardGameMoves {
  drawCard: Record<string, never>;
  playCard: { cardId: string };
  endTurn: Record<string, never>;
}

function createCardGame(): GameDefinition<CardGameState, CardGameMoves> {
  const moves: GameMoveDefinitions<CardGameState, CardGameMoves> = {
    drawCard: {
      condition: (state) => {
        const player = state.players[state.currentPlayerIndex];
        return player ? player.deck.length > 0 : false;
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
    endTurn: {
      reducer: (draft) => {
        draft.currentPlayerIndex = (draft.currentPlayerIndex + 1) % draft.players.length;
        draft.turnNumber += 1;
      },
    },
    playCard: {
      condition: (state, context) => {
        const player = state.players[state.currentPlayerIndex];
        return player ? player.hand.includes(context.params?.cardId as string) : false;
      },
      reducer: (draft, context) => {
        const player = draft.players[draft.currentPlayerIndex];
        if (player && context.params?.cardId) {
          const cardId = context.params.cardId as string;
          const index = player.hand.indexOf(cardId);
          if (index !== -1) {
            player.hand.splice(index, 1);
            player.score += 1;
          }
        }
      },
    },
  };

  return {
    endIf: (state) => {
      const winner = state.players.find((p) => p.score >= 10);
      return winner ? { reason: "First to 10 points", winner: winner.id } : undefined;
    },
    moves,
    name: "Example Card Game",
    setup: (players) => ({
      currentPlayerIndex: 0,
      players: players.map((p) => ({
        deck: Array.from({ length: 20 }, (_, i) => `card-${i + 1}`),
        hand: [],
        id: p.id,
        name: p.name || "Player",
        score: 0,
      })),
      turnNumber: 1,
    }),
  };
}

// ============================================================================
// Example 2: Server with WebSocket Broadcasting
// ============================================================================

/**
 * Example server implementation using WebSockets
 *
 * This shows how to integrate MultiplayerEngine with a real network layer.
 */
class GameServer {
  private engine: MultiplayerEngine<CardGameState, CardGameMoves>;
  private clients = new Map<string, any>(); // WebSocket clients

  constructor() {
    const gameDefinition = createCardGame();
    const players = [
      { id: createPlayerId("p1"), name: "Alice" },
      { id: createPlayerId("p2"), name: "Bob" },
    ];

    this.engine = new MultiplayerEngine(gameDefinition, players, {
      mode: "server",
      onMoveRejected: (moveId, error, errorCode) => {
        console.error(`[Server] Move ${moveId} rejected: ${error} (${errorCode})`);
      },
      onPatchBroadcast: (broadcast) => {
        // Broadcast patches to all connected clients
        this.broadcastToAllClients({
          historyIndex: broadcast.historyIndex,
          moveId: broadcast.moveId,
          patches: broadcast.patches,
          type: "PATCH_UPDATE",
        });

        console.log(
          `[Server] Move ${broadcast.moveId} executed, broadcasting ${broadcast.patches.length} patches`,
        );
      },
      seed: "game-123-seed",
    });
  }

  handleClientConnection(clientId: string, websocket: any) {
    console.log(`[Server] Client ${clientId} connected`);

    // Register client
    this.clients.set(clientId, websocket);
    this.engine.registerClient(clientId);

    // Send initial state
    websocket.send(
      JSON.stringify({
        historyIndex: this.engine.getCurrentHistoryIndex(),
        state: this.engine.getState(),
        type: "INITIAL_STATE",
      }),
    );
  }

  handleClientReconnection(clientId: string, lastKnownIndex: number) {
    console.log(`[Server] Client ${clientId} reconnecting from ${lastKnownIndex}`);

    const client = this.engine.getClientState(clientId);
    if (client) {
      // Client reconnecting - send catchup patches
      const catchupPatches = this.engine.getCatchupPatches(lastKnownIndex + 1);

      return {
        currentIndex: this.engine.getCurrentHistoryIndex(),
        patches: catchupPatches,
        type: "CATCHUP",
      };
    }

    // New client - send full state
    return {
      historyIndex: this.engine.getCurrentHistoryIndex(),
      state: this.engine.getState(),
      type: "INITIAL_STATE",
    };
  }

  handleClientMove(clientId: string, moveId: string, params: any) {
    console.log(`[Server] Client ${clientId} attempting move ${moveId}`);

    const result = this.engine.executeMove(moveId, {
      params,
      playerId: createPlayerId(clientId),
    });

    if (!result.success) {
      // Send error back to client
      const client = this.clients.get(clientId);
      if (client) {
        client.send(
          JSON.stringify({
            error: result.error,
            errorCode: result.errorCode,
            moveId,
            type: "MOVE_ERROR",
          }),
        );
      }
    }

    // On success, patches are automatically broadcast via onPatchBroadcast callback

    return result;
  }

  handleClientDisconnection(clientId: string) {
    console.log(`[Server] Client ${clientId} disconnected`);

    this.clients.delete(clientId);
    this.engine.unregisterClient(clientId);
  }

  private broadcastToAllClients(message: any) {
    const json = JSON.stringify(message);
    for (const [clientId, websocket] of this.clients.entries()) {
      try {
        websocket.send(json);
      } catch (error) {
        console.error(`[Server] Failed to send to ${clientId}:`, error);
      }
    }
  }

  getGameState() {
    return this.engine.getState();
  }

  checkGameEnd() {
    return this.engine.checkGameEnd();
  }
}

// ============================================================================
// Example 3: Client with Network Synchronization
// ============================================================================

/**
 * Example client implementation
 *
 * This shows how to integrate MultiplayerEngine on the client side.
 */
class GameClient {
  private engine: MultiplayerEngine<CardGameState, CardGameMoves>;
  private websocket?: any;
  private playerId: string;
  private lastSyncedIndex = -1;

  constructor(playerId: string) {
    this.playerId = playerId;

    const gameDefinition = createCardGame();
    const players = [
      { id: createPlayerId("p1"), name: "Alice" },
      { id: createPlayerId("p2"), name: "Bob" },
    ];

    this.engine = new MultiplayerEngine(gameDefinition, players, {
      mode: "client",
      onPatchesApplied: (patches) => {
        console.log(`[Client] Applied ${patches.length} patches from server`);

        // Update UI after state changes
        this.updateUI();
      },
    });
  }

  connect(websocket: any) {
    this.websocket = websocket;

    // Setup message handlers
    websocket.on("message", (data: string) => {
      const message = JSON.parse(data);

      switch (message.type) {
        case "INITIAL_STATE": {
          this.handleInitialState(message.state, message.historyIndex);
          break;
        }

        case "PATCH_UPDATE": {
          this.handlePatchUpdate(message.patches, message.historyIndex);
          break;
        }

        case "CATCHUP": {
          this.handleCatchup(message.patches, message.currentIndex);
          break;
        }

        case "MOVE_ERROR": {
          this.handleMoveError(message.moveId, message.error, message.errorCode);
          break;
        }
      }
    });
  }

  private handleInitialState(state: CardGameState, historyIndex: number) {
    console.log(`[Client] Received initial state at index ${historyIndex}`);

    // Note: For initial state, we might need to fully replace the state
    // This is a simplified example - production code might use a different approach
    this.lastSyncedIndex = historyIndex;
    this.updateUI();
  }

  private handlePatchUpdate(patches: Patch[], historyIndex: number) {
    console.log(`[Client] Received patch update for index ${historyIndex}`);

    this.engine.applyServerPatches(patches);
    this.lastSyncedIndex = historyIndex;
  }

  private handleCatchup(patches: Patch[], currentIndex: number) {
    console.log(`[Client] Catching up from ${this.lastSyncedIndex} to ${currentIndex}`);

    if (patches.length > 0) {
      this.engine.applyServerPatches(patches);
    }

    this.lastSyncedIndex = currentIndex;
  }

  private handleMoveError(moveId: string, error: string, errorCode?: string) {
    console.error(`[Client] Move ${moveId} rejected: ${error} (${errorCode})`);

    // Show error to user
    this.showError(`Cannot ${moveId}: ${error}`);
  }

  // Client-side move request (sends to server)
  requestMove(moveId: string, params?: any) {
    if (!this.websocket) {
      console.error("[Client] Not connected to server");
      return;
    }

    // Optional: Check if move is valid before sending to server
    // This provides immediate UI feedback
    const canExecute = this.engine.canExecuteMove(moveId, {
      params,
      playerId: createPlayerId(this.playerId),
    });

    if (!canExecute) {
      this.showError(`Move ${moveId} is not valid right now`);
      return;
    }

    // Send move request to server
    this.websocket.send(
      JSON.stringify({
        moveId,
        params,
        type: "MOVE",
      }),
    );

    console.log(`[Client] Sent move request: ${moveId}`);
  }

  // Get current game state
  getState() {
    return this.engine.getState();
  }

  // Get player-specific view (hides opponent's hand, etc.)
  getPlayerView() {
    return this.engine.getPlayerView(this.playerId);
  }

  // Get valid moves for UI (enable/disable buttons)
  getValidMoves() {
    return this.engine.getValidMoves(createPlayerId(this.playerId));
  }

  // Check if game has ended
  checkGameEnd() {
    return this.engine.checkGameEnd();
  }

  private updateUI() {
    // Update game UI with new state
    const state = this.getPlayerView();
    console.log("[Client] UI Updated:", state);
  }

  private showError(message: string) {
    console.error("[Client] Error:", message);
    // Show error in UI
  }

  disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = undefined;
    }
  }
}

// ============================================================================
// Example 4: Testing/Simulation
// ============================================================================

/**
 * Example usage for testing or local simulation
 */
function simulateMultiplayerGame() {
  console.log("=== Simulating Multiplayer Game ===\n");

  // Create server
  const gameDefinition = createCardGame();
  const players = [
    { id: createPlayerId("p1"), name: "Alice" },
    { id: createPlayerId("p2"), name: "Bob" },
  ];

  const server = new MultiplayerEngine(gameDefinition, players, {
    mode: "server",
    onPatchBroadcast: (broadcast) => {
      console.log(
        `[Server] Broadcasting move ${broadcast.moveId} (${broadcast.patches.length} patches)`,
      );

      // Simulate network broadcast to clients
      client1.applyServerPatches(broadcast.patches);
      client2.applyServerPatches(broadcast.patches);
    },
    seed: "simulation-seed",
  });

  // Create clients
  const client1 = new MultiplayerEngine(gameDefinition, players, {
    mode: "client",
    onPatchesApplied: (patches) => {
      console.log(`[Client 1] Synced (${patches.length} patches)`);
    },
  });

  const client2 = new MultiplayerEngine(gameDefinition, players, {
    mode: "client",
    onPatchesApplied: (patches) => {
      console.log(`[Client 2] Synced (${patches.length} patches)`);
    },
  });

  // Simulate game flow
  console.log("\nPlayer 1 draws a card:");
  server.executeMove("drawCard", {
    params: {},
    playerId: createPlayerId("p1"),
  });

  console.log("\nPlayer 1 plays a card:");
  server.executeMove("playCard", {
    params: { cardId: "card-20" },
    playerId: createPlayerId("p1"),
  });

  console.log("\nPlayer 1 ends turn:");
  server.executeMove("endTurn", { params: {}, playerId: createPlayerId("p1") });

  console.log("\nVerifying all clients are synchronized:");
  const serverState = server.getState();
  const client1State = client1.getState();
  const client2State = client2.getState();

  console.log("Server state matches Client 1:", serverState === client1State);
  console.log("Server state matches Client 2:", serverState === client2State);

  console.log("\nFinal game state:");
  console.log("Turn number:", serverState.turnNumber);
  console.log("Current player:", serverState.currentPlayerIndex);
  console.log(
    "Player 1 score:",
    serverState.players[0]?.score,
    "(hand size:",
    serverState.players[0]?.hand.length,
    ")",
  );
}

// ============================================================================
// Example 5: Reconnection Handling
// ============================================================================

function demonstrateReconnection() {
  console.log("\n=== Demonstrating Client Reconnection ===\n");

  const gameDefinition = createCardGame();
  const players = [
    { id: createPlayerId("p1"), name: "Alice" },
    { id: createPlayerId("p2"), name: "Bob" },
  ];

  // Create server
  const server = new MultiplayerEngine(gameDefinition, players, {
    mode: "server",
    onPatchBroadcast: (broadcast) => {
      console.log(`[Server] Broadcast at index ${broadcast.historyIndex}`);
    },
  });

  // Execute some moves while client is disconnected
  console.log("Executing moves while client is offline:");
  server.executeMove("drawCard", {
    params: {},
    playerId: createPlayerId("p1"),
  });
  server.executeMove("endTurn", { params: {}, playerId: createPlayerId("p1") });
  server.executeMove("drawCard", {
    params: {},
    playerId: createPlayerId("p2"),
  });

  const serverState = server.getState();
  console.log("Server state:", {
    currentPlayer: serverState.currentPlayerIndex,
    turn: serverState.turnNumber,
  });

  // Client reconnects
  console.log("\nClient reconnecting...");
  const reconnectedClient = new MultiplayerEngine(gameDefinition, players, {
    mode: "client",
  });

  // Get catchup patches
  const catchupPatches = server.getCatchupPatches(0);
  console.log(`Sending ${catchupPatches.length} catchup patches to client`);

  // Apply patches
  reconnectedClient.applyServerPatches(catchupPatches);

  const clientState = reconnectedClient.getState();
  console.log("Client state after catchup:", {
    currentPlayer: clientState.currentPlayerIndex,
    turn: clientState.turnNumber,
  });

  console.log("States match:", JSON.stringify(serverState) === JSON.stringify(clientState));
}

// Uncomment to run simulations:
// SimulateMultiplayerGame();
// DemonstrateReconnection();

export { GameServer, GameClient, simulateMultiplayerGame, demonstrateReconnection };
