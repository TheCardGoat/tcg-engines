import type { Patch } from "immer";
import type { GameDefinition, Player } from "../game-definition/game-definition";
import type { MoveContext, MoveContextInput } from "../moves/move-system";
import type { PlayerId } from "../types/branded";
import type { MoveExecutionResult, RuleEngineOptions } from "./rule-engine";
import { RuleEngine } from "./rule-engine";

/**
 * Multiplayer Engine Mode
 */
export type MultiplayerMode = "server" | "client";

/**
 * Client State Tracking
 */
export interface ClientState {
  clientId: string;
  lastSyncedIndex: number;
  connected: boolean;
}

/**
 * Patch Broadcast Event
 */
export interface PatchBroadcast {
  patches: Patch[];
  inversePatches: Patch[];
  historyIndex: number;
  moveId: string;
  context: MoveContext;
}

/**
 * Multiplayer Engine Options
 */
export type MultiplayerEngineOptions = RuleEngineOptions & {
  mode: MultiplayerMode;
  /** Callback when server generates patches to broadcast */
  onPatchBroadcast?: (broadcast: PatchBroadcast) => void;
  /** Callback when client applies patches (for logging/debugging) */
  onPatchesApplied?: (patches: Patch[]) => void;
  /** Callback when move is rejected (for client feedback) */
  onMoveRejected?: (moveId: string, error: string, errorCode?: string) => void;
};

/**
 * MultiplayerEngine - Network-aware game engine wrapper
 *
 * Encapsulates multiplayer patterns for server-authoritative gameplay:
 * - Server mode: Executes moves, generates patches, broadcasts to clients
 * - Client mode: Applies patches from server, maintains synced state
 * - Reconnection support: Batch patch application for catching up
 * - Client tracking: Monitors which clients are synced
 *
 * @example Server Setup
 * ```typescript
 * const server = new MultiplayerEngine(gameDefinition, players, {
 *   mode: "server",
 *   seed: "server-seed-123",
 *   onPatchBroadcast: (broadcast) => {
 *     // Send patches to all connected clients
 *     websocket.broadcast(broadcast.patches);
 *   }
 * });
 *
 * // Execute move (only on server)
 * const result = server.executeMove("playCard", {
 *   playerId: "p1",
 *   data: { cardId: "card-123" }
 * });
 * // Patches automatically broadcast via callback
 * ```
 *
 * @example Client Setup
 * ```typescript
 * const client = new MultiplayerEngine(gameDefinition, players, {
 *   mode: "client",
 *   onPatchesApplied: (patches) => {
 *     console.log("State synced:", patches.length, "patches");
 *   }
 * });
 *
 * // Receive patches from server
 * websocket.on("patches", (patches) => {
 *   client.applyServerPatches(patches);
 * });
 * ```
 *
 * @example Reconnection
 * ```typescript
 * // Client reconnects after disconnect
 * const catchupPatches = server.getCatchupPatches(lastKnownIndex);
 * client.applyServerPatches(catchupPatches);
 * ```
 */
export class MultiplayerEngine<TState, TMoves extends Record<string, any>> {
  private engine: RuleEngine<TState, TMoves>;
  private mode: MultiplayerMode;
  private readonly options: MultiplayerEngineOptions;
  private clients = new Map<string, ClientState>();

  constructor(
    gameDefinition: GameDefinition<TState, TMoves>,
    players: Player[],
    options: MultiplayerEngineOptions,
  ) {
    this.mode = options.mode;
    this.options = options;

    // Create underlying RuleEngine
    this.engine = new RuleEngine(gameDefinition, players, {
      initialPatches: options.initialPatches,
      seed: options.seed,
    });
  }

  /**
   * Execute move (Server only)
   *
   * Executes a move on the authoritative server engine.
   * On success, automatically broadcasts patches via callback.
   *
   * @param moveId - Move to execute
   * @param context - Move context
   * @returns Move execution result
   * @throws Error if called on client
   */
  executeMove(moveId: string, contextInput: MoveContextInput): MoveExecutionResult {
    if (this.mode !== "server") {
      throw new Error("Only server can execute moves");
    }

    const result = this.engine.executeMove(moveId, contextInput);

    // Handle failure case
    if (result.success === false) {
      // Notify about rejected move
      if (this.options.onMoveRejected) {
        this.options.onMoveRejected(moveId, result.error, result.errorCode);
      }
      return result;
    }

    // Handle success case - broadcast patches to clients
    if (this.options.onPatchBroadcast) {
      const historyIndex = this.engine.getHistory().length - 1;
      this.options.onPatchBroadcast({
        context: contextInput as MoveContext,
        historyIndex,
        inversePatches: result.inversePatches,
        moveId,
        patches: result.patches,
      });
    }

    return result;
  }

  /**
   * Apply patches from server (Client only)
   *
   * Applies patches received from the authoritative server.
   * Used for incremental state synchronization.
   *
   * @param patches - Patches from server
   * @throws Error if called on server
   */
  applyServerPatches(patches: Patch[]): void {
    if (this.mode !== "client") {
      throw new Error("Only clients can apply server patches");
    }

    this.engine.applyPatches(patches);

    if (this.options.onPatchesApplied) {
      this.options.onPatchesApplied(patches);
    }
  }

