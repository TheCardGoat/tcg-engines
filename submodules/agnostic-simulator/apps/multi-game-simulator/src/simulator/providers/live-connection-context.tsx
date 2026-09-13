import {
  createLiveMatchSession,
  redactsSimulatorConnectionDiagnostic,
  type ConnectionDiagnosticEvent,
  type LiveMatchSessionConfig,
  type LiveMatchSessionState,
  type LiveMatchBootstrapV1,
  type NormalizedPresenceChange,
} from "@tcg/game-page-contract";
import type { GatewayConnectionState, GatewayHandle } from "@tcg/gateway-client";
import type { ClientToServerEvents, ServerToClientEvents } from "@tcg/protocol";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import {
  setGatewayManagerAnalyticsSink,
  type GatewayManagerAnalyticsSink,
} from "../../lib/gateway/gateway-manager";
import { logBrowserInfo } from "../../observability/browser";
import { createRequiredSimulatorContext } from "./context-utils";

export type SimulatorConnectionTelemetryEvent =
  | {
      type: "simulator_connection_status_changed";
      at: string;
      gameId: string;
      matchId: string;
      status: LiveMatchSessionState["status"];
      authenticated: boolean;
      authStatus: LiveMatchSessionState["authStatus"];
      authFailureReason: GatewayConnectionState["authFailureReason"];
      connectionId: string | null;
      reconnectAttempt: number;
      error: string | null;
    }
  | {
      type: "simulator_connection_latency_sample";
      at: string;
      gameId: string;
      matchId: string;
      connectionId: string | null;
      latencyMs: number;
      lastPingAt: string | null;
      lastPongAt: string | null;
    }
  | {
      type: "simulator_connection_heartbeat_ack";
      at: string;
      gameId: string;
      matchId: string;
      lastHeartbeatAckAt: string | null;
      stateVersions: Record<string, number>;
    }
  | {
      type: "simulator_connection_reconnect_attempt";
      at: string;
      gameId: string;
      matchId: string;
      reconnectAttempt: number;
      error: string | null;
    }
  | {
      type: "simulator_connection_auth_failure";
      at: string;
      gameId: string;
      matchId: string;
      authFailureReason: GatewayConnectionState["authFailureReason"];
      error: string | null;
    }
  | {
      type: "simulator_connection_gateway_analytics";
      at: string;
      gameId: string;
      matchId: string;
      managerEvent: string;
      payload?: Record<string, unknown>;
    };

export type SimulatorConnectionTelemetrySink = (event: SimulatorConnectionTelemetryEvent) => void;

export interface SimulatorLiveConnectionContextValue extends LiveMatchSessionState {
  emit: <K extends keyof ClientToServerEvents>(
    event: K,
    payload: Parameters<ClientToServerEvents[K]>[0],
  ) => void;
  requestStateSyncIfDue: (version: number) => void;
}

export interface SimulatorLiveConnectionProviderProps {
  children: ReactNode;
  handle: GatewayHandle | null;
  bootstrap: LiveMatchBootstrapV1;
  buildHeartbeatPayload?: LiveMatchSessionConfig["buildHeartbeatPayload"];
  heartbeatIntervalMs?: LiveMatchSessionConfig["heartbeatIntervalMs"];
  authority?: LiveMatchSessionConfig["authority"];
  onGameEvent: (event: keyof ServerToClientEvents, payload: unknown) => void;
  onPresenceChange?: (change: NormalizedPresenceChange) => void;
  onDiagnostic?: (event: ConnectionDiagnosticEvent) => void;
  telemetrySink?: SimulatorConnectionTelemetrySink;
}

export const EMPTY_SIMULATOR_LIVE_CONNECTION_STATE: LiveMatchSessionState = {
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
  presence: [],
  events: [],
  error: null,
  reconnectAttempt: 0,
};

const EMPTY_SIMULATOR_LIVE_CONNECTION_CONTEXT: SimulatorLiveConnectionContextValue = {
  ...EMPTY_SIMULATOR_LIVE_CONNECTION_STATE,
  emit: () => {},
  requestStateSyncIfDue: () => {},
};

const [SimulatorLiveConnectionContextProvider, useSimulatorLiveConnection] =
  createRequiredSimulatorContext<SimulatorLiveConnectionContextValue>(
    EMPTY_SIMULATOR_LIVE_CONNECTION_CONTEXT,
  );

export { useSimulatorLiveConnection };

