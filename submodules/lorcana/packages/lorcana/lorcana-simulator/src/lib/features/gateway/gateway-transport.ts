/**
 * GatewayTransport — implements the engine's Transport interface over the
 * existing gateway WebSocket connection.
 *
 * Translates between engine protocol (ClientMessage / ServerMessage) and
 * gateway protocol (execute_move / state_update / move_rejected).
 *
 * This allows a single LorcanaClient on the browser to communicate with a
 * remote LorcanaServer on the API server without any local server engine.
 */

import type {
  Transport,
  ClientMessage,
  ServerMessage,
  ConnectionState,
  ErrorCode,
} from "@tcg/lorcana-engine";
import type { GatewayClientStore } from "./gateway-client.svelte.js";
import type { IdleStore } from "./idle-store.svelte.js";

const PROTOCOL_VERSION = 5;

/** Maps gateway `error` / `gateway_error` `code` strings to engine protocol `ErrorCode`. */
export function mapGatewayErrorCodeToEngineCode(gatewayCode: string): ErrorCode {
  switch (gatewayCode) {
    case "not_a_player":
    case "invalid_player":
      return "PLAYER_NOT_IN_MATCH";
    case "game_not_found":
      return "MATCH_NOT_FOUND";
    case "rejected_stale":
      return "STALE_STATE";
    case "service_unavailable":
    case "internal_error":
    case "completion_failed":
    case "state_not_found":
      return "INTERNAL_ERROR";
    case "unauthenticated":
    case "free_text_chat_disabled":
    case "invalid_chat_text":
    case "drop_not_allowed":
    case "player_connected":
    case "game_already_completed":
      return "FORBIDDEN";
    default:
      return "INVALID_MOVE";
  }
}

export interface GatewayTransportConfig {
  /** The connected gateway WS client. */
  gateway: GatewayClientStore;
  /** Game ID to filter inbound messages. */
  gameId: string;
  /** Game roster seat id (`game_profiles.game_profile_id`). */
  gameProfileId: string;
  /** Auth account id (`users.id`) when known — sent on wire for correlation only. */
  userId?: string;
  /** Match ID for protocol envelope. */
  matchID: string;
  /**
   * If provided, connect() synthesizes a SYNC_FULL immediately instead of
   * waiting for game_joined. This is the server-loader optimization.
   */
  initialState?: unknown;
  /**
   * If provided, the transport will watch the store's `isAfk` state and send
   * an `activity_update` message to the server whenever it changes.
   */
  idleStore?: IdleStore;
}

/** Interval between heartbeat messages sent to the server while in-game. */
const HEARTBEAT_INTERVAL_MS = 15_000;

export class GatewayTransport implements Transport {
  readonly #gateway: GatewayClientStore;
  readonly #gameId: string;
  readonly #gameProfileId: string;
  readonly #userId: string | undefined;
  readonly #matchID: string;
  readonly #initialState: unknown | undefined;

  #messageHandler: ((message: ServerMessage) => void) | null = null;
  #errorHandler: ((error: Error) => void) | null = null;
  #disconnectHandler: ((reason: string) => void) | null = null;
  #unsubscribe: (() => void) | null = null;
  #statusUnsubscribe: (() => void) | null = null;
  #state: ConnectionState = "DISCONNECTED";
  /** Server's authoritative state version — tracked for heartbeat state sync checks. */
  #serverStateVersion: number = 0;
  #heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  /**
   * State version last delivered via `move_accepted` unicast. Used to skip the
   * redundant `state_update` broadcast for the same version so it doesn't
   * overwrite the actor's `canUndo: true` with `canUndo: false`.
   */
  #lastMoveAcceptedStateVersion: number = -1;
  /**
   * Whether the last sent move was an undo. Used to detect server rejection
   * that requires an undo proposal (ranked matches).
   */
  #pendingUndoMove: boolean = false;
  /** A move that was in-flight when the socket dropped — retried after reconnect + state sync. */
  #pendingRetryMove: { message: object; expectedVersion: number; isUndo?: boolean } | null = null;
  readonly #idleStore: IdleStore | undefined;
  #idleStoreCleanup: (() => void) | null = null;

