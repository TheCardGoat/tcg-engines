import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { GatewayConnectionState, GatewayHandle } from "@tcg/gateway-client";
import { GatewayClientMessage } from "@tcg/protocol";

import { createLiveMatchSession } from "./live-match-session.js";
import type { LiveMatchSessionConfig } from "./live-match-session.js";
import type { LiveMatchBootstrapV1 } from "./page-data.js";

type AnyHandler = (event: string, payload: unknown) => void;
type StateHandler = (state: GatewayConnectionState) => void;

interface FakeHandleHelpers {
  /** Dispatch a server event through the stored onAny callback. */
  dispatch(event: string, payload: unknown): void;
  /** Push a connection-state change through the stored subscribeState callback. */
  pushState(state: GatewayConnectionState): void;
  /** Fire the stored onLatency callback. */
  tickLatency(ms: number): void;
  /** Fire the stored onHeartbeatAck callback. */
  heartbeatAck(payload: unknown): void;
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

/**
 * A fake GatewayHandle. Subscription methods store their callback so tests can
 * dispatch events / state changes; their unsubscribes clear the stored callback
 * so "stop unwires listeners" is observable. join / leave / emit / reconnect /
 * release are bare spies.
 */
function createFakeHandle(): FakeHandle {
  const cbs = {
    onAny: null as AnyHandler | null,
    state: null as StateHandler | null,
    latency: null as ((ms: number) => void) | null,
    heartbeatAck: null as ((payload: unknown) => void) | null,
  };
  let currentState: GatewayConnectionState = defaultConnectionState();

  const handle = {
    slug: "lorcana",
    on: vi.fn((() => () => {}) as GatewayHandle["on"]),
    onAny: vi.fn((cb: AnyHandler) => {
      cbs.onAny = cb;
      return () => {
        cbs.onAny = null;
      };
    }),
    emit: vi.fn(),
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
    onHeartbeatAck: vi.fn((cb: (payload: unknown) => void) => {
      cbs.heartbeatAck = cb;
      return () => {
        cbs.heartbeatAck = null;
      };
    }),
    join: vi.fn(),
    leave: vi.fn(),
    reconnect: vi.fn(),
    getState: vi.fn(() => currentState),
    wouldHoldEmit: vi.fn(() => false),
    subscribeState: vi.fn((cb: StateHandler) => {
      cbs.state = cb;
      return () => {
        cbs.state = null;
      };
    }),
    release: vi.fn(),
  };

  const helpers: FakeHandleHelpers = {
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

function createConfig(overrides: Partial<LiveMatchSessionConfig> = {}): {
  config: LiveMatchSessionConfig;
  handle: FakeHandle;
} {
  const handle = createFakeHandle();
  const config: LiveMatchSessionConfig = {
    handle,
    bootstrap: testBootstrap("player"),
    onGameEvent: vi.fn(),
    ...overrides,
  };
  return { config, handle };
}

function testBootstrap(role: "player" | "spectator"): LiveMatchBootstrapV1 {
  const permissions = {
    act: role === "player",
    chat: role === "player",
    propose: role === "player",
    useManualControls: false,
    concede: role === "player",
    viewReplay: true,
    spectate: role === "spectator",
    downloadReplay: true,
    forkReplay: false,
  };
  return {
    schemaVersion: 1,
    match: {
      matchId: "match_1",
      gameType: "lorcana",
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
    viewer:
      role === "player"
        ? { role, userId: "user_1", actorId: "profile_1", seat: 1, permissions }
        : { role, spectatorId: "spectator_1", permissions },
    capabilities: {
      actions: role === "player",
      chat: role === "player",
      proposals: role === "player",
      manualControls: false,
      spectating: true,
      conceding: role === "player",
      replay: false,
    },
    presence: { players: [], spectatorCount: 0 },
    history: { recentMoves: [], engineLogs: [] },
    realtime: {
      wsUrl: "ws://localhost/lorcana",
      ticket: "ticket",
      reconnectToken: "reconnect",
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      protocolVersion: 2,
    },
  };
}

describe("createLiveMatchSession", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("start identifies the game and advertises the HTTP bootstrap version", () => {
    const onDiagnostic = vi.fn();
    const { config, handle } = createConfig({
      bootstrap: testBootstrap("spectator"),
      onDiagnostic,
    });
    const session = createLiveMatchSession(config);
    session.start();

    expect(handle.join).toHaveBeenCalledWith({ gameId: "game_1", stateVersion: 0 });
    expect(onDiagnostic).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "join_game_emit",
        details: { gameId: "game_1", role: "spectator" },
      }),
    );
  });

  it("keeps a completed bootstrap read-only without joining or starting heartbeats", () => {
    vi.useFakeTimers();
    const bootstrap = testBootstrap("player");
    bootstrap.game.status = "completed";
    bootstrap.match.status = "completed";
    bootstrap.viewer.permissions.act = false;
    bootstrap.capabilities.actions = false;
    const buildHeartbeatPayload = vi.fn(() => ({ activity: { idle: false, tabVisible: true } }));
    const { config, handle } = createConfig({
      bootstrap,
      buildHeartbeatPayload,
      heartbeatIntervalMs: 100,
    });
    const session = createLiveMatchSession(config);

    session.start();
    handle.pushState({
      ...defaultConnectionState(),
      status: "connected",
      authenticated: true,
      connectionId: "conn_1",
    });
    vi.advanceTimersByTime(300);
    session.stop();

    expect(handle.join).not.toHaveBeenCalled();
    expect(handle.emit).not.toHaveBeenCalledWith("heartbeat", expect.anything());
    expect(buildHeartbeatPayload).not.toHaveBeenCalled();
    expect(handle.leave).not.toHaveBeenCalled();
  });

  it("joins a spectator session without sending match heartbeats", () => {
    vi.useFakeTimers();
    const buildHeartbeatPayload = vi.fn(() => ({ activity: { idle: false, tabVisible: true } }));
    const { config, handle } = createConfig({
      bootstrap: testBootstrap("spectator"),
      buildHeartbeatPayload,
      heartbeatIntervalMs: 100,
    });
    const session = createLiveMatchSession(config);

    session.start();
    handle.pushState({
      ...defaultConnectionState(),
      status: "connected",
      authenticated: true,
      connectionId: "conn_1",
    });
    vi.advanceTimersByTime(300);

    expect(handle.join).toHaveBeenCalledOnce();
    expect(handle.emit).not.toHaveBeenCalledWith("heartbeat", expect.anything());
    expect(buildHeartbeatPayload).not.toHaveBeenCalled();
  });

  it("start wires onAny and forwards all events to onGameEvent", () => {
    const onGameEvent = vi.fn();
    const { config, handle } = createConfig({ onGameEvent });
    createLiveMatchSession(config).start();

    handle.dispatch("state_update", { gameId: "game_1", stateVersion: 3 });

    expect(onGameEvent).toHaveBeenCalledWith("state_update", { gameId: "game_1", stateVersion: 3 });
  });

  it("wires server-event listeners before emitting the join", () => {
    const { config, handle } = createConfig();

    createLiveMatchSession(config).start();

    expect(handle.onAny.mock.invocationCallOrder[0]).toBeLessThan(
      handle.join.mock.invocationCallOrder[0]!,
    );
  });

  it("game_joined initializes the presence map from the payload players", () => {
    const { config, handle } = createConfig();
    const session = createLiveMatchSession(config);
    session.start();

    handle.dispatch("game_joined", {
      gameId: "game_1",
      role: "player",
      stateVersion: 1,
      state: {},
      players: [
        { id: "p1", connected: true },
        { id: "p2", connected: false, disconnectedAt: "2026-01-01T00:00:00.000Z" },
      ],
    });

    const state = session.getState();
    expect(state.joined).toBe(true);
    expect(state.joinedRole).toBe("player");
    expect(state.presence).toHaveLength(2);
    expect(state.presence).toContainEqual(
      expect.objectContaining({ playerId: "p1", status: "connected", connected: true }),
    );
    expect(state.presence).toContainEqual(
      expect.objectContaining({
        playerId: "p2",
        status: "disconnected",
        connected: false,
        disconnectedAt: "2026-01-01T00:00:00.000Z",
      }),
    );
  });

  it("clears joined on disconnect until the next game_joined acknowledgement", () => {
    const { config, handle } = createConfig();
    const session = createLiveMatchSession(config);
    session.start();

    handle.dispatch("game_joined", {
      gameId: "game_1",
      role: "player",
      stateVersion: 1,
      state: {},
      players: [{ id: "p1", connected: true }],
    });
    expect(session.getState().joined).toBe(true);
    expect(session.getState().joinedRole).toBe("player");

    handle.pushState({
      ...defaultConnectionState(),
      status: "disconnected",
      authenticated: false,
      connectionId: null,
      error: "transport close",
    });
    expect(session.getState().joined).toBe(false);
    expect(session.getState().joinedRole).toBeNull();

    handle.pushState({
      ...defaultConnectionState(),
      status: "connected",
      authenticated: true,
      connectionId: "conn_2",
    });
    expect(session.getState().joined).toBe(false);

    handle.dispatch("game_joined", {
      gameId: "game_1",
      role: "player",
      stateVersion: 2,
      state: {},
      players: [{ id: "p1", connected: true }],
    });
    expect(session.getState().joined).toBe(true);
  });

  it("ignores game_joined for a different gameId", () => {
    const { config, handle } = createConfig();
    const session = createLiveMatchSession(config);
    session.start();
    handle.dispatch("game_joined", {
      gameId: "other-game",
      role: "player",
      stateVersion: 1,
      players: [{ id: "p1", connected: true }],
    });
    expect(session.getState().joined).toBe(false);
    expect(session.getState().joinedRole).toBeNull();
  });

  it("keeps joined across a credential-refresh disconnect", () => {
    const { config, handle } = createConfig();
    const session = createLiveMatchSession(config);
    session.start();

    handle.dispatch("game_joined", {
      gameId: "game_1",
      role: "player",
      stateVersion: 1,
      state: {},
      players: [{ id: "p1", connected: true }],
    });
    expect(session.getState().joined).toBe(true);

    handle.pushState({
      ...defaultConnectionState(),
      status: "disconnected",
      authenticated: false,
      authStatus: "refreshing",
      authFailureReason: "scope_renewal",
      connectionId: null,
    });
    expect(session.getState().joined).toBe(true);

    handle.pushState({
      ...defaultConnectionState(),
      status: "connected",
      authenticated: true,
      authStatus: "ok",
      connectionId: "conn_2",
    });
    expect(session.getState().joined).toBe(true);
  });

  it("presence_change updates the presence map and fires onPresenceChange", () => {
    const onPresenceChange = vi.fn();
    const { config, handle } = createConfig({ onPresenceChange });
    const session = createLiveMatchSession(config);
    session.start();

    handle.dispatch("game_joined", {
      gameId: "game_1",
      role: "player",
      stateVersion: 1,
      state: {},
      players: [{ id: "p1", connected: true }],
    });

    const change = {
      gameId: "game_1",
      playerId: "p1",
      status: "disconnected" as const,
      disconnectedAt: "2026-02-02T00:00:00.000Z",
    };
    handle.dispatch("presence_change", change);

    const presence = session.getState().presence;
    expect(presence).toContainEqual(
      expect.objectContaining({
        playerId: "p1",
        status: "disconnected",
        connected: false,
        disconnectedAt: "2026-02-02T00:00:00.000Z",
      }),
    );
    expect(onPresenceChange).toHaveBeenCalledWith(
      expect.objectContaining({ playerId: "p1", status: "disconnected", raw: change }),
    );
  });

  it("player_drop_pending records a diagnostic event", () => {
    const onDiagnostic = vi.fn();
    const { config, handle } = createConfig({ onDiagnostic });
    const session = createLiveMatchSession(config);
    session.start();

    const payload = { gameId: "game_1", droppedPlayerId: "p2", reason: "timeout" };
    handle.dispatch("player_drop_pending", payload);

    expect(onDiagnostic).toHaveBeenCalledWith(
      expect.objectContaining({ type: "player_drop_pending", details: payload }),
    );
  });

  it("requestStateSyncIfDue emits request_game_state_sync with dedup", () => {
    vi.useFakeTimers();
    const { config, handle } = createConfig();
    const session = createLiveMatchSession(config);
    session.start();

    session.requestStateSyncIfDue(5);
    expect(handle.emit).toHaveBeenCalledWith("request_game_state_sync", {
      gameId: "game_1",
      stateVersion: 5,
    });

    // Within the 2s dedup window — suppressed.
    session.requestStateSyncIfDue(6);
    expect(handle.emit).toHaveBeenCalledTimes(1);

    // After the dedup window — emits again with the latest version.
    vi.advanceTimersByTime(2001);
    session.requestStateSyncIfDue(7);
    expect(handle.emit).toHaveBeenCalledTimes(2);
    expect(handle.emit).toHaveBeenLastCalledWith("request_game_state_sync", {
      gameId: "game_1",
      stateVersion: 7,
    });
  });

  it("requestStateSyncIfDue no-ops when authority is client", () => {
    const { config, handle } = createConfig({ authority: "client" });
    const session = createLiveMatchSession(config);
    session.start();

    session.requestStateSyncIfDue(5);

    expect(handle.emit).not.toHaveBeenCalled();
  });

  it("subscribeState fires immediately with current state and on changes", () => {
    const { config, handle } = createConfig();
    const session = createLiveMatchSession(config);
    session.start();

    const cb = vi.fn();
    const unsub = session.subscribeState(cb);

    // Immediate fire with the current (idle) state.
    expect(cb).toHaveBeenCalledTimes(1);
    expect(cb).toHaveBeenLastCalledWith(expect.objectContaining({ status: "idle" }));

    handle.pushState({
      ...defaultConnectionState(),
      status: "connected",
      authenticated: true,
      connectionId: "conn_1",
    });

    expect(cb).toHaveBeenCalledTimes(2);
    expect(cb).toHaveBeenLastCalledWith(
      expect.objectContaining({ status: "connected", authenticated: true, connectionId: "conn_1" }),
    );

    // Unsubscribing stops further notifications.
    unsub();
    handle.pushState({ ...defaultConnectionState(), status: "disconnected" });
    expect(cb).toHaveBeenCalledTimes(2);
  });

  it("onLatency updates latencyMs and ping/pong timestamps in state and records a diagnostic", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-01T12:00:00.000Z"));
    const onDiagnostic = vi.fn();
    const { config, handle } = createConfig({ onDiagnostic });
    const session = createLiveMatchSession(config);
    session.start();

    handle.tickLatency(123);

    expect(session.getState()).toMatchObject({
      latencyMs: 123,
      lastPingAt: "2026-06-01T11:59:59.877Z",
      lastPongAt: "2026-06-01T12:00:00.000Z",
    });
    expect(onDiagnostic).toHaveBeenCalledWith(
      expect.objectContaining({ type: "latency", details: { latencyMs: 123 } }),
    );
  });

