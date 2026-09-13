// @vitest-environment jsdom

import { act, cleanup, render, screen } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { GatewayConnectionState, GatewayHandle } from "@tcg/gateway-client";
import type { HeartbeatAckPayload } from "@tcg/protocol";
import type { LiveMatchBootstrapV1 } from "@tcg/game-page-contract";

import {
  SimulatorLiveConnectionProvider,
  useSimulatorLiveConnection,
  type SimulatorConnectionTelemetryEvent,
} from "./live-connection-context";

const logBrowserInfoMock = vi.hoisted(() => vi.fn());
vi.mock("../../observability/browser", () => ({
  logBrowserInfo: logBrowserInfoMock,
}));

type AnyHandler = (event: string, payload: unknown) => void;
type StateHandler = (state: GatewayConnectionState) => void;
type TestSpy = ReturnType<typeof vi.fn>;

interface FakeHandleSpies {
  emit: TestSpy;
  join: TestSpy;
  leave: TestSpy;
}

interface FakeHandleHelpers {
  spies: FakeHandleSpies;
  dispatch(event: string, payload: unknown): void;
  pushState(state: GatewayConnectionState): void;
  tickLatency(ms: number): void;
  heartbeatAck(payload: HeartbeatAckPayload): void;
}

type FakeHandle = GatewayHandle & FakeHandleHelpers;

function defaultConnectionState(): GatewayConnectionState {
  return {
    status: "idle",
    authenticated: false,
    authMethod: null,
    connectionId: null,
    latencyMs: null,
    reconnectAttempt: 0,
    error: null,
    authStatus: "ok",
    authFailureReason: null,
  };
}

function createFakeHandle(): FakeHandle {
  const cbs = {
    onAny: null as AnyHandler | null,
    state: null as StateHandler | null,
    latency: null as ((ms: number) => void) | null,
    heartbeatAck: null as ((payload: HeartbeatAckPayload) => void) | null,
  };
  let currentState: GatewayConnectionState = defaultConnectionState();
  const emit = vi.fn();
  const join = vi.fn();
  const leave = vi.fn();

  const handle = {
    slug: "cyberpunk",
    on: vi.fn((() => () => {}) as GatewayHandle["on"]),
    onAny: vi.fn((cb: AnyHandler) => {
      cbs.onAny = cb;
      return () => {
        cbs.onAny = null;
      };
    }),
    emit,
    onConnected: vi.fn(() => () => {}),
    onWelcome: vi.fn(() => () => {}),
    onDisconnected: vi.fn(() => () => {}),
    onReconnect: vi.fn(() => () => {}),
    onAuthenticated: vi.fn(() => () => {}),
    onLatency: vi.fn((cb: (ms: number) => void) => {
      cbs.latency = cb;
      return () => {
        cbs.latency = null;
      };
    }),
    onHeartbeatAck: vi.fn((cb: (payload: HeartbeatAckPayload) => void) => {
      cbs.heartbeatAck = cb;
      return () => {
        cbs.heartbeatAck = null;
      };
    }),
    join,
    leave,
    reconnect: vi.fn(),
    getState: vi.fn(() => currentState),
    subscribeState: vi.fn((cb: StateHandler) => {
      cbs.state = cb;
      return () => {
        cbs.state = null;
      };
    }),
    release: vi.fn(),
  };

  const helpers: FakeHandleHelpers = {
    spies: { emit, join, leave },
    dispatch: (event, payload) => cbs.onAny?.(event, payload),
    pushState: (state) => {
      currentState = state;
      cbs.state?.(state);
    },
    tickLatency: (ms) => cbs.latency?.(ms),
    heartbeatAck: (payload) => cbs.heartbeatAck?.(payload),
  };

  return { ...handle, ...helpers } as unknown as FakeHandle;
}

function renderProvider(
  handle: GatewayHandle | null,
  options: {
    telemetrySink?: (event: SimulatorConnectionTelemetryEvent) => void;
    buildHeartbeatPayload?: () => { activity: { idle: boolean; tabVisible: boolean } };
    heartbeatIntervalMs?: number;
  } = {},
) {
  return render(
    createElement(SimulatorLiveConnectionProvider, {
      handle,
      bootstrap: TEST_BOOTSTRAP,
      onGameEvent: vi.fn(),
      telemetrySink: options.telemetrySink,
      buildHeartbeatPayload: options.buildHeartbeatPayload,
      heartbeatIntervalMs: options.heartbeatIntervalMs,
      children: createElement(ConnectionProbe),
    }),
  );
}