export function SimulatorLiveConnectionProvider({
  children,
  handle,
  bootstrap,
  buildHeartbeatPayload,
  heartbeatIntervalMs,
  authority,
  onGameEvent,
  onPresenceChange,
  onDiagnostic,
  telemetrySink,
}: SimulatorLiveConnectionProviderProps) {
  const gameId = bootstrap.game.gameId;
  const matchId = bootstrap.match.matchId;
  const viewerKey =
    bootstrap.viewer.role === "player"
      ? `player:${bootstrap.viewer.userId}:${bootstrap.viewer.actorId}`
      : `spectator:${bootstrap.viewer.userId ?? "anonymous"}:${bootstrap.viewer.spectatorId}`;
  // Snapshots and callbacks can change without changing the connection's identity.
  const latest = useRef({
    bootstrap,
    onGameEvent,
    onPresenceChange,
    onDiagnostic,
    buildHeartbeatPayload,
  });
  latest.current = {
    bootstrap,
    onGameEvent,
    onPresenceChange,
    onDiagnostic,
    buildHeartbeatPayload,
  };
  const hasHeartbeat = Boolean(buildHeartbeatPayload);
  const [state, setState] = useState<LiveMatchSessionState>(EMPTY_SIMULATOR_LIVE_CONNECTION_STATE);
  const sessionRef = useRef<ReturnType<typeof createLiveMatchSession> | null>(null);
  const telemetryRef = useRef<SimulatorConnectionTelemetrySink | undefined>(telemetrySink);

  useEffect(() => {
    telemetryRef.current = telemetrySink;
  }, [telemetrySink]);

  const emitTelemetry = useCallback((event: SimulatorConnectionTelemetryEvent) => {
    const redacted = redactsSimulatorConnectionDiagnostic(event);
    telemetryRef.current?.(redacted as SimulatorConnectionTelemetryEvent);
  }, []);

  useEffect(() => {
    if (!telemetrySink) return;
    const sink: GatewayManagerAnalyticsSink = (managerEvent, payload) => {
      emitTelemetry({
        type: "simulator_connection_gateway_analytics",
        at: new Date().toISOString(),
        gameId,
        matchId,
        managerEvent,
        ...(payload ? { payload } : {}),
      });
    };
    setGatewayManagerAnalyticsSink(sink);
    return () => setGatewayManagerAnalyticsSink(null);
  }, [emitTelemetry, gameId, matchId, telemetrySink]);

  useEffect(() => {
    if (!handle) {
      sessionRef.current = null;
      setState(EMPTY_SIMULATOR_LIVE_CONNECTION_STATE);
      return;
    }

    let previousTelemetryState: LiveMatchSessionState | null = null;
    let previousAuthFailureKey: string | null = null;

    const session = createLiveMatchSession({
      handle,
      bootstrap: latest.current.bootstrap,
      buildHeartbeatPayload: hasHeartbeat
        ? () => latest.current.buildHeartbeatPayload?.() ?? {}
        : undefined,
      heartbeatIntervalMs,
      authority,
      onGameEvent: (event, payload) => latest.current.onGameEvent(event, payload),
      onPresenceChange: (change) => latest.current.onPresenceChange?.(change),
      onHeartbeatRoundTrip: (sample) => {
        logBrowserInfo("websocket.game_round_trip", {
          "socketio.namespace": handle.slug,
          "socketio.round_trip_ms": sample.roundTripMs,
          "gateway.request_id": sample.correlationId,
        });
      },
      onDiagnostic: (event) => {
        latest.current.onDiagnostic?.(event);
        if (event.type !== "heartbeat_ack") return;
        emitTelemetry({
          type: "simulator_connection_heartbeat_ack",
          at: event.at,
          gameId,
          matchId,
          lastHeartbeatAckAt: extractHeartbeatAckAt(event.details) ?? event.at,
          stateVersions: extractStateVersions(event.details),
        });
      },
    });

    sessionRef.current = session;
    session.start();
    const unsubscribe = session.subscribeState((next) => {
      setState(next);
      emitStateTelemetry({
        state: next,
        previous: previousTelemetryState,
        previousAuthFailureKey,
        gameId,
        matchId,
        gameSlug: handle.slug,
        emitTelemetry,
      });
      previousAuthFailureKey = authFailureKey(next);
      previousTelemetryState = next;
    });

    return () => {
      unsubscribe();
      session.stop();
      if (sessionRef.current === session) {
        sessionRef.current = null;
      }
      setState(EMPTY_SIMULATOR_LIVE_CONNECTION_STATE);
    };
  }, [
    authority,
    hasHeartbeat,
    emitTelemetry,
    gameId,
    handle,
    heartbeatIntervalMs,
    matchId,
    viewerKey,
  ]);

  const emit = useCallback<SimulatorLiveConnectionContextValue["emit"]>((event, payload) => {
    sessionRef.current?.emit(event, payload);
  }, []);

  const requestStateSyncIfDue = useCallback((version: number) => {
    sessionRef.current?.requestStateSyncIfDue(version);
  }, []);

  const value = useMemo<SimulatorLiveConnectionContextValue>(
    () => ({
      ...state,
      emit,
      requestStateSyncIfDue,
    }),
    [emit, requestStateSyncIfDue, state],
  );

  return (
    <SimulatorLiveConnectionContextProvider value={value}>
      {children}
    </SimulatorLiveConnectionContextProvider>
  );
}