  constructor(config: GatewayTransportConfig) {
    this.#gateway = config.gateway;
    this.#gameId = config.gameId;
    this.#gameProfileId = config.gameProfileId;
    this.#userId = config.userId;
    this.#matchID = config.matchID;
    this.#initialState = config.initialState;
    this.#idleStore = config.idleStore;
  }

  /** Optional identity echoes for gateway messages (authority remains connection/ticket). */
  #identityEcho(): { gameProfileId: string; userId?: string } {
    return this.#userId
      ? { gameProfileId: this.#gameProfileId, userId: this.#userId }
      : { gameProfileId: this.#gameProfileId };
  }

  // ===========================================================================
  // Transport interface
  // ===========================================================================

  async connect(): Promise<void> {
    this.#state = "CONNECTING";

    // Register listener for gateway messages
    this.#unsubscribe = this.#gateway.addGameMessageListener((msg) => {
      this.#handleGatewayMessage(msg);
    });

    // Watch for gateway disconnects and forward to engine. On reconnect, ask the
    // gateway to push the authoritative snapshot — otherwise the client engine
    // stays stuck on a pending optimistic move and any queued #pendingRetryMove
    // is never drained, because #checkAndRetryPendingMove only fires off
    // game_joined / state_sync / state_update.
    let wasDisconnected = false;
    this.#statusUnsubscribe = this.#gateway.addStatusChangeListener((status) => {
      if (status === "disconnected" || status === "reconnecting") {
        wasDisconnected = true;
        this.#state = "DISCONNECTED";
        this.#disconnectHandler?.("gateway disconnected");
      } else if (status === "connected" && wasDisconnected) {
        wasDisconnected = false;
        this.#state = "CONNECTED";
        this.#gateway.send({
          type: "reconnect",
          ...this.#identityEcho(),
          gameId: this.#gameId,
          lastReceivedVersion: this.#serverStateVersion,
        });
      }
    });

    this.#state = "CONNECTED";

    // If initial state was provided (server-loader optimization), synthesize
    // SYNC_FULL immediately so connectSync() resolves without waiting for WS.
    if (this.#initialState) {
      const stateObj = this.#initialState as { ctx?: { _stateID?: number } };
      const stateID = stateObj?.ctx?._stateID ?? 0;

      this.#deliverMessage({
        type: "SYNC_FULL",
        protocolVersion: PROTOCOL_VERSION,
        matchID: this.#matchID,
        stateID,
        canUndo: false,
        state: this.#initialState,
      } as ServerMessage);
    }

    // Send periodic heartbeats so the server can detect and recover stale state.
    this.#heartbeatTimer = setInterval(() => {
      this.#sendHeartbeat();
    }, HEARTBEAT_INTERVAL_MS);

    // Watch for idle/AFK state changes and send immediate activity_update messages.
    if (this.#idleStore) {
      this.#idleStoreCleanup = this.#idleStore.watch((idle, tabVisible) => {
        this.#sendActivityUpdate(idle, tabVisible);
      });
    }
  }

  async disconnect(): Promise<void> {
    if (this.#heartbeatTimer !== null) {
      clearInterval(this.#heartbeatTimer);
      this.#heartbeatTimer = null;
    }
    this.#idleStoreCleanup?.();
    this.#idleStoreCleanup = null;
    this.#statusUnsubscribe?.();
    this.#statusUnsubscribe = null;
    this.#unsubscribe?.();
    this.#unsubscribe = null;
    this.#state = "DISCONNECTED";
    this.#lastMoveAcceptedStateVersion = -1;
    this.#pendingUndoMove = false;
    this.#pendingRetryMove = null;
  }

  send(message: ClientMessage): void {
    switch (message.type) {
      case "UPDATE_ACTION": {
        const cmd = (
          message as { command: { commandID: string; move: string; input?: { args?: unknown } } }
        ).command;
        const payload =
          cmd.input?.args && typeof cmd.input.args === "object"
            ? (cmd.input.args as Record<string, unknown>)
            : {};
        const prevStateID = (message as { prevStateID: number }).prevStateID;
        const moveMsg = {
          type: "execute_move",
          ...this.#identityEcho(),
          gameId: this.#gameId,
          expectedVersion: prevStateID,
          moveType: cmd.move,
          payload,
        };
        this.#gateway.sendWithAck(moveMsg).catch((reason: string) => {
          if (reason === "disconnected" || reason === "timeout") {
            this.#pendingRetryMove = { message: moveMsg, expectedVersion: prevStateID };
          }
        });
        break;
      }

      case "SYNC_REQUEST": {
        // The gateway handles sync via game_joined on join or reconnect.
        // If the client requests resync, send a reconnect message.
        const lastKnown = (message as { lastKnownStateID?: number }).lastKnownStateID ?? 0;
        this.#gateway.send({
          type: "reconnect",
          ...this.#identityEcho(),
          gameId: this.#gameId,
          lastReceivedVersion: lastKnown,
        });
        break;
      }

      case "ACK":
        // No-op — gateway doesn't use ACKs
        break;

      case "UNDO_REQUEST": {
        this.#pendingUndoMove = true;
        const undoPrevStateID = (message as { prevStateID: number }).prevStateID;
        const undoMsg = {
          type: "execute_move",
          ...this.#identityEcho(),
          gameId: this.#gameId,
          expectedVersion: undoPrevStateID,
          moveType: "undo",
          payload: {},
        };
        this.#gateway.sendWithAck(undoMsg).catch((reason: string) => {
          if (reason === "disconnected" || reason === "timeout") {
            // Do NOT clear #pendingUndoMove here. On timeout the socket may still be
            // alive, and a delayed move_rejected (with proposal reason) must still
            // trigger proposal escalation. #pendingUndoMove is cleared by
            // move_accepted / move_rejected, or by #checkAndRetryPendingMove when
            // the server snapshot confirms the undo was already applied.
            this.#pendingRetryMove = {
              message: undoMsg,
              expectedVersion: undoPrevStateID,
              isUndo: true,
            };
          }
        });
        break;
      }

      default:
        break;
    }
  }

  onMessage(handler: (message: ServerMessage) => void): void {
    this.#messageHandler = handler;
  }

  onError(handler: (error: Error) => void): void {
    this.#errorHandler = handler;
  }

  onDisconnect(handler: (reason: string) => void): void {
    this.#disconnectHandler = handler;
  }

  getState(): ConnectionState {
    return this.#state;
  }

  // ===========================================================================
  // Gateway → Engine message translation
  // ===========================================================================

  #handleGatewayMessage(msg: Record<string, unknown>): void {
    // Filter by gameId
    if (msg.gameId && msg.gameId !== this.#gameId) return;

    switch (msg.type) {
      case "move_accepted": {
        // The server sends move_accepted as a unicast to the actor with the
        // full authoritative state and animations. Deliver it as UPDATE_FULL so
        // the engine loads the authoritative state and forwards animations to the UI.
        this.#pendingUndoMove = false;
        const state = msg.state;
        if (state) {
          const stateVersion = (msg.stateVersion as number) ?? 0;
          this.#serverStateVersion = stateVersion;
          this.#lastMoveAcceptedStateVersion = stateVersion;
          const animations = Array.isArray(msg.animations) ? msg.animations : [];
          const moveType = typeof msg.moveType === "string" ? msg.moveType : "unknown";
          const actorId = typeof msg.actorId === "string" ? msg.actorId : "";
          this.#deliverMessage({
            type: "UPDATE_FULL",
            protocolVersion: PROTOCOL_VERSION,
            matchID: this.#matchID,
            stateID: stateVersion,
            canUndo: (msg.undoable as boolean) ?? false,
            state,
            processedCommand: {
              commandID: `gateway-${actorId}-${stateVersion}`,
              move: moveType,
            },
            animations,
          } as ServerMessage);
        }
        break;
      }

      case "game_joined": {
        // Treat game_joined as SYNC_FULL (initial state sync)
        const state = msg.state;
        if (state) {
          const stateVersion = (msg.stateVersion as number) ?? 0;
          this.#serverStateVersion = stateVersion;
          this.#deliverMessage({
            type: "SYNC_FULL",
            protocolVersion: PROTOCOL_VERSION,
            matchID: this.#matchID,
            stateID: stateVersion,
            canUndo: false,
            state,
          } as ServerMessage);
          this.#checkAndRetryPendingMove(stateVersion);
        }
        break;
      }

      case "state_sync": {
        // Server-initiated full state correction after detecting a version mismatch.
        // Treat identically to game_joined (SYNC_FULL) so the engine fully re-syncs.
        const state = msg.state;
        if (state) {
          const stateVersion = (msg.stateVersion as number) ?? 0;
          this.#serverStateVersion = stateVersion;
          this.#deliverMessage({
            type: "SYNC_FULL",
            protocolVersion: PROTOCOL_VERSION,
            matchID: this.#matchID,
            stateID: stateVersion,
            canUndo: false,
            state,
          } as ServerMessage);
          this.#checkAndRetryPendingMove(stateVersion);
        }
        break;
      }

      case "state_update": {
        // Broadcast state update (e.g. from opponent moves or client-authority pushes).
        const state = msg.state;
        if (!state) break;

        const stateVersion = (msg.stateVersion as number) ?? 0;
        this.#serverStateVersion = stateVersion;

        // The actor already received the definitive state (including canUndo) via
        // move_accepted unicast for this version. Skip the broadcast to avoid
        // overwriting canUndo: true with canUndo: false.
        if (stateVersion === this.#lastMoveAcceptedStateVersion) {
          this.#lastMoveAcceptedStateVersion = -1;
          break;
        }

        const stateUpdateAnimations = Array.isArray(msg.animations) ? msg.animations : [];
        const stateUpdateMoveType = typeof msg.moveType === "string" ? msg.moveType : "unknown";
        this.#deliverMessage({
          type: "UPDATE_FULL",
          protocolVersion: PROTOCOL_VERSION,
          matchID: this.#matchID,
          stateID: stateVersion,
          canUndo: false,
          state,
          processedCommand: {
            commandID: `gateway-state-update-${stateVersion}`,
            move: stateUpdateMoveType,
          },
          animations: stateUpdateAnimations,
        } as ServerMessage);
        this.#checkAndRetryPendingMove(stateVersion);
        break;
      }

      case "move_rejected": {
        const code = (msg.code as string) ?? "INVALID_MOVE";
        const reason = (msg.reason as string) ?? "";

        // The server has definitively processed this move (and rejected it).
        // Any queued reconnect-retry for the same move must be dropped — retrying
        // a rejected move would just loop. Clear it unconditionally: the engine
        // gates on one in-flight move at a time so the retry can only be for this move.
        this.#pendingRetryMove = null;

        // When the server rejects an undo move in a ranked match because it
        // requires opponent approval, automatically escalate to a proposal instead
        // of delivering a confusing INVALID_MOVE error to the engine.
        if (this.#pendingUndoMove && code === "rejected_illegal" && reason.includes("proposal")) {
          this.#pendingUndoMove = false;
          this.#gateway.send({
            type: "proposal_send",
            gameId: this.#gameId,
            actionType: "undo",
          });
          break;
        }

        this.#pendingUndoMove = false;

        const engineCode =
          code === "rejected_stale"
            ? "STALE_STATE"
            : code === "rejected_illegal"
              ? "INVALID_MOVE"
              : "INVALID_MOVE";

        this.#deliverMessage({
          type: "ERROR",
          protocolVersion: PROTOCOL_VERSION,
          matchID: this.#matchID,
          code: engineCode,
          message: reason || "Move rejected",
          currentStateID: (msg.currentVersion as number) ?? undefined,
          resyncRequired: engineCode === "STALE_STATE",
        } as ServerMessage);
        break;
      }

      case "game_error": {
        this.#deliverGatewayGameErrorMessage(msg);
        this.#errorHandler?.(new Error((msg.message as string) ?? "Game error"));
        break;
      }

      case "error":
      case "gateway_error": {
        this.#deliverGatewayGameErrorMessage(msg);
        break;
      }

      default:
        // Other messages (chat, presence, etc.) are not transport-level
        break;
    }
  }

  #sendHeartbeat(): void {
    const activity = this.#idleStore
      ? { idle: this.#idleStore.idle, tabVisible: this.#idleStore.tabVisible }
      : undefined;

    this.#gateway.send({
      type: "heartbeat",
      ...this.#identityEcho(),
      game: {
        gameId: this.#gameId,
        matchId: this.#matchID,
        stateVersion: this.#serverStateVersion,
      },
      ...(activity ? { activity } : {}),
    });
  }

  #sendActivityUpdate(idle: boolean, tabVisible: boolean): void {
    this.#gateway.send({
      type: "activity_update",
      gameId: this.#gameId,
      idle,
      tabVisible,
    });
  }

  #deliverMessage(message: ServerMessage): void {
    this.#messageHandler?.(message);
  }

  /**
   * After reconnect + state sync, retry a move that was in-flight when the socket dropped,
   * but only if the server hasn't already applied it (version-based idempotency check).
   */
  #checkAndRetryPendingMove(currentStateVersion: number): void {
    const retry = this.#pendingRetryMove;
    if (!retry) return;
    this.#pendingRetryMove = null;

    if (currentStateVersion >= retry.expectedVersion + 1) {
      // Server already processed the move — no retry needed.
      // If it was an undo, clear the flag: move_accepted/rejected will never
      // arrive for it after reconnect, so we do it here to avoid stale state.
      if (retry.isUndo) {
        this.#pendingUndoMove = false;
      }
      return;
    }

    if (currentStateVersion < retry.expectedVersion) {
      // Server snapshot is behind the move's base version — keep the retry
      // queued so it can be attempted once the state catches up.
      this.#pendingRetryMove = retry;
      return;
    }

    // currentStateVersion === retry.expectedVersion: server did not process the move — resend it.
    if (retry.isUndo) {
      this.#pendingUndoMove = true;
    }
    this.#gateway.sendWithAck(retry.message).catch((reason: string) => {
      if (reason === "disconnected" || reason === "timeout") {
        // Do NOT clear #pendingUndoMove here — same reasoning as in UNDO_REQUEST:
        // the socket may still be alive on timeout and a delayed move_rejected
        // (proposal reason) must still trigger proposal escalation.
        this.#pendingRetryMove = retry;
      }
    });
  }

  /** Push a protocol ERROR so the client engine rolls back optimistic moves. */
  #deliverGatewayGameErrorMessage(msg: Record<string, unknown>): void {
    const gatewayCode = typeof msg.code === "string" ? msg.code : "unknown";
    const engineCode = mapGatewayErrorCodeToEngineCode(gatewayCode);
    const text = typeof msg.message === "string" ? msg.message : "Server error";
    this.#deliverMessage({
      type: "ERROR",
      protocolVersion: PROTOCOL_VERSION,
      matchID: this.#matchID,
      code: engineCode,
      message: text,
      resyncRequired: engineCode === "STALE_STATE",
    } as ServerMessage);

    // The game ended while our state may still show it as in progress.
    // Request a lightweight sync so the server can push the final state if needed.
    if (gatewayCode === "game_already_completed") {
      this.#gateway.send({
        type: "request_game_state_sync",
        gameId: this.#gameId,
        stateVersion: this.#serverStateVersion,
      });
    }
  }
}
