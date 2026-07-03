import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type { GatewayConnectionState, GatewayHandle } from "@tcg/gateway-client";

import { createLiveMatchSession } from "./live-match-session.js";
import type { LiveMatchSessionConfig } from "./live-match-session.js";

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
    gameId: "game_1",
    matchId: "match_1",
    resolveRole: () => "player",
    resolveGameProfileId: () => "profile_1",
    onGameEvent: vi.fn(),
    ...overrides,
  };
  return { config, handle };
}

describe("createLiveMatchSession", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("start calls handle.join with resolved role and gameProfileId", () => {
    const { config, handle } = createConfig({
      resolveRole: () => "spectator",
      resolveGameProfileId: () => "profile_7",
    });
    const session = createLiveMatchSession(config);
    session.start();

    expect(handle.join).toHaveBeenCalledWith({
      gameId: "game_1",
      role: "spectator",
      gameProfileId: "profile_7",
    });
  });

  it("start wires onAny and forwards all events to onGameEvent", () => {
    const onGameEvent = vi.fn();
    const { config, handle } = createConfig({ onGameEvent });
    createLiveMatchSession(config).start();

    handle.dispatch("state_update", { gameId: "game_1", stateVersion: 3 });

    expect(onGameEvent).toHaveBeenCalledWith("state_update", { gameId: "game_1", stateVersion: 3 });
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

  it("onLatency updates latencyMs in state and records a diagnostic", () => {
    const onDiagnostic = vi.fn();
    const { config, handle } = createConfig({ onDiagnostic });
    const session = createLiveMatchSession(config);
    session.start();

    handle.tickLatency(123);

    expect(session.getState().latencyMs).toBe(123);
    expect(onDiagnostic).toHaveBeenCalledWith(
      expect.objectContaining({ type: "latency", details: { latencyMs: 123 } }),
    );
  });

  it("session state mirrors error and reconnectAttempt from the handle", () => {
    const { config, handle } = createConfig();
    const session = createLiveMatchSession(config);
    session.start();

    // Initial state — no error, zero reconnect attempts.
    expect(session.getState().error).toBeNull();
    expect(session.getState().reconnectAttempt).toBe(0);

    const cb = vi.fn();
    session.subscribeState(cb);

    handle.pushState({
      ...defaultConnectionState(),
      status: "reconnecting",
      error: "transport: auth timeout",
      reconnectAttempt: 3,
    });

    const last = cb.mock.calls.at(-1)?.[0];
    expect(last).toMatchObject({
      status: "reconnecting",
      error: "transport: auth timeout",
      reconnectAttempt: 3,
    });
    expect(session.getState().error).toBe("transport: auth timeout");
    expect(session.getState().reconnectAttempt).toBe(3);

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
    expect(onDiagnostic).toHaveBeenCalledTimes(25);

    const events = session.getState().events;
    expect(events).toHaveLength(20);
    // FIFO: the oldest 5 (latency 0..4) are dropped; 5..24 remain.
    expect(events[0]?.details).toEqual({ latencyMs: 5 });
    expect(events[events.length - 1]?.details).toEqual({ latencyMs: 24 });
  });

  it("heartbeat emits at the configured interval when authenticated", () => {
    vi.useFakeTimers();
    const buildHeartbeatPayload = vi.fn(() => ({ activity: { idle: false } }));
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
    expect(handle.emit).toHaveBeenCalledWith("heartbeat", { activity: { idle: false } });
    expect(buildHeartbeatPayload).toHaveBeenCalledTimes(1);

    // Subsequent intervals continue to emit.
    vi.advanceTimersByTime(100);
    expect(handle.emit).toHaveBeenCalledTimes(2);
    expect(buildHeartbeatPayload).toHaveBeenCalledTimes(2);
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
});
