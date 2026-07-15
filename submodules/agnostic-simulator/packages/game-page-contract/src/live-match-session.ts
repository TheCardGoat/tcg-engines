import type { GatewayConnectionState, GatewayHandle } from "@tcg/gateway-client";
import type {
  ClientToServerEvents,
  GameJoinedPayload,
  PlayerDropPendingPayload,
  PresenceChangePayload,
  ServerToClientEvents,
} from "@tcg/protocol";
import type {
  ConnectionDiagnosticEvent,
  PlayerPresenceDiagnostic,
  SimulatorConnectionStatus,
} from "./connection-diagnostic.js";

/**
 * A normalized presence change the consumer can use for chat / identity
 * derivation. The raw protocol payload is forwarded untouched (the session
 * stays game-agnostic), while the normalized fields give consumers a stable
 * shape to branch on.
 */
export interface NormalizedPresenceChange {
  playerId: string;
  status: "connected" | "reconnecting" | "disconnected";
  /** Seat / side label, preserved from a prior `game_joined` if known. */
  side?: string;
  /** The original protocol payload, forwarded raw. */
  raw: unknown;
}

export interface LiveMatchSessionConfig {
  /** The acquired gateway handle for this game namespace. */
  handle: GatewayHandle;
  gameId: string;
  matchId: string;
  /** Resolved when the session joins. "player" vs "spectator" — game-specific derivation. */
  resolveRole: () => "player" | "spectator";
  /** Game profile id for the join payload, if the role is "player". */
  resolveGameProfileId: () => string | undefined;
  /**
   * Heartbeat payload builder. When paired with `heartbeatIntervalMs`, the
   * session owns the heartbeat loop and emits `heartbeat` while the underlying
   * handle is authenticated. Omit both → no session-owned heartbeat (the
   * handle's manager-level heartbeat still runs if configured).
   */
  buildHeartbeatPayload?: () => Record<string, unknown>;
  /**
   * Heartbeat cadence in ms. When paired with `buildHeartbeatPayload`, the
   * session owns the heartbeat loop. The timer is cleared on `stop()`.
   */
  heartbeatIntervalMs?: number;
  /** "client" authority (practice) suppresses server-state-sync requests. Default "server". */
  authority?: "client" | "server";
  /**
   * The game's event reducer — receives ALL server events. The session is a
   * transparent pass-through that ALSO tracks presence / diagnostics.
   */
  onGameEvent: (event: keyof ServerToClientEvents, payload: unknown) => void;
  /** Fires with a normalized presence change for chat / identity derivation. */
  onPresenceChange?: (change: NormalizedPresenceChange) => void;
  /** Fires when a diagnostic event is recorded (connect, disconnect, join, error, etc.). */
  onDiagnostic?: (event: ConnectionDiagnosticEvent) => void;
}

export interface LiveMatchSessionState {
  status: SimulatorConnectionStatus;
  authenticated: boolean;
  connectionId: string | null;
  latencyMs: number | null;
  authStatus: "ok" | "refreshing" | "failed";
  authFailureReason: GatewayConnectionState["authFailureReason"];
  lastPingAt: string | null;
  lastPongAt: string | null;
  lastHeartbeatSentAt: string | null;
  lastHeartbeatAckAt: string | null;
  joined: boolean;
  presence: PlayerPresenceDiagnostic[];
  /** Capped diagnostic event log (FIFO, last 20). */
  events: ConnectionDiagnosticEvent[];
  /** Latest error string mirrored from `GatewayConnectionState.error`, or null. */
  error: string | null;
  /** Reconnect attempt counter mirrored from `GatewayConnectionState.reconnectAttempt`. */
  reconnectAttempt: number;
}

export interface LiveMatchSession {
  /** Start the session: join the game, wire event listeners. Idempotent. */
  start(): void;
  /** Stop the session: leave the game, unwire listeners. Idempotent. */
  stop(): void;
  /** Emit a client→server event on the underlying handle. */
  emit<K extends keyof ClientToServerEvents>(
    event: K,
    payload: Parameters<ClientToServerEvents[K]>[0],
  ): void;
  /** Request a state sync with a 2s dedup. No-ops when authority === "client". */
  requestStateSyncIfDue(version: number): void;
  /** Current session state snapshot. */
  getState(): LiveMatchSessionState;
  /** Subscribe to session state changes. Fires once immediately. */
  subscribeState(cb: (state: LiveMatchSessionState) => void): () => void;
}