  /**
   * Get catchup patches for reconnecting client (Server only)
   *
   * Returns all patches since a given history index.
   * Used when clients reconnect and need to catch up.
   *
   * @param sinceIndex - History index to start from (default: 0)
   * @returns Array of patches to apply
   * @throws Error if called on client
   */
  getCatchupPatches(sinceIndex = 0): Patch[] {
    if (this.mode !== "server") {
      throw new Error("Only server can provide catchup patches");
    }

    return this.engine.getPatches(sinceIndex);
  }

  /**
   * Register client (Server only)
   *
   * Track a connected client for patch synchronization.
   *
   * @param clientId - Unique client identifier
   * @param lastSyncedIndex - Last history index client has (default: -1 for new clients)
   */
  registerClient(clientId: string, lastSyncedIndex = -1): void {
    if (this.mode !== "server") {
      throw new Error("Only server can register clients");
    }

    this.clients.set(clientId, {
      clientId,
      connected: true,
      lastSyncedIndex,
    });
  }

  /**
   * Unregister client (Server only)
   *
   * Mark client as disconnected but preserve sync state for reconnection.
   *
   * @param clientId - Client identifier
   */
  unregisterClient(clientId: string): void {
    if (this.mode !== "server") {
      throw new Error("Only server can unregister clients");
    }

    const client = this.clients.get(clientId);
    if (client) {
      client.connected = false;
    }
  }

  /**
   * Update client sync index (Server only)
   *
   * Track which patches a client has applied.
   *
   * @param clientId - Client identifier
   * @param historyIndex - Latest history index client has
   */
  updateClientSyncIndex(clientId: string, historyIndex: number): void {
    if (this.mode !== "server") {
      throw new Error("Only server can update client sync");
    }

    const client = this.clients.get(clientId);
    if (client) {
      client.lastSyncedIndex = historyIndex;
    }
  }

  /**
   * Get client state (Server only)
   *
   * Get synchronization state for a specific client.
   *
   * @param clientId - Client identifier
   * @returns Client state or undefined
   */
  getClientState(clientId: string): ClientState | undefined {
    if (this.mode !== "server") {
      throw new Error("Only server can get client state");
    }

    return this.clients.get(clientId);
  }

  /**
   * Get all clients (Server only)
   *
   * Get all registered clients and their sync states.
   *
   * @returns Array of client states
   */
  getAllClients(): ClientState[] {
    if (this.mode !== "server") {
      throw new Error("Only server can get all clients");
    }

    return [...this.clients.values()];
  }

  /**
   * Get current game state
   *
   * Returns immutable snapshot of current state.
   * Available on both server and client.
   *
   * @returns Current game state
   */
  getState(): TState {
    return this.engine.getState();
  }

  /**
   * Get player-specific view of game state
   *
   * Applies playerView filter to hide private information.
   * Available on both server and client.
   *
   * @param playerId - Player requesting the view
   * @returns Filtered state for this player
   */
  getPlayerView(playerId: string): TState {
    return this.engine.getPlayerView(playerId);
  }

  /**
   * Check if a move can be executed
   *
   * Validates move without executing it.
   * Available on both server and client (for UI state).
   *
   * @param moveId - Move to check
   * @param context - Move context
   * @returns True if move can be executed
   */
  canExecuteMove(moveId: string, contextInput: MoveContextInput): boolean {
    return this.engine.canExecuteMove(moveId, contextInput);
  }

  /**
   * Get valid moves for a player
   *
   * Returns list of moves that pass their conditions.
   * Available on both server and client.
   *
   * @param playerId - Player to get moves for
   * @returns Array of valid move IDs
   */
  getValidMoves(playerId: PlayerId): string[] {
    return this.engine.getValidMoves(playerId);
  }

  /**
   * Check if game has ended
   *
   * Checks game end condition.
   * Available on both server and client.
   *
   * @returns Game end result if ended, undefined otherwise
   */
  checkGameEnd() {
    return this.engine.checkGameEnd();
  }

  /**
   * Get game history (Server only)
   *
   * Returns full move history.
   *
   * @returns Array of history entries
   */
  getHistory() {
    if (this.mode !== "server") {
      throw new Error("Only server maintains authoritative history");
    }

    return this.engine.getHistory();
  }

  /**
   * Get current history index (Server only)
   *
   * Returns the current position in history.
   * Useful for clients to know their sync position.
   *
   * @returns Current history index
   */
  getCurrentHistoryIndex(): number {
    if (this.mode !== "server") {
      throw new Error("Only server maintains authoritative history");
    }

    return this.engine.getHistory().length - 1;
  }

  /**
   * Get underlying RuleEngine (Advanced usage)
   *
   * Provides access to the underlying engine for advanced features.
   * Use with caution - direct engine access bypasses multiplayer safeguards.
   *
   * @returns Underlying RuleEngine instance
   */
  getEngine(): RuleEngine<TState, TMoves> {
    return this.engine;
  }

  /**
   * Get multiplayer mode
   *
   * Returns whether this engine is operating as server or client.
   *
   * @returns Multiplayer mode
   */
  getMode(): MultiplayerMode {
    return this.mode;
  }
}
