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
  AuthoritativeCommandStatus,
  AuthoritativeCommandRecoveryCause,
} from "@tcg/lorcana-engine";
import { createHeartbeatProbeTracker } from "@tcg/game-page-contract";
import type { GatewayClientStore } from "./gateway-client.svelte.js";
import type { IdleStore } from "./idle-store.svelte.js";

export type GatewayTransportClient = Pick<
  GatewayClientStore,
  "send" | "sendWithAck" | "addGameMessageListener" | "addStatusChangeListener"
>;

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
  gateway: GatewayTransportClient;
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
  /** Override in focused tests. Production recovery waits ten seconds. */
  recoveryTimeoutMs?: number;
  /** Override in focused tests. Production heartbeats run every fifteen seconds. */
  heartbeatIntervalMs?: number;
  onRecoveryTelemetry?: (event: AuthoritativeRecoveryTelemetryEvent) => void;
}

export type AuthoritativeRecoveryTelemetryEvent =
  | {
      type: "started";
      cause: AuthoritativeCommandRecoveryCause;
      moveType: string;
    }
  | {
      type: "completed" | "failed";
      cause: AuthoritativeCommandRecoveryCause;
      moveType: string;
      durationMs: number;
    };

/** Interval between heartbeat messages sent to the server while in-game. */
const HEARTBEAT_INTERVAL_MS = 15_000;
const RECOVERY_TIMEOUT_MS = 10_000;
const OUT_OF_BAND_DROP_ERROR_CODES = new Set([
  "drop_not_allowed",
  "player_connected",
  "too_early",
  "timeout_grace_pending",
  "timeout_first_decision",
  "timeout_within_limit",
  "timeout_requester_has_priority",
  "timeout_allowed",
  "disconnect_allowed",
  "disconnect_countdown",
  "disconnect_timestamp_missing",
  "opponent_connected",
  "clock_unsupported",
  "clock_unavailable",
  "no_time_control",
]);