  it("session state mirrors error, reconnectAttempt, and authFailureReason from the handle", () => {
    const { config, handle } = createConfig();
    const session = createLiveMatchSession(config);
    session.start();

    // Initial state — no error, zero reconnect attempts.
    expect(session.getState().error).toBeNull();
    expect(session.getState().reconnectAttempt).toBe(0);
    expect(session.getState().authFailureReason).toBeNull();

    const cb = vi.fn();
    session.subscribeState(cb);

    handle.pushState({
      ...defaultConnectionState(),
      status: "reconnecting",
      error: "transport: auth timeout",
      reconnectAttempt: 3,
      authStatus: "failed",
      authFailureReason: "refresh_exhausted",
    });

    const last = cb.mock.calls.at(-1)?.[0];
    expect(last).toMatchObject({
      status: "reconnecting",
      error: "transport: auth timeout",
      reconnectAttempt: 3,
      authStatus: "failed",
      authFailureReason: "refresh_exhausted",
    });
    expect(session.getState().error).toBe("transport: auth timeout");
    expect(session.getState().reconnectAttempt).toBe(3);
    expect(session.getState().authFailureReason).toBe("refresh_exhausted");

    // A subsequent state push that clears the error mirrors null back.
    handle.pushState({
      ...defaultConnectionState(),
      status: "connected",
      authenticated: true,
      error: null,
      reconnectAttempt: 0,
    });
    expect(session.getState().error).toBeNull();
    expect(session.getState().reconnectAttempt).toBe(0);
    expect(session.getState().authFailureReason).toBeNull();
  });