interface EmitStateTelemetryInput {
  state: LiveMatchSessionState;
  previous: LiveMatchSessionState | null;
  previousAuthFailureKey: string | null;
  gameId: string;
  matchId: string;
  gameSlug: GatewayHandle["slug"];
  emitTelemetry: (event: SimulatorConnectionTelemetryEvent) => void;
}

function emitStateTelemetry({
  state,
  previous,
  previousAuthFailureKey,
  gameId,
  matchId,
  gameSlug,
  emitTelemetry,
}: EmitStateTelemetryInput): void {
  if (hasStatusChanged(previous, state)) {
    emitTelemetry({
      type: "simulator_connection_status_changed",
      at: new Date().toISOString(),
      gameId,
      matchId,
      status: state.status,
      authenticated: state.authenticated,
      authStatus: state.authStatus,
      authFailureReason: state.authFailureReason,
      connectionId: state.connectionId,
      reconnectAttempt: state.reconnectAttempt,
      error: state.error,
    });
  }

  if (
    typeof state.latencyMs === "number" &&
    (!previous ||
      previous.latencyMs !== state.latencyMs ||
      previous.lastPongAt !== state.lastPongAt)
  ) {
    logBrowserInfo("websocket.gateway_round_trip", {
      "socketio.namespace": gameSlug,
      "socketio.round_trip_ms": state.latencyMs,
      "browser.document_visible": document.visibilityState === "visible",
    });
    emitTelemetry({
      type: "simulator_connection_latency_sample",
      at: state.lastPongAt ?? new Date().toISOString(),
      gameId,
      matchId,
      connectionId: state.connectionId,
      latencyMs: state.latencyMs,
      lastPingAt: state.lastPingAt,
      lastPongAt: state.lastPongAt,
    });
  }

  if (
    state.status === "reconnecting" &&
    state.reconnectAttempt > 0 &&
    (!previous || previous.reconnectAttempt !== state.reconnectAttempt)
  ) {
    emitTelemetry({
      type: "simulator_connection_reconnect_attempt",
      at: new Date().toISOString(),
      gameId,
      matchId,
      reconnectAttempt: state.reconnectAttempt,
      error: state.error,
    });
  }

  const nextAuthFailureKey = authFailureKey(state);
  if (
    state.authStatus === "failed" &&
    nextAuthFailureKey !== null &&
    nextAuthFailureKey !== previousAuthFailureKey
  ) {
    emitTelemetry({
      type: "simulator_connection_auth_failure",
      at: new Date().toISOString(),
      gameId,
      matchId,
      authFailureReason: state.authFailureReason,
      error: state.error,
    });
  }
}

function hasStatusChanged(
  previous: LiveMatchSessionState | null,
  state: LiveMatchSessionState,
): boolean {
  if (!previous)
    return state.status !== "idle" || state.authStatus !== "ok" || state.error !== null;
  return (
    previous.status !== state.status ||
    previous.authenticated !== state.authenticated ||
    previous.authStatus !== state.authStatus ||
    previous.authFailureReason !== state.authFailureReason ||
    previous.connectionId !== state.connectionId ||
    previous.reconnectAttempt !== state.reconnectAttempt ||
    previous.error !== state.error
  );
}

function authFailureKey(state: LiveMatchSessionState): string | null {
  if (state.authStatus !== "failed") return null;
  return `${state.authFailureReason ?? "unknown"}:${state.error ?? ""}`;
}

function extractStateVersions(details: unknown): Record<string, number> {
  if (!details || typeof details !== "object" || !("stateVersions" in details)) {
    return {};
  }
  const stateVersions = (details as { stateVersions?: unknown }).stateVersions;
  if (!stateVersions || typeof stateVersions !== "object" || Array.isArray(stateVersions)) {
    return {};
  }
  const output: Record<string, number> = {};
  for (const [key, value] of Object.entries(stateVersions)) {
    if (typeof value === "number") output[key] = value;
  }
  return output;
}

function extractHeartbeatAckAt(details: unknown): string | null {
  if (!details || typeof details !== "object" || !("serverTime" in details)) {
    return null;
  }
  const serverTime = (details as { serverTime?: unknown }).serverTime;
  return typeof serverTime === "string" && serverTime.length > 0 ? serverTime : null;
}