const MAX_DIAGNOSTIC_EVENTS = 20;
const SYNC_DEDUP_MS = 2000;

/**
 * Factory for a live-match session. The session owns join lifecycle, the
 * presence map, the diagnostic log, and sync-request dedup so a game consumer
 * only needs to wire a single `onGameEvent` reducer. It is a transparent
 * pass-through: every server event is forwarded to `onGameEvent`, while a small
 * set of session-owned events ALSO mutate internal state.
 */
export function createLiveMatchSession(config: LiveMatchSessionConfig): LiveMatchSession {
  const handle = config.handle;

  let started = false;
  let stopped = false;
  let lastSyncRequestAt = 0;

  const cleanups: Array<() => void> = [];
  const presenceMap = new Map<string, PlayerPresenceDiagnostic>();
  const diagnosticEvents: ConnectionDiagnosticEvent[] = [];
  const subscribers = new Set<(state: LiveMatchSessionState) => void>();

  const baseState: Omit<LiveMatchSessionState, "presence" | "events"> = {
    status: "idle",
    authenticated: false,
    connectionId: null,
    latencyMs: null,
    authStatus: "ok",
    authFailureReason: null,
    lastPingAt: null,
    lastPongAt: null,
    lastHeartbeatSentAt: null,
    lastHeartbeatAckAt: null,
    joined: false,
    error: null,
    reconnectAttempt: 0,
  };
  let previousStatus = baseState.status;
  let previousAuthenticated = baseState.authenticated;
  let previousAuthStatus = baseState.authStatus;

  function recordDiagnostic(type: string, details?: unknown): void {
    const event: ConnectionDiagnosticEvent = {
      at: new Date().toISOString(),
      type,
      details,
    };
    diagnosticEvents.push(event);
    while (diagnosticEvents.length > MAX_DIAGNOSTIC_EVENTS) {
      diagnosticEvents.shift();
    }
    config.onDiagnostic?.(event);
  }

  function snapshot(): LiveMatchSessionState {
    return {
      ...baseState,
      presence: Array.from(presenceMap.values()),
      events: [...diagnosticEvents],
    };
  }

  function fireSubscribers(): void {
    const state = snapshot();
    for (const cb of subscribers) cb(state);
  }

  function updateConnectionState(s: GatewayConnectionState): void {
    const becameConnected = s.status === "connected" && previousStatus !== "connected";
    const becameDisconnected = s.status === "disconnected" && previousStatus !== "disconnected";
    const becameReconnecting = s.status === "reconnecting" && previousStatus !== "reconnecting";
    const becameAuthenticated = s.authenticated && !previousAuthenticated;
    const authStatusChanged = s.authStatus !== previousAuthStatus;

    baseState.status = s.status;
    baseState.authenticated = s.authenticated;
    baseState.connectionId = s.connectionId;
    baseState.latencyMs = s.latencyMs;
    baseState.authStatus = s.authStatus;
    baseState.authFailureReason = s.authFailureReason;
    baseState.error = s.error;
    baseState.reconnectAttempt = s.reconnectAttempt;
    if (s.status === "disconnected" || s.status === "reconnecting" || !s.authenticated) {
      baseState.joined = false;
    }

    if (becameConnected) {
      recordDiagnostic("connect", { connectionId: s.connectionId });
    }
    if (becameReconnecting) {
      recordDiagnostic("reconnecting", { reconnectAttempt: s.reconnectAttempt, error: s.error });
    }
    if (becameDisconnected) {
      recordDiagnostic("disconnected", { error: s.error });
    }
    if (becameAuthenticated) {
      recordDiagnostic("authenticated", {
        authMethod: s.authMethod,
        connectionId: s.connectionId,
      });
    }
    if (authStatusChanged && s.authStatus !== "ok") {
      recordDiagnostic(`auth_${s.authStatus}`, {
        reason: s.authFailureReason,
        error: s.error,
      });
    }

    previousStatus = s.status;
    previousAuthenticated = s.authenticated;
    previousAuthStatus = s.authStatus;
    fireSubscribers();
  }

  function applySessionEvent(event: string, payload: unknown): void {
    switch (event) {
      case "game_joined": {
        baseState.joined = true;
        const gameJoined = payload as GameJoinedPayload;
        if (gameJoined?.players) {
          presenceMap.clear();
          for (const player of gameJoined.players) {
            presenceMap.set(player.id, {
              playerId: player.id,
              status: player.connected ? "connected" : "disconnected",
              connected: player.connected,
              disconnectedAt: player.disconnectedAt,
            });
          }
        }
        recordDiagnostic("game_joined", { gameId: gameJoined?.gameId });
        fireSubscribers();
        break;
      }
      case "presence_change": {
        const change = payload as PresenceChangePayload;
        if (change?.playerId) {
          const existing = presenceMap.get(change.playerId);
          presenceMap.set(change.playerId, {
            ...existing,
            playerId: change.playerId,
            status: change.status,
            connected: change.status === "connected",
            disconnectedAt: change.disconnectedAt,
          });
          config.onPresenceChange?.({
            playerId: change.playerId,
            status: change.status,
            side: existing?.side,
            raw: payload,
          });
        }
        recordDiagnostic("presence_change", payload);
        fireSubscribers();
        break;
      }
      case "player_drop_pending": {
        recordDiagnostic("player_drop_pending", payload as PlayerDropPendingPayload);
        break;
      }
      case "request_state_sync": {
        // Server-initiated sync request; respond unless we are the authority.
        requestStateSyncIfDue(0);
        break;
      }
      default:
        break;
    }
  }

  function requestStateSyncIfDue(version: number): void {
    if (config.authority === "client") return;
    const now = Date.now();
    if (now - lastSyncRequestAt < SYNC_DEDUP_MS) return;
    lastSyncRequestAt = now;
    const emitPayload: { gameId: string; stateVersion?: number } = { gameId: config.gameId };
    if (version) emitPayload.stateVersion = version;
    recordDiagnostic("state_sync_request", emitPayload);
    handle.emit("request_game_state_sync", emitPayload);
  }

  function start(): void {
    if (started || stopped) return;
    started = true;

    const role = config.resolveRole();
    const gameProfileId = config.resolveGameProfileId();
    recordDiagnostic("join_game_emit", {
      gameId: config.gameId,
      role,
      gameProfileId,
    });
    handle.join({
      gameId: config.gameId,
      role,
      gameProfileId,
    });

    const offAny = handle.onAny((event, payload) => {
      applySessionEvent(event, payload);
      config.onGameEvent(event as keyof ServerToClientEvents, payload);
    });
    cleanups.push(offAny);

    const offState = handle.subscribeState((s) => updateConnectionState(s));
    cleanups.push(offState);

    const offLatency = handle.onLatency((ms) => {
      const pongAt = Date.now();
      baseState.latencyMs = ms;
      baseState.lastPingAt = new Date(Math.max(0, pongAt - Math.max(0, ms))).toISOString();
      baseState.lastPongAt = new Date(pongAt).toISOString();
      recordDiagnostic("latency", { latencyMs: ms });
      fireSubscribers();
    });
    cleanups.push(offLatency);

    const offHeartbeatAck = handle.onHeartbeatAck((payload) => {
      baseState.lastHeartbeatAckAt =
        typeof payload.serverTime === "string" && payload.serverTime.length > 0
          ? payload.serverTime
          : new Date().toISOString();
      recordDiagnostic("heartbeat_ack", {
        serverTime: payload.serverTime,
        stateVersions: payload.stateVersions,
      });
      fireSubscribers();
    });
    cleanups.push(offHeartbeatAck);

    // Session-owned heartbeat loop. Requires BOTH `buildHeartbeatPayload` and
    // `heartbeatIntervalMs`. Skips emits while the handle is unauthenticated
    // (heartbeats are an authenticated-session concept, matching the
    // manager-level loop's auth gate).
    if (config.buildHeartbeatPayload && config.heartbeatIntervalMs) {
      const buildPayload = config.buildHeartbeatPayload;
      const intervalMs = config.heartbeatIntervalMs;
      const timer: ReturnType<typeof setInterval> = setInterval(() => {
        if (!handle.getState().authenticated) return;
        baseState.lastHeartbeatSentAt = new Date().toISOString();
        handle.emit("heartbeat", buildPayload());
        fireSubscribers();
      }, intervalMs);
      cleanups.push(() => clearInterval(timer));
    }
  }

  function stop(): void {
    if (stopped) return;
    stopped = true;

    handle.leave();

    for (const cleanup of cleanups) cleanup();
    cleanups.length = 0;

    presenceMap.clear();
    baseState.joined = false;
  }

  return {
    start,
    stop,
    emit: (event, payload) => handle.emit(event, payload),
    requestStateSyncIfDue,
    getState: snapshot,
    subscribeState: (cb) => {
      subscribers.add(cb);
      cb(snapshot());
      return () => {
        subscribers.delete(cb);
      };
    },
  };
}