const TEST_BOOTSTRAP = {
  schemaVersion: 1,
  match: {
    matchId: "match_1",
    gameType: "gundam",
    format: "best_of_1",
    matchType: "casual",
    status: "in_progress",
    participants: [{ id: "profile_1", seat: 1, displayName: "Player" }],
    gameIds: ["game_1"],
  },
  game: {
    gameId: "game_1",
    gameNumber: 1,
    status: "in_progress",
    authority: "server",
    stateVersion: 0,
    view: {},
  },
  viewer: {
    role: "player",
    userId: "user_1",
    actorId: "profile_1",
    seat: 1,
    permissions: {
      act: true,
      chat: true,
      propose: true,
      useManualControls: false,
      concede: true,
      viewReplay: true,
      spectate: false,
      downloadReplay: true,
      forkReplay: false,
    },
  },
  capabilities: {
    actions: true,
    chat: true,
    proposals: true,
    manualControls: false,
    spectating: true,
    conceding: true,
    replay: false,
  },
  presence: { players: [], spectatorCount: 0 },
  history: { recentMoves: [], engineLogs: [] },
  realtime: {
    wsUrl: "ws://localhost/gundam",
    ticket: "ticket",
    reconnectToken: "reconnect",
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    protocolVersion: 2,
  },
} satisfies LiveMatchBootstrapV1;

function ConnectionProbe() {
  const connection = useSimulatorLiveConnection();
  return createElement(
    "div",
    null,
    createElement("span", { "data-testid": "status" }, connection.status),
    createElement("span", { "data-testid": "auth-status" }, connection.authStatus),
    createElement("span", { "data-testid": "latency" }, connection.latencyMs ?? "none"),
    createElement(
      "span",
      { "data-testid": "heartbeat-ack" },
      connection.lastHeartbeatAckAt ?? "none",
    ),
  );
}