export class GatewayTransport implements Transport {
  readonly #gateway: GatewayTransportClient;
  readonly #gameId: string;
  readonly #gameProfileId: string;
  readonly #userId: string | undefined;
  readonly #matchID: string;
  readonly #initialState: unknown | undefined;
  readonly #heartbeatIntervalMs: number;
  readonly #heartbeatProbeTracker = createHeartbeatProbeTracker();

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
  #pendingRetryMove: {
    message: object;
    commandID: string;
    expectedVersion: number;
    isUndo?: boolean;
  } | null = null;
  /** Base version for the single command currently guarded by `#commandStatus`. */
  #pendingCommandExpectedVersion: number | null = null;
  /** The server accepted the command but omitted the authoritative state payload. */
  #pendingCommandKnownAccepted = false;
  #commandStatus: AuthoritativeCommandStatus = { phase: "idle" };
  #commandStatusHandlers = new Set<(status: AuthoritativeCommandStatus) => void>();
  #recoveryTimer: ReturnType<typeof setTimeout> | null = null;
  #stateSyncRequested = false;
  #recoveryStartedEmitted = false;
  #recoveryFailedEmitted = false;
  #activeRecoveryCause: AuthoritativeCommandRecoveryCause | null = null;
  /**
   * Set when the server reports the match is gone (`game_not_found`). Stops
   * reconnect/heartbeat/move traffic so a gateway flap after deploy cannot
   * spam the game-server for a dead runtime game.
   */
  #sessionTerminal = false;
  readonly #recoveryTimeoutMs: number;
  readonly #onRecoveryTelemetry: ((event: AuthoritativeRecoveryTelemetryEvent) => void) | undefined;
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
    this.#heartbeatIntervalMs = config.heartbeatIntervalMs ?? HEARTBEAT_INTERVAL_MS;
    this.#recoveryTimeoutMs = config.recoveryTimeoutMs ?? RECOVERY_TIMEOUT_MS;
    this.#onRecoveryTelemetry = config.onRecoveryTelemetry;
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
    // Terminal after game_not_found: do not re-arm traffic if this instance is reused.
    if (this.#sessionTerminal) {
      this.#state = "DISCONNECTED";
      return;
    }

    this.#state = "CONNECTING";
    this.#detachGatewayListeners();

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
        // Dead matches must not re-arm reconnect after a gateway flap
        // (common during deploys when runtime Redis for the game is gone).
        if (this.#sessionTerminal) return;
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
    }, this.#heartbeatIntervalMs);

    // Watch for idle/AFK state changes and send immediate activity_update messages.
    if (this.#idleStore) {
      this.#idleStoreCleanup = this.#idleStore.watch((idle, tabVisible) => {
        this.#sendActivityUpdate(idle, tabVisible);
      });
    }
  }

  async disconnect(): Promise<void> {
    this.#detachGatewayListeners();
    this.#state = "DISCONNECTED";
    // Keep `#sessionTerminal` — a game_not_found session must stay dead even if
    // the caller disconnects and later reuses this transport instance.
    this.#lastMoveAcceptedStateVersion = -1;
    this.#pendingUndoMove = false;
    this.#pendingRetryMove = null;
    this.#clearRecoveryTimer();
    this.#stateSyncRequested = false;
    this.#recoveryStartedEmitted = false;
    this.#recoveryFailedEmitted = false;
    this.#activeRecoveryCause = null;
    this.#setCommandStatus({ phase: "idle" });
    this.#commandStatusHandlers.clear();
  }

  send(message: ClientMessage): void {
    if (this.#sessionTerminal) return;
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
        if (!this.#beginCommand(cmd.move, cmd.commandID, prevStateID)) break;
        const moveMsg = {
          type: "execute_move",
          ...this.#identityEcho(),
          gameId: this.#gameId,
          expectedVersion: prevStateID,
          moveType: cmd.move,
          payload,
        };
        this.#gateway.sendWithAck(moveMsg).catch((reason: string) => {
          if (!this.#isCurrentCommand(cmd.commandID)) return;
          if (reason === "disconnected" || reason === "timeout") {
            this.#pendingRetryMove = {
              message: moveMsg,
              commandID: cmd.commandID,
              expectedVersion: prevStateID,
            };
            this.#beginRecovery("delivery_unknown");
            this.requestStateSync(this.#serverStateVersion);
          }
        });
        break;
      }

      case "SYNC_REQUEST": {
        const lastKnown = (message as { lastKnownStateID?: number }).lastKnownStateID ?? 0;
        this.requestStateSync(lastKnown);
        break;
      }

      case "ACK":
        // No-op — gateway doesn't use ACKs
        break;

      case "UNDO_REQUEST": {
        const commandID =
          (message as { commandID?: string }).commandID ??
          `undo-${this.#gameProfileId}-${Date.now()}`;
        const undoPrevStateID = (message as { prevStateID: number }).prevStateID;
        if (!this.#beginCommand("undo", commandID, undoPrevStateID)) break;
        this.#pendingUndoMove = true;
        const undoMsg = {
          type: "execute_move",
          ...this.#identityEcho(),
          gameId: this.#gameId,
          expectedVersion: undoPrevStateID,
          moveType: "undo",
          payload: {},
        };
        this.#gateway.sendWithAck(undoMsg).catch((reason: string) => {
          if (!this.#isCurrentCommand(commandID)) return;
          if (reason === "disconnected" || reason === "timeout") {
            // Do NOT clear #pendingUndoMove here. On timeout the socket may still be
            // alive, and a delayed move_rejected (with proposal reason) must still
            // trigger proposal escalation. #pendingUndoMove is cleared by
            // move_accepted / move_rejected, or by #checkAndRetryPendingMove when
            // the server snapshot confirms the undo was already applied.
            this.#pendingRetryMove = {
              message: undoMsg,
              commandID,
              expectedVersion: undoPrevStateID,
              isUndo: true,
            };
            this.#beginRecovery("delivery_unknown");
            this.requestStateSync(this.#serverStateVersion);
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

  getAuthoritativeCommandStatus(): AuthoritativeCommandStatus {
    return { ...this.#commandStatus };
  }

  onAuthoritativeCommandStatusChange(
    handler: (status: AuthoritativeCommandStatus) => void,
  ): () => void {
    this.#commandStatusHandlers.add(handler);
    return () => this.#commandStatusHandlers.delete(handler);
  }

  requestStateSync(lastKnownStateID = this.#serverStateVersion): void {
    if (this.#sessionTerminal) return;
    const recovering =
      this.#commandStatus.phase === "recovering" || this.#commandStatus.phase === "recovery_failed";
    if (recovering && this.#stateSyncRequested) return;
    if (this.#commandStatus.phase === "recovery_failed") {
      this.#setCommandStatus({ ...this.#commandStatus, phase: "recovering" });
      this.#startRecoveryTimer();
    }
    this.#stateSyncRequested = recovering;
    this.#gateway.send({
      type: "reconnect",
      ...this.#identityEcho(),
      gameId: this.#gameId,
      lastReceivedVersion: lastKnownStateID,
    });
  }

  // ===========================================================================
  // Gateway → Engine message translation
  // ===========================================================================

  #handleGatewayMessage(msg: Record<string, unknown>): void {
    // Filter by gameId
    if (msg.gameId && msg.gameId !== this.#gameId) return;

    if (msg.type === "heartbeat_ack") {
      this.#heartbeatProbeTracker.acknowledge({
        correlationId: typeof msg.correlationId === "string" ? msg.correlationId : undefined,
        clientSentAt: typeof msg.clientSentAt === "number" ? msg.clientSentAt : undefined,
      });
    }

    switch (msg.type) {
      case "move_accepted": {
        // The server sends move_accepted as a unicast to the actor with the
        // full authoritative state and animations. Deliver it as UPDATE_FULL so
        // the engine loads the authoritative state and forwards animations to the UI.
        const stateVersion = (msg.stateVersion as number) ?? 0;
        const pendingExpectedVersion = this.#pendingCommandExpectedVersion;
        if (
          this.#commandStatus.phase !== "idle" &&
          pendingExpectedVersion !== null &&
          stateVersion <= pendingExpectedVersion
        ) {
          // A state_update may already have confirmed the previous command
          // and allowed a follow-up command. Do not let a reordered acceptance
          // for that older version replace the new optimistic state or unlock
          // the follow-up command.
          break;
        }
        this.#pendingUndoMove = false;
        const state = msg.state;
        if (state) {
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
          this.#completeCommand();
        } else if (this.#commandStatus.phase !== "idle") {
          // A correlated acceptance settles GatewayClient.sendWithAck(). If the
          // state payload is missing, its timeout can no longer start recovery,
          // so explicitly reconcile instead of leaving the UI locked forever.
          this.#pendingRetryMove = null;
          this.#pendingCommandKnownAccepted = true;
          this.#beginRecovery("delivery_unknown");
          this.requestStateSync(this.#serverStateVersion);
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
          this.#handleAuthoritativeSync(stateVersion);
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
          this.#handleAuthoritativeSync(stateVersion);
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
        const confirmsSubmittedCommand = this.#stateUpdateConfirmsSubmittedCommand(
          msg,
          stateVersion,
          stateUpdateMoveType,
        );
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
        if (confirmsSubmittedCommand) {
          // The actor receives both move_accepted and a per-actor state_update.
          // Treat the latter as authoritative confirmation when the unicast is
          // dropped or reordered; the full state has already replaced the
          // optimistic client state, so keeping the command lock is harmful.
          this.#completeCommand();
        } else {
          this.#handleAuthoritativeSync(stateVersion);
        }
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
          this.#completeCommand();
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

        if (engineCode === "STALE_STATE") {
          this.#beginRecovery("stale_state");
        } else {
          this.#completeCommand();
        }

        this.#deliverMessage({
          type: "ERROR",
          protocolVersion: PROTOCOL_VERSION,
          matchID: this.#matchID,
          code: engineCode,
          message: reason || "Move rejected",
          currentStateID: (msg.currentVersion as number) ?? undefined,
          resyncRequired: engineCode === "STALE_STATE",
        } as ServerMessage);
        if (engineCode === "STALE_STATE") {
          this.requestStateSync((msg.currentVersion as number) ?? this.#serverStateVersion);
        }
        break;
      }

      case "game_error": {
        this.#deliverGatewayGameErrorMessage(msg);
        this.#errorHandler?.(new Error((msg.message as string) ?? "Game error"));
        break;
      }

      case "error":
      case "gateway_error": {
        // Drop claims are sent directly through the gateway rather than as an
        // optimistic engine command. The live-match message router presents
        // their specific server message; forwarding them to the engine would
        // add a second, generic "invalid move" toast.
        if (OUT_OF_BAND_DROP_ERROR_CODES.has(String(msg.code))) break;
        this.#deliverGatewayGameErrorMessage(msg);
        break;
      }

      default:
        // Other messages (chat, presence, etc.) are not transport-level
        break;
    }
  }

  #sendHeartbeat(): void {
    if (this.#sessionTerminal) return;
    const activity = this.#idleStore
      ? { idle: this.#idleStore.idle, tabVisible: this.#idleStore.tabVisible }
      : undefined;

    this.#gateway.send({
      type: "heartbeat",
      ...this.#heartbeatProbeTracker.nextHeartbeatFields(),
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
    if (this.#sessionTerminal) return;
    this.#gateway.send({
      type: "activity_update",
      gameId: this.#gameId,
      idle,
      tabVisible,
    });
  }

  /**
   * Permanently stop gameplay traffic for this transport instance. Used when
   * the runtime reports `game_not_found` (deploy recycle / expired Redis).
   */
  #markSessionTerminal(reason: string): void {
    if (this.#sessionTerminal) return;
    this.#sessionTerminal = true;
    this.#pendingRetryMove = null;
    this.#pendingUndoMove = false;
    this.#stateSyncRequested = false;
    this.#clearRecoveryTimer();
    this.#completeCommand();
    this.#detachGatewayListeners();
    this.#state = "DISCONNECTED";
    this.#disconnectHandler?.(reason);
  }

  /** Tear down heartbeats, idle watchers, and gateway subscriptions. */
  #detachGatewayListeners(): void {
    this.#stopPeriodicTraffic();
    this.#heartbeatProbeTracker.clear();
    this.#idleStoreCleanup?.();
    this.#idleStoreCleanup = null;
    this.#statusUnsubscribe?.();
    this.#statusUnsubscribe = null;
    this.#unsubscribe?.();
    this.#unsubscribe = null;
  }

  #stopPeriodicTraffic(): void {
    if (this.#heartbeatTimer !== null) {
      clearInterval(this.#heartbeatTimer);
      this.#heartbeatTimer = null;
    }
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
      this.#completeCommand();
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
    this.#setSubmittingAfterReconciliation();
    this.#gateway.sendWithAck(retry.message).catch((reason: string) => {
      if (!this.#isCurrentCommand(retry.commandID)) return;
      if (reason === "disconnected" || reason === "timeout") {
        // Do NOT clear #pendingUndoMove here — same reasoning as in UNDO_REQUEST:
        // the socket may still be alive on timeout and a delayed move_rejected
        // (proposal reason) must still trigger proposal escalation.
        this.#pendingRetryMove = retry;
        this.#beginRecovery("delivery_unknown");
        this.requestStateSync(this.#serverStateVersion);
      }
    });
  }

  #handleAuthoritativeSync(currentStateVersion: number): void {
    this.#stateSyncRequested = false;
    if (
      this.#commandStatus.phase === "recovering" ||
      this.#commandStatus.phase === "recovery_failed"
    ) {
      if (this.#commandStatus.recoveryCause === "stale_state") {
        this.#pendingRetryMove = null;
        this.#completeCommand();
        return;
      }
      if (
        this.#pendingCommandKnownAccepted &&
        this.#pendingCommandExpectedVersion !== null &&
        currentStateVersion > this.#pendingCommandExpectedVersion
      ) {
        this.#completeCommand();
        return;
      }
    }
    this.#checkAndRetryPendingMove(currentStateVersion);
  }

  #beginCommand(moveId: string, commandID: string, expectedVersion: number): boolean {
    if (this.#commandStatus.phase !== "idle") return false;
    this.#recoveryStartedEmitted = false;
    this.#recoveryFailedEmitted = false;
    this.#activeRecoveryCause = null;
    this.#pendingCommandExpectedVersion = expectedVersion;
    this.#pendingCommandKnownAccepted = false;
    this.#setCommandStatus({
      phase: "submitting",
      moveId,
      commandID,
      startedAt: Date.now(),
    });
    return true;
  }

  #beginRecovery(cause: AuthoritativeCommandRecoveryCause): void {
    const current = this.#commandStatus;
    if (current.phase === "idle") return;
    if (current.phase === "recovering" && current.recoveryCause === cause) return;
    this.#activeRecoveryCause ??= cause;

    this.#setCommandStatus({
      phase: "recovering",
      moveId: current.moveId,
      commandID: current.commandID,
      startedAt: current.startedAt,
      recoveryCause: cause,
    });
    if (!this.#recoveryStartedEmitted) {
      this.#recoveryStartedEmitted = true;
      this.#onRecoveryTelemetry?.({ type: "started", cause, moveType: current.moveId });
    }
    this.#startRecoveryTimer();
  }

  #isCurrentCommand(commandID: string): boolean {
    return this.#commandStatus.phase !== "idle" && this.#commandStatus.commandID === commandID;
  }

  #setSubmittingAfterReconciliation(): void {
    const current = this.#commandStatus;
    if (current.phase === "idle") return;
    this.#clearRecoveryTimer();
    this.#setCommandStatus({
      phase: "submitting",
      moveId: current.moveId,
      commandID: current.commandID,
      startedAt: current.startedAt,
    });
  }

  #completeCommand(): void {
    const current = this.#commandStatus;
    this.#pendingCommandExpectedVersion = null;
    this.#pendingCommandKnownAccepted = false;
    if (current.phase === "idle") return;
    const recoveryCause = this.#activeRecoveryCause;
    this.#clearRecoveryTimer();
    this.#stateSyncRequested = false;
    if (recoveryCause) {
      this.#onRecoveryTelemetry?.({
        type: "completed",
        cause: recoveryCause,
        moveType: current.moveId,
        durationMs: Math.max(0, Date.now() - current.startedAt),
      });
    }
    this.#recoveryStartedEmitted = false;
    this.#recoveryFailedEmitted = false;
    this.#activeRecoveryCause = null;
    this.#setCommandStatus({ phase: "idle" });
  }

  #stateUpdateConfirmsSubmittedCommand(
    msg: Record<string, unknown>,
    stateVersion: number,
    moveType: string,
  ): boolean {
    const current = this.#commandStatus;
    const expectedVersion = this.#pendingCommandExpectedVersion;
    if (
      current.phase !== "submitting" ||
      expectedVersion === null ||
      stateVersion <= expectedVersion ||
      moveType !== current.moveId
    ) {
      return false;
    }

    const explicitActorId = typeof msg.actorId === "string" ? msg.actorId : null;
    if (explicitActorId !== null) return explicitActorId === this.#gameProfileId;

    const engineLogs = Array.isArray(msg.engineLogs) ? msg.engineLogs : [];
    for (const entry of engineLogs) {
      if (!entry || typeof entry !== "object") continue;
      const log = (entry as { log?: unknown }).log;
      if (!log || typeof log !== "object") continue;
      const playerId = (log as { playerId?: unknown }).playerId;
      if (typeof playerId === "string") return playerId === this.#gameProfileId;
    }

    // Every player receives per-actor projections for every committed move.
    // Without actor evidence, an opponent winning a concurrent CAS with the
    // same move type could be mistaken for confirmation of our command.
    return false;
  }

  #startRecoveryTimer(): void {
    this.#clearRecoveryTimer();
    this.#recoveryTimer = setTimeout(() => {
      const current = this.#commandStatus;
      if (current.phase !== "recovering") return;
      this.#stateSyncRequested = false;
      this.#setCommandStatus({ ...current, phase: "recovery_failed" });
      if (!this.#recoveryFailedEmitted) {
        this.#recoveryFailedEmitted = true;
        this.#onRecoveryTelemetry?.({
          type: "failed",
          cause: current.recoveryCause,
          moveType: current.moveId,
          durationMs: Math.max(0, Date.now() - current.startedAt),
        });
      }
    }, this.#recoveryTimeoutMs);
  }

  #clearRecoveryTimer(): void {
    if (this.#recoveryTimer === null) return;
    clearTimeout(this.#recoveryTimer);
    this.#recoveryTimer = null;
  }

  #setCommandStatus(status: AuthoritativeCommandStatus): void {
    this.#commandStatus = status;
    const snapshot = { ...status };
    for (const handler of this.#commandStatusHandlers) handler(snapshot);
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

    // Runtime game is gone (deploy recycle, TTL expiry, or never existed).
    // Stop reconnect/heartbeat loops so the tab cannot spam the game-server.
    if (gatewayCode === "game_not_found" || engineCode === "MATCH_NOT_FOUND") {
      this.#markSessionTerminal("match not found");
      return;
    }

    // completion_failed is emitted only after the engine move committed. The
    // slower match-completion pipeline failed, not the player's command, so do
    // not leave the command banner locked waiting for an acceptance that will
    // never arrive. Reconcile the committed terminal board while recovery
    // retries match completion independently.
    if (gatewayCode === "completion_failed") {
      this.#pendingRetryMove = null;
      this.#pendingUndoMove = false;
      this.#completeCommand();
      this.requestStateSync(this.#serverStateVersion);
      return;
    }

    // The game ended while our state may still show it as in progress.
    // Request a lightweight sync so the server can push the final state if needed.
    if (gatewayCode === "game_already_completed") {
      if (this.#sessionTerminal) return;
      this.#gateway.send({
        type: "request_game_state_sync",
        gameId: this.#gameId,
        stateVersion: this.#serverStateVersion,
      });
    }
  }
}