  it("stop calls handle.leave and unwires all listeners", () => {
    const onGameEvent = vi.fn();
    const { config, handle } = createConfig({ onGameEvent });
    const session = createLiveMatchSession(config);
    session.start();

    handle.dispatch("state_update", { gameId: "game_1" });
    expect(onGameEvent).toHaveBeenCalledTimes(1);

    session.stop();
    expect(handle.leave).toHaveBeenCalledTimes(1);

    // After stop, dispatching an event no longer reaches onGameEvent.
    handle.dispatch("state_update", { gameId: "game_1" });
    expect(onGameEvent).toHaveBeenCalledTimes(1);

    expect(session.getState().joined).toBe(false);
  });

  it("start and stop are idempotent", () => {
    const { config, handle } = createConfig();
    const session = createLiveMatchSession(config);

    session.start();
    session.start();
    expect(handle.join).toHaveBeenCalledTimes(1);

    session.stop();
    session.stop();
    expect(handle.leave).toHaveBeenCalledTimes(1);
  });

  it("diagnostic events are capped at 20 (FIFO)", () => {
    const onDiagnostic = vi.fn();
    const { config, handle } = createConfig({ onDiagnostic });
    const session = createLiveMatchSession(config);
    session.start();

    // Record 25 latency diagnostics.
    for (let i = 0; i < 25; i++) handle.tickLatency(i);

    // onDiagnostic surfaces every event; the retained store is capped.
    expect(onDiagnostic).toHaveBeenCalledTimes(26);

    const events = session.getState().events;
    expect(events).toHaveLength(20);
    // FIFO: the oldest 5 (latency 0..4) are dropped; 5..24 remain.
    expect(events[0]?.details).toEqual({ latencyMs: 5 });
    expect(events[events.length - 1]?.details).toEqual({ latencyMs: 24 });
  });