describe("SimulatorLiveConnectionProvider", () => {
  beforeEach(() => {
    vi.useRealTimers();
    logBrowserInfoMock.mockReset();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("initializes from a GatewayHandle and exposes subscription updates through the hook", () => {
    const handle = createFakeHandle();
    const { join } = handle.spies;
    renderProvider(handle);

    expect(join).toHaveBeenCalledWith({
      gameId: "game_1",
      stateVersion: 0,
    });
    expect(screen.getByTestId("status").textContent).toBe("idle");

    act(() => {
      handle.pushState({
        ...defaultConnectionState(),
        status: "connected",
        authenticated: true,
        connectionId: "conn_1",
      });
    });

    expect(screen.getByTestId("status").textContent).toBe("connected");
    expect(screen.getByTestId("auth-status").textContent).toBe("ok");
  });

  it("keeps one join across HTTP snapshots and uses the latest event callback", () => {
    const handle = createFakeHandle();
    const first = vi.fn();
    const latest = vi.fn();
    const page = render(
      <SimulatorLiveConnectionProvider
        handle={handle}
        bootstrap={TEST_BOOTSTRAP}
        onGameEvent={first}
      >
        <ConnectionProbe />
      </SimulatorLiveConnectionProvider>,
    );
    page.rerender(
      <SimulatorLiveConnectionProvider
        handle={handle}
        bootstrap={{ ...TEST_BOOTSTRAP, game: { ...TEST_BOOTSTRAP.game, stateVersion: 4 } }}
        onGameEvent={latest}
      >
        <ConnectionProbe />
      </SimulatorLiveConnectionProvider>,
    );
    act(() => handle.dispatch("match_state", { matchId: "match_1" }));
    expect(handle.spies.join).toHaveBeenCalledTimes(1);
    expect(handle.spies.leave).not.toHaveBeenCalled();
    expect(first).not.toHaveBeenCalled();
    expect(latest).toHaveBeenCalledWith("match_state", { matchId: "match_1" });
  });

  it("emits sanitized telemetry for status, latency, heartbeat, reconnect, and auth failure events", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-01T12:00:00.000Z"));
    const handle = createFakeHandle();
    const telemetry: SimulatorConnectionTelemetryEvent[] = [];
    renderProvider(handle, { telemetrySink: (event) => telemetry.push(event) });

    act(() => {
      handle.pushState({
        ...defaultConnectionState(),
        status: "connected",
        authenticated: true,
        connectionId: "conn_1",
      });
    });
    act(() => {
      handle.tickLatency(25);
    });
    act(() => {
      handle.heartbeatAck({
        serverTime: "2026-06-01T12:00:01.000Z",
        stateVersions: { game_1: 9 },
      });
    });
    act(() => {
      handle.pushState({
        ...defaultConnectionState(),
        status: "reconnecting",
        reconnectAttempt: 2,
        error: "network lost",
      });
    });
    act(() => {
      handle.pushState({
        ...defaultConnectionState(),
        status: "disconnected",
        authStatus: "failed",
        authFailureReason: "refresh_exhausted",
        error: "Credential refresh did not restore authenticated access.",
      });
    });

    expect(telemetry).toContainEqual(
      expect.objectContaining({
        type: "simulator_connection_status_changed",
        status: "connected",
        authenticated: true,
      }),
    );
    expect(telemetry).toContainEqual(
      expect.objectContaining({
        type: "simulator_connection_latency_sample",
        latencyMs: 25,
        lastPongAt: "2026-06-01T12:00:00.000Z",
      }),
    );
    expect(telemetry).toContainEqual(
      expect.objectContaining({
        type: "simulator_connection_heartbeat_ack",
        lastHeartbeatAckAt: "2026-06-01T12:00:01.000Z",
        stateVersions: { game_1: 9 },
      }),
    );
    expect(telemetry).toContainEqual(
      expect.objectContaining({
        type: "simulator_connection_reconnect_attempt",
        reconnectAttempt: 2,
      }),
    );
    expect(telemetry).toContainEqual(
      expect.objectContaining({
        type: "simulator_connection_auth_failure",
        authFailureReason: "refresh_exhausted",
      }),
    );
    expect(logBrowserInfoMock).toHaveBeenCalledWith(
      "websocket.gateway_round_trip",
      expect.objectContaining({
        "socketio.namespace": "cyberpunk",
        "socketio.round_trip_ms": 25,
      }),
    );
  });

  it("exports full-path RTT from the simulator that owns the heartbeat", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-01T12:00:00.000Z"));
    const handle = createFakeHandle();
    renderProvider(handle, {
      buildHeartbeatPayload: () => ({ activity: { idle: false, tabVisible: true } }),
      heartbeatIntervalMs: 100,
    });

    act(() => {
      handle.pushState({
        ...defaultConnectionState(),
        status: "connected",
        authenticated: true,
        connectionId: "conn_1",
      });
      vi.advanceTimersByTime(100);
    });
    const probe = handle.spies.emit.mock.calls[0]?.[1] as {
      correlationId: string;
      clientSentAt: number;
    };
    act(() => {
      vi.advanceTimersByTime(25);
      handle.heartbeatAck({
        serverTime: "2026-06-01T12:00:00.125Z",
        stateVersions: {},
        correlationId: probe.correlationId,
        clientSentAt: probe.clientSentAt,
      });
    });

    expect(logBrowserInfoMock).toHaveBeenCalledWith("websocket.game_round_trip", {
      "socketio.namespace": "cyberpunk",
      "socketio.round_trip_ms": 25,
      "gateway.request_id": probe.correlationId,
    });
  });

  it("cleans up session listeners and heartbeat timers on unmount", () => {
    vi.useFakeTimers();
    const handle = createFakeHandle();
    const { emit, leave } = handle.spies;
    const buildHeartbeatPayload = vi.fn(() => ({ activity: { idle: false, tabVisible: true } }));
    const view = renderProvider(handle, {
      buildHeartbeatPayload,
      heartbeatIntervalMs: 100,
    });

    act(() => {
      handle.pushState({
        ...defaultConnectionState(),
        status: "connected",
        authenticated: true,
        connectionId: "conn_1",
      });
    });
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(emit).toHaveBeenCalledWith(
      "heartbeat",
      expect.objectContaining({ activity: { idle: false, tabVisible: true } }),
    );

    view.unmount();
    expect(leave).toHaveBeenCalledTimes(1);

    act(() => {
      vi.advanceTimersByTime(300);
      handle.pushState({
        ...defaultConnectionState(),
        status: "disconnected",
      });
      handle.tickLatency(55);
    });

    expect(buildHeartbeatPayload).toHaveBeenCalledTimes(1);
    expect(emit).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId("status")).toBeNull();
  });
});