  it("heartbeat emits at the configured interval when authenticated", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-01T12:00:00.000Z"));
    const buildHeartbeatPayload = vi.fn(() => ({ activity: { idle: false, tabVisible: true } }));
    const { config, handle } = createConfig({
      buildHeartbeatPayload,
      heartbeatIntervalMs: 100,
    });
    const session = createLiveMatchSession(config);
    session.start();

    // The loop requires an authenticated handle — push it into the authed state.
    handle.pushState({
      ...defaultConnectionState(),
      status: "connected",
      authenticated: true,
      connectionId: "conn_1",
    });

    // Before the interval fires, no heartbeat emit.
    expect(handle.emit).not.toHaveBeenCalledWith("heartbeat", expect.anything());

    vi.advanceTimersByTime(100);
    expect(handle.emit).toHaveBeenCalledWith("heartbeat", {
      activity: { idle: false, tabVisible: true },
      clientSentAt: new Date("2026-06-01T12:00:00.100Z").getTime(),
      correlationId: expect.any(String),
    });
    expect(buildHeartbeatPayload).toHaveBeenCalledTimes(1);
    expect(session.getState().lastHeartbeatSentAt).toBe("2026-06-01T12:00:00.100Z");

    const firstProbe = handle.emit.mock.calls[0]?.[1] as {
      clientSentAt: number;
      correlationId: string;
    };
    vi.advanceTimersByTime(25);
    handle.heartbeatAck({
      serverTime: "2026-06-01T12:00:00.125Z",
      stateVersions: {},
      clientSentAt: firstProbe.clientSentAt,
      correlationId: firstProbe.correlationId,
    });

    // Subsequent heartbeats report the previous browser-observed full-path RTT.
    vi.advanceTimersByTime(75);
    expect(handle.emit).toHaveBeenCalledTimes(2);
    expect(handle.emit).toHaveBeenLastCalledWith(
      "heartbeat",
      expect.objectContaining({
        previousCorrelationId: firstProbe.correlationId,
        previousRoundTripMs: 25,
      }),
    );
    expect(buildHeartbeatPayload).toHaveBeenCalledTimes(2);
    // Validate real session output at the same strict boundary as gateway ingress,
    // including the second probe's previous-round-trip telemetry fields.
    for (const [type, payload] of handle.emit.mock.calls) {
      expect(GatewayClientMessage.parse({ ...payload, type })).toEqual({ ...payload, type });
    }
    expect(session.getState().lastHeartbeatSentAt).toBe("2026-06-01T12:00:00.200Z");

    vi.advanceTimersByTime(100);
    expect(handle.emit).toHaveBeenCalledTimes(3);
    expect(handle.emit).toHaveBeenLastCalledWith(
      "heartbeat",
      expect.not.objectContaining({
        previousCorrelationId: expect.anything(),
        previousRoundTripMs: expect.anything(),
      }),
    );
  });

  it("heartbeat_ack updates lastHeartbeatAckAt and records a diagnostic", () => {
    const onDiagnostic = vi.fn();
    const { config, handle } = createConfig({ onDiagnostic });
    const session = createLiveMatchSession(config);
    session.start();

    handle.heartbeatAck({
      serverTime: "2026-06-01T12:00:01.000Z",
      stateVersions: { game_1: 7 },
    });

    expect(session.getState().lastHeartbeatAckAt).toBe("2026-06-01T12:00:01.000Z");
    expect(onDiagnostic).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "heartbeat_ack",
        details: expect.objectContaining({
          serverTime: "2026-06-01T12:00:01.000Z",
          stateVersions: { game_1: 7 },
        }),
      }),
    );
  });

  it("heartbeat does not emit when not authenticated", () => {
    vi.useFakeTimers();
    const buildHeartbeatPayload = vi.fn();
    const { config, handle } = createConfig({
      buildHeartbeatPayload,
      heartbeatIntervalMs: 100,
    });
    const session = createLiveMatchSession(config);
    session.start();

    // Connected but NOT authenticated — heartbeat must skip.
    handle.pushState({
      ...defaultConnectionState(),
      status: "connected",
      authenticated: false,
      connectionId: "conn_2",
    });

    vi.advanceTimersByTime(300);

    expect(buildHeartbeatPayload).not.toHaveBeenCalled();
    expect(handle.emit).not.toHaveBeenCalledWith("heartbeat", expect.anything());
  });

  it("stops sending match heartbeats after the current game ends", () => {
    vi.useFakeTimers();
    const { config, handle } = createConfig({
      buildHeartbeatPayload: () => ({ activity: { idle: false, tabVisible: true } }),
      heartbeatIntervalMs: 100,
    });
    const session = createLiveMatchSession(config);
    session.start();
    handle.pushState({
      ...defaultConnectionState(),
      status: "connected",
      authenticated: true,
      connectionId: "conn_1",
    });

    vi.advanceTimersByTime(100);
    expect(handle.emit).toHaveBeenCalledTimes(1);

    handle.dispatch("game_ended", { gameId: "game_1" });
    vi.advanceTimersByTime(300);

    expect(handle.emit).toHaveBeenCalledTimes(1);
  });
});
