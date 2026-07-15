import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const ioMock = vi.hoisted(() => vi.fn());

vi.mock("socket.io-client", () => ({
  io: ioMock,
}));

vi.mock("socket.io-msgpack-parser", () => ({
  __esModule: true,
  encode: () => new Uint8Array(),
  decode: () => undefined,
}));

import { createGatewayConnectionManager } from "./manager.js";
import type { CredentialsController, GatewayCredentials } from "./types.js";

type Handler = (...args: unknown[]) => void;

interface FakeSocket {
  connected: boolean;
  id: string | undefined;
  on: ReturnType<typeof vi.fn>;
  off: ReturnType<typeof vi.fn>;
  onAny: ReturnType<typeof vi.fn>;
  offAny: ReturnType<typeof vi.fn>;
  emit: ReturnType<typeof vi.fn>;
  connect: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
  removeAllListeners: ReturnType<typeof vi.fn>;
  io: {
    on: ReturnType<typeof vi.fn>;
    off: ReturnType<typeof vi.fn>;
  };
  /** Test helper: dispatch a socket-level event to registered listeners. */
  __emit(event: string, ...args: unknown[]): void;
  /** Test helper: dispatch a manager-level event (reconnect_attempt / reconnect). */
  __managerEmit(event: string, ...args: unknown[]): void;
}

function createFakeSocket(id = "conn_1"): FakeSocket {
  const listeners = new Map<string, Set<Handler>>();
  const anyListeners = new Set<Handler>();
  const managerListeners = new Map<string, Set<Handler>>();

  const add = (map: Map<string, Set<Handler>>, event: string, h: Handler): void => {
    let set = map.get(event);
    if (!set) {
      set = new Set();
      map.set(event, set);
    }
    set.add(h);
  };

  const socket: FakeSocket = {
    connected: false,
    id,
    on: vi.fn((event: string, h: Handler) => add(listeners, event, h)),
    off: vi.fn((event: string, h: Handler) => {
      listeners.get(event)?.delete(h);
    }),
    onAny: vi.fn((h: Handler) => {
      anyListeners.add(h);
    }),
    offAny: vi.fn((h: Handler) => {
      anyListeners.delete(h);
    }),
    emit: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(() => {
      socket.connected = false;
    }),
    removeAllListeners: vi.fn(() => {
      listeners.clear();
      anyListeners.clear();
    }),
    io: {
      on: vi.fn((event: string, h: Handler) => add(managerListeners, event, h)),
      off: vi.fn((event: string, h: Handler) => {
        managerListeners.get(event)?.delete(h);
      }),
    },
    __emit(event: string, ...args: unknown[]): void {
      if (event === "connect") socket.connected = true;
      if (event === "disconnect") socket.connected = false;
      for (const h of listeners.get(event) ?? []) h(...args);
      for (const h of anyListeners) h(event, ...args);
    },
    __managerEmit(event: string, ...args: unknown[]): void {
      for (const h of managerListeners.get(event) ?? []) h(...args);
    },
  };

  return socket;
}

interface AuthOpts {
  auth: (cb: (data: unknown) => void) => void;
}

function installLocalStorageStub(): Map<string, string> {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: vi.fn((key: string) => store.get(key) ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store.set(key, value);
      }),
      removeItem: vi.fn((key: string) => {
        store.delete(key);
      }),
    },
  });
  return store;
}

function authOpts(): AuthOpts {
  const opts = ioMock.mock.calls[0]?.[1];
  return opts as AuthOpts;
}

describe("gateway-client manager", () => {
  let fakes: FakeSocket[];
  let ioUrls: string[];

  beforeEach(() => {
    ioMock.mockReset();
    fakes = [];
    ioUrls = [];
    ioMock.mockImplementation((url: string) => {
      ioUrls.push(url);
      const fake = createFakeSocket(`conn_${fakes.length + 1}`);
      fakes.push(fake);
      return fake;
    });
  });

  it("builds the socket with the canonical wire contract", () => {
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online/socket.io/",
    });
    mgr.acquire("lorcana");

    expect(ioUrls[0]).toBe("wss://gateway.tcg.online/lorcana");
    const opts = ioMock.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(opts.path).toBe("/socket.io/");
    expect(opts.transports).toEqual(["websocket"]);
    expect(opts.autoConnect).toBe(false);
    expect(opts.reconnection).toBe(true);
    expect(opts.reconnectionAttempts).toBe(Number.POSITIVE_INFINITY);
    expect(opts.reconnectionDelay).toBe(1_000);
    expect(opts.reconnectionDelayMax).toBe(30_000);
    expect(opts.withCredentials).toBe(true);
    expect(opts.parser).toBeDefined();
    expect(typeof opts.auth).toBe("function");
  });

  it("reuses one socket for repeated acquires of the same slug and connects once", () => {
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
    });
    const h1 = mgr.acquire("lorcana");

    expect(ioMock).toHaveBeenCalledTimes(1);
    expect(fakes[0].connect).toHaveBeenCalledTimes(1);

    const h2 = mgr.acquire("lorcana");
    expect(ioMock).toHaveBeenCalledTimes(1);
    expect(fakes[0].connect).toHaveBeenCalledTimes(1);

    h1.release();
    h2.release();
  });

  it("throws when a second acquire supplies a different CredentialsController", () => {
    const mgr = createGatewayConnectionManager({ gatewayOrigin: "wss://gateway.tcg.online" });
    mgr.acquire("lorcana", {
      credentials: { get: () => ({}), refresh: vi.fn().mockResolvedValue({}) },
    });
    expect(() =>
      mgr.acquire("lorcana", {
        credentials: { get: () => ({}), refresh: vi.fn().mockResolvedValue({}) },
      }),
    ).toThrow(/different CredentialsController is already installed/i);
  });

  it("creates separate sockets for different slugs", () => {
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
    });
    mgr.acquire("lorcana");
    mgr.acquire("cyberpunk");

    expect(ioMock).toHaveBeenCalledTimes(2);
    expect(ioUrls[0]).toBe("wss://gateway.tcg.online/lorcana");
    expect(ioUrls[1]).toBe("wss://gateway.tcg.online/cyberpunk");
  });

  it("clears the single-use ticket after the first handshake", () => {
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
    });
    mgr.setCredentials("lorcana", { ticket: "ticket_1", token: "jwt_1" });
    mgr.acquire("lorcana");

    const received: unknown[] = [];
    authOpts().auth((d) => received.push(d));
    authOpts().auth((d) => received.push(d));

    expect(received).toEqual([{ ticket: "ticket_1", token: "jwt_1" }, { token: "jwt_1" }]);
  });

  it("clears a controller-supplied ticket even when get() keeps returning it", () => {
    const creds = { ticket: "ticket_1", token: "jwt_1" };
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
    });
    mgr.acquire("lorcana", {
      credentials: { get: () => creds, refresh: vi.fn().mockResolvedValue({}) },
    });

    const received: unknown[] = [];
    authOpts().auth((d) => received.push(d));
    authOpts().auth((d) => received.push(d));

    // First handshake includes the ticket; the library consumed it, so the
    // second handshake omits it even though get() still returns it.
    expect(received).toEqual([{ ticket: "ticket_1", token: "jwt_1" }, { token: "jwt_1" }]);
  });

  it("clears token/requireAuth when setCredentials passes null (sign-out)", () => {
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
    });
    mgr.setCredentials("lorcana", { token: "jwt_1", requireAuth: true });
    mgr.acquire("lorcana");

    const received: unknown[] = [];
    authOpts().auth((d) => received.push(d));
    // First handshake carries the token + requireAuth.
    expect(received[0]).toEqual({ token: "jwt_1", requireAuth: true });

    // Sign-out: explicitly clear both. `undefined` would be a no-op; `null` clears.
    mgr.setCredentials("lorcana", { token: null, requireAuth: null });

    received.length = 0;
    authOpts().auth((d) => received.push(d));
    expect(received[0]).toEqual({});
  });

  it("clears requireAuth when the credentials controller returns false on sign-out", () => {
    let signedIn = true;
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
    });
    mgr.setCredentials("lorcana", { requireAuth: true });
    mgr.acquire("lorcana", {
      credentials: {
        get: () => ({ requireAuth: signedIn }),
        refresh: vi.fn().mockResolvedValue({}),
      },
    });

    const received: unknown[] = [];
    authOpts().auth((d) => received.push(d));
    expect(received[0]).toEqual({ requireAuth: true });

    signedIn = false; // sign-out: controller now reports no auth requirement
    received.length = 0;
    authOpts().auth((d) => received.push(d));
    expect(received[0]).toEqual({});
  });

  it("blocks connect and emits analytics when requireAuth is set without credentials", () => {
    const onAnalytics = vi.fn();
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
      onAnalytics,
    });
    mgr.setCredentials("lorcana", { requireAuth: true });
    mgr.acquire("lorcana");

    expect(fakes[0].connect).not.toHaveBeenCalled();
    expect(onAnalytics).toHaveBeenCalledWith(
      "ws_auth_policy_violation",
      expect.objectContaining({ reason: "missing_credentials", namespace: "/lorcana" }),
    );
    expect(mgr.getState("lorcana").status).toBe("disconnected");
    expect(mgr.getState("lorcana").authFailureReason).toBe("missing_credentials");
  });

  it("fresh required credentials reconnect an already-open anonymous socket", () => {
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
    });
    const h = mgr.acquire("lorcana");
    fakes[0].__emit("connect");
    fakes[0].__emit("welcome", {
      authenticated: false,
      authenticationMethod: "anonymous",
      connectionId: "anon-1",
    });
    expect(mgr.getState("lorcana")).toMatchObject({
      status: "connected",
      authenticated: false,
      authMethod: "anonymous",
    });

    fakes[0].connect.mockClear();
    fakes[0].disconnect.mockClear();
    mgr.setCredentials("lorcana", {
      ticket: "fresh_ticket",
      token: "fresh_jwt",
      requireAuth: true,
    });

    expect(fakes[0].disconnect).toHaveBeenCalledTimes(1);
    expect(fakes[0].connect).toHaveBeenCalledTimes(1);
    expect(mgr.getState("lorcana")).toMatchObject({
      status: "connecting",
      authFailureReason: null,
    });

    const received: unknown[] = [];
    authOpts().auth((d) => received.push(d));
    expect(received[0]).toEqual({
      ticket: "fresh_ticket",
      token: "fresh_jwt",
      requireAuth: true,
    });

    h.release();
  });

  it("updates state on connect/welcome and resets auth on disconnect", () => {
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
    });
    mgr.setCredentials("lorcana", { ticket: "t1", token: "j1" });
    mgr.acquire("lorcana");

    expect(mgr.getState("lorcana").status).toBe("connecting");

    fakes[0].__emit("connect");
    expect(mgr.getState("lorcana")).toMatchObject({ status: "connected", connectionId: "conn_1" });

    fakes[0].__emit("welcome", {
      authenticated: true,
      authenticationMethod: "jwt",
      connectionId: "c-welcome",
    });
    expect(mgr.getState("lorcana")).toMatchObject({
      authenticated: true,
      authMethod: "jwt",
      connectionId: "c-welcome",
    });

    fakes[0].__emit("disconnect", "transport close");
    expect(mgr.getState("lorcana")).toMatchObject({
      status: "disconnected",
      authenticated: false,
      authMethod: null,
      error: "transport close",
    });
  });

  it("falls back to authenticated/anonymous authMethod when the server omits it", () => {
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
    });
    mgr.setCredentials("lorcana", { token: "j1" });
    mgr.acquire("lorcana");

    fakes[0].__emit("welcome", { authenticated: true, connectionId: "c1" });
    expect(mgr.getState("lorcana").authMethod).toBe("authenticated");
  });

  it("fires onConnected / onWelcome / onAny and tracks reconnect attempts", () => {
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
    });
    mgr.setCredentials("lorcana", { token: "j1" });
    const h = mgr.acquire("lorcana");

    const connected = vi.fn();
    const welcome = vi.fn();
    const anyEvt = vi.fn();
    const reconnect = vi.fn();
    h.onConnected(connected);
    h.onWelcome(welcome);
    h.onAny(anyEvt);
    h.onReconnect(reconnect);

    fakes[0].__emit("connect");
    expect(connected).toHaveBeenCalledTimes(1);

    fakes[0].__emit("welcome", {
      authenticated: true,
      authenticationMethod: "ticket",
      connectionId: "c1",
    });
    expect(welcome).toHaveBeenCalledWith(expect.objectContaining({ connectionId: "c1" }));
    expect(anyEvt).toHaveBeenCalledWith("welcome", expect.objectContaining({ connectionId: "c1" }));

    fakes[0].__managerEmit("reconnect_attempt", 1);
    expect(mgr.getState("lorcana")).toMatchObject({ status: "reconnecting", reconnectAttempt: 1 });

    fakes[0].__managerEmit("reconnect");
    expect(reconnect).toHaveBeenCalledTimes(1);
    expect(mgr.getState("lorcana").reconnectAttempt).toBe(0);

    h.release();
  });

  it("removes only the released handle's listeners and tears down on last release", () => {
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
    });
    mgr.setCredentials("lorcana", { token: "j1" });
    const h1 = mgr.acquire("lorcana");
    const h2 = mgr.acquire("lorcana");

    const fn1 = vi.fn();
    const fn2 = vi.fn();
    h1.onWelcome(fn1);
    h2.onWelcome(fn2);

    fakes[0].__emit("welcome", { authenticated: false, connectionId: "c1" });
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);

    h1.release();
    fakes[0].__emit("welcome", {
      authenticated: true,
      authenticationMethod: "jwt",
      connectionId: "c2",
    });
    expect(fn1).toHaveBeenCalledTimes(1); // h1's listener removed
    expect(fn2).toHaveBeenCalledTimes(2); // h2's listener still active

    // h2 still holds the socket open.
    expect(mgr.getState("lorcana").status).not.toBe("idle");

    h2.release();
    expect(fakes[0].disconnect).toHaveBeenCalledTimes(1);
    expect(fakes[0].removeAllListeners).toHaveBeenCalledTimes(1);
    expect(mgr.getState("lorcana").status).toBe("idle");
  });

  it("fires onConnected immediately when the socket is already connected", () => {
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
    });
    mgr.setCredentials("lorcana", { token: "j1" });
    const h1 = mgr.acquire("lorcana");
    fakes[0].__emit("connect"); // socket now connected

    const connected = vi.fn();
    const h2 = mgr.acquire("lorcana"); // late joiner on the same socket
    h2.onConnected(connected);
    expect(connected).toHaveBeenCalledTimes(1);

    h1.release();
    h2.release();
  });

  it("reports idle state for never-acquired slugs and subscribes lazily", () => {
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
    });
    expect(mgr.getState("gundam")).toEqual({
      status: "idle",
      authenticated: false,
      authMethod: null,
      connectionId: null,
      latencyMs: null,
      reconnectAttempt: 0,
      error: null,
      authStatus: "ok",
      authFailureReason: null,
    });

    const seen: string[] = [];
    const unsub = mgr.subscribeState("gundam", (s) => seen.push(s.status));
    expect(seen).toEqual(["idle"]);
    unsub();
  });

  it("notifies subscribers on state transitions", () => {
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
    });
    mgr.setCredentials("lorcana", { token: "j1" });
    const h = mgr.acquire("lorcana");

    const seen: string[] = [];
    const unsub = h.subscribeState((s) => seen.push(s.status));
    expect(seen[0]).toBe("connecting");

    fakes[0].__emit("connect");
    expect(seen).toContain("connected");

    unsub();
    h.release();
  });

  it("tears down every socket on destroy()", () => {
    const mgr = createGatewayConnectionManager({
      gatewayOrigin: "wss://gateway.tcg.online",
    });
    mgr.setCredentials("lorcana", { token: "j1" });
    mgr.setCredentials("cyberpunk", { token: "j2" });
    mgr.acquire("lorcana");
    mgr.acquire("cyberpunk");

    mgr.destroy();

    expect(fakes[0].disconnect).toHaveBeenCalledTimes(1);
    expect(fakes[1].disconnect).toHaveBeenCalledTimes(1);
    expect(mgr.getState("lorcana").status).toBe("idle");
    expect(mgr.getState("cyberpunk").status).toBe("idle");
  });

  describe("handle.reconnect()", () => {
    it("disconnects a live socket then dials again on the SAME socket (no new io())", () => {
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      mgr.setCredentials("lorcana", { token: "j1" });
      const h = mgr.acquire("lorcana");
      expect(fakes[0].connect).toHaveBeenCalledTimes(1);

      fakes[0].__emit("connect");
      expect(fakes[0].connected).toBe(true);

      h.reconnect();

      // disconnect was called to drop the live connection, then connect again.
      expect(fakes[0].disconnect).toHaveBeenCalledTimes(1);
      expect(fakes[0].connect).toHaveBeenCalledTimes(2);
      // Critically: no new socket was created — reconnect reuses the instance.
      expect(ioMock).toHaveBeenCalledTimes(1);
      expect(mgr.getState("lorcana").status).toBe("connecting");

      h.release();
    });

    it("dials (without disconnecting) when the socket is not currently live", () => {
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      mgr.setCredentials("lorcana", { token: "j1" });
      const h = mgr.acquire("lorcana");
      // Never fired "connect" — socket is still not live.
      fakes[0].connect.mockClear();
      fakes[0].disconnect.mockClear();

      h.reconnect();

      expect(fakes[0].disconnect).not.toHaveBeenCalled();
      expect(fakes[0].connect).toHaveBeenCalledTimes(1);

      h.release();
    });

    it("re-reads credentials on the new handshake, consuming a freshly-set ticket once", () => {
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      mgr.setCredentials("lorcana", { token: "j1" });
      const h = mgr.acquire("lorcana");
      fakes[0].__emit("connect"); // live, ticket not yet set

      // Push a brand-new single-use ticket, then force a reconnect so it's used.
      mgr.setCredentials("lorcana", { ticket: "ticket_fresh", token: "j1" });
      h.reconnect();

      const received: unknown[] = [];
      authOpts().auth((d) => received.push(d));
      // First handshake after the reconnect carries the fresh ticket.
      expect(received[0]).toEqual({ ticket: "ticket_fresh", token: "j1" });

      // A second handshake (e.g. a transport reconnect) must NOT replay it.
      authOpts().auth((d) => received.push(d));
      expect(received[1]).toEqual({ token: "j1" });

      h.release();
    });

    it("respects the requireAuth gate: blocks and emits analytics when creds are missing", () => {
      const onAnalytics = vi.fn();
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
        onAnalytics,
      });
      // Live credentials via the controller (mirrors the web adapter's seam).
      let liveCreds: { token?: string; requireAuth?: boolean } = {
        token: "j1",
        requireAuth: true,
      };
      const h = mgr.acquire("lorcana", {
        credentials: { get: () => liveCreds, refresh: vi.fn().mockResolvedValue({}) },
      });
      fakes[0].__emit("connect");
      onAnalytics.mockClear();

      // Credentials vanish while requireAuth stays on → reconnect must gate.
      liveCreds = { requireAuth: true };
      fakes[0].connect.mockClear();
      fakes[0].disconnect.mockClear();
      h.reconnect();

      expect(fakes[0].connect).not.toHaveBeenCalled();
      expect(onAnalytics).toHaveBeenCalledWith(
        "ws_auth_policy_violation",
        expect.objectContaining({ reason: "missing_credentials", namespace: "/lorcana" }),
      );
      expect(mgr.getState("lorcana").status).toBe("disconnected");

      h.release();
    });

    it("is a no-op on a destroyed entry", () => {
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      mgr.setCredentials("lorcana", { token: "j1" });
      const h = mgr.acquire("lorcana");
      h.release();
      fakes[0].connect.mockClear();
      fakes[0].disconnect.mockClear();

      h.reconnect();

      expect(fakes[0].connect).not.toHaveBeenCalled();
      expect(fakes[0].disconnect).not.toHaveBeenCalled();
    });
  });

  describe("credential refresh loop", () => {
    const flushPromises = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0));

    /**
     * Build a controller whose `get()` returns a mutable `current` snapshot that
     * `refresh()` swaps for `refreshed` — mirrors a real controller surfacing
     * the freshest credentials after a refresh.
     */
    function refreshableController(opts: {
      initial: GatewayCredentials;
      refreshed: GatewayCredentials;
    }): { controller: CredentialsController; refresh: ReturnType<typeof vi.fn> } {
      let current: GatewayCredentials = opts.initial;
      const refresh = vi.fn(async (): Promise<GatewayCredentials> => {
        current = opts.refreshed;
        return current;
      });
      const controller: CredentialsController = { get: () => current, refresh };
      return { controller, refresh };
    }

    it("calls credentials.refresh once when welcome arrives unauthenticated with requireAuth", async () => {
      const { controller, refresh } = refreshableController({
        initial: { token: "stale", requireAuth: true },
        refreshed: { ticket: "fresh", token: "jwt", requireAuth: true },
      });
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      const h = mgr.acquire("lorcana", { credentials: controller });
      fakes[0].__emit("connect");

      fakes[0].__emit("welcome", { authenticated: false, connectionId: "c1" });
      await flushPromises();

      expect(refresh).toHaveBeenCalledTimes(1);
      // disconnect + re-dial on the SAME socket instance (no new io()).
      expect(fakes[0].disconnect).toHaveBeenCalledTimes(1);
      expect(ioMock).toHaveBeenCalledTimes(1);
      expect(fakes[0].connect).toHaveBeenCalledTimes(2);

      // The next handshake consumes the freshly-refreshed single-use ticket.
      const received: unknown[] = [];
      authOpts().auth((d) => received.push(d));
      expect(received[0]).toEqual({ ticket: "fresh", token: "jwt", requireAuth: true });

      h.release();
    });

    it("does not loop refresh on a second unauthenticated welcome", async () => {
      const { controller, refresh } = refreshableController({
        initial: { token: "stale", requireAuth: true },
        refreshed: { ticket: "fresh", token: "jwt", requireAuth: true },
      });
      const onAnalytics = vi.fn();
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
        onAnalytics,
      });
      const h = mgr.acquire("lorcana", { credentials: controller });
      fakes[0].__emit("connect");

      // First unauthenticated welcome → refresh.
      fakes[0].__emit("welcome", { authenticated: false, connectionId: "c1" });
      await flushPromises();

      // Second unauthenticated welcome → no second refresh; terminal failure.
      fakes[0].__emit("welcome", { authenticated: false, connectionId: "c2" });

      expect(refresh).toHaveBeenCalledTimes(1);
      expect(mgr.getState("lorcana")).toMatchObject({
        status: "disconnected",
        authStatus: "failed",
        authFailureReason: "refresh_exhausted",
      });
      expect(onAnalytics).toHaveBeenCalledWith(
        "ws_auth_terminal_failure",
        expect.objectContaining({ namespace: "/lorcana", reason: "refresh_exhausted" }),
      );

      h.release();
    });

    it("dedupes concurrent refresh calls", async () => {
      let resolveRefresh!: (value: GatewayCredentials) => void;
      const pending = new Promise<GatewayCredentials>((resolve) => {
        resolveRefresh = resolve;
      });
      const refresh = vi.fn((): Promise<GatewayCredentials> => pending);
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      const h = mgr.acquire("lorcana", {
        credentials: { get: () => ({ token: "stale", requireAuth: true }), refresh },
      });
      fakes[0].__emit("connect");

      // Two unauthenticated welcomes before the refresh resolves.
      fakes[0].__emit("welcome", { authenticated: false, connectionId: "c1" });
      fakes[0].__emit("welcome", { authenticated: false, connectionId: "c2" });

      expect(refresh).toHaveBeenCalledTimes(1);

      // Let the in-flight refresh settle so no dangling promise remains.
      resolveRefresh({ ticket: "fresh", token: "jwt", requireAuth: true });
      await flushPromises();

      h.release();
    });

    it("resets the one-shot after an authenticated welcome", async () => {
      const { controller, refresh } = refreshableController({
        initial: { token: "stale", requireAuth: true },
        refreshed: { ticket: "fresh", token: "jwt", requireAuth: true },
      });
      const onAnalytics = vi.fn();
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
        onAnalytics,
      });
      const h = mgr.acquire("lorcana", { credentials: controller });
      fakes[0].__emit("connect");

      // Unauthenticated welcome → refresh.
      fakes[0].__emit("welcome", { authenticated: false, connectionId: "c1" });
      await flushPromises();

      // Authenticated welcome → reset the one-shot and recover.
      fakes[0].__emit("welcome", {
        authenticated: true,
        authenticationMethod: "jwt",
        connectionId: "c2",
      });
      expect(mgr.getState("lorcana").authStatus).toBe("ok");
      expect(onAnalytics).toHaveBeenCalledWith(
        "ws_auth_recovered",
        expect.objectContaining({ namespace: "/lorcana" }),
      );
      expect(refresh).toHaveBeenCalledTimes(1);

      // Another unauthenticated welcome → refresh runs again (one-shot reset).
      refresh.mockClear();
      fakes[0].__emit("welcome", { authenticated: false, connectionId: "c3" });
      await flushPromises();
      expect(refresh).toHaveBeenCalledTimes(1);

      h.release();
    });

    it("tryConnect gate triggers refresh when credentials are missing and a controller is installed", async () => {
      const { controller, refresh } = refreshableController({
        initial: { requireAuth: true },
        refreshed: { ticket: "fresh", token: "jwt", requireAuth: true },
      });
      const onAnalytics = vi.fn();
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
        onAnalytics,
      });
      const h = mgr.acquire("lorcana", { credentials: controller });
      await flushPromises();

      // The gate blocked on acquire (get() returned only requireAuth) and
      // handed off to the controller instead of giving up silently.
      expect(refresh).toHaveBeenCalledTimes(1);
      expect(onAnalytics).toHaveBeenCalledWith(
        "ws_auth_policy_violation",
        expect.objectContaining({ reason: "missing_credentials", namespace: "/lorcana" }),
      );
      expect(onAnalytics).toHaveBeenCalledWith(
        "ws_credentials_refresh_attempt",
        expect.objectContaining({ namespace: "/lorcana" }),
      );
      expect(mgr.getState("lorcana").authFailureReason).toBe("missing_credentials");

      h.release();
    });

    it("transitions to terminal failure when refresh returns no required-auth credentials", async () => {
      const { controller, refresh } = refreshableController({
        initial: { requireAuth: true },
        refreshed: { requireAuth: true },
      });
      const onAnalytics = vi.fn();
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
        onAnalytics,
      });
      const h = mgr.acquire("lorcana", { credentials: controller });
      await flushPromises();

      expect(refresh).toHaveBeenCalledTimes(1);
      expect(fakes[0].connect).not.toHaveBeenCalled();
      expect(mgr.getState("lorcana")).toMatchObject({
        status: "disconnected",
        authStatus: "failed",
        authFailureReason: "refresh_exhausted",
        error: "Credential refresh did not restore authenticated access.",
      });
      expect(onAnalytics).toHaveBeenCalledWith(
        "ws_auth_terminal_failure",
        expect.objectContaining({ namespace: "/lorcana", reason: "refresh_exhausted" }),
      );

      h.release();
    });

    it("refresh failure transitions to terminal disconnected", async () => {
      const refresh = vi.fn(async (): Promise<GatewayCredentials> => {
        throw new Error("no creds");
      });
      const onAnalytics = vi.fn();
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
        onAnalytics,
      });
      const h = mgr.acquire("lorcana", {
        credentials: { get: () => ({ requireAuth: true }), refresh },
      });
      await flushPromises();

      expect(refresh).toHaveBeenCalledTimes(1);
      expect(mgr.getState("lorcana")).toMatchObject({
        status: "disconnected",
        authStatus: "failed",
        authFailureReason: "refresh_failed",
        error: "Credential refresh failed.",
      });
      expect(onAnalytics).toHaveBeenCalledWith(
        "ws_credentials_refresh_failed",
        expect.objectContaining({ namespace: "/lorcana", error: "no creds" }),
      );

      h.release();
    });

    it("requireAuth gate still emits ws_auth_policy_violation when no controller is installed", () => {
      const onAnalytics = vi.fn();
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
        onAnalytics,
      });
      mgr.setCredentials("lorcana", { requireAuth: true });
      mgr.acquire("lorcana");

      // No controller → hard block, no refresh attempt.
      expect(fakes[0].connect).not.toHaveBeenCalled();
      expect(onAnalytics).toHaveBeenCalledWith(
        "ws_auth_policy_violation",
        expect.objectContaining({ reason: "missing_credentials", namespace: "/lorcana" }),
      );
      expect(onAnalytics).not.toHaveBeenCalledWith(
        "ws_credentials_refresh_attempt",
        expect.anything(),
      );
      expect(mgr.getState("lorcana").status).toBe("disconnected");
    });
  });

  describe("latency ping loop", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("emits ping at the configured interval and populates latencyMs on pong", () => {
      const onAnalytics = vi.fn();
      const onLatency = vi.fn();
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
        onAnalytics,
        ping: { intervalMs: 1000 },
      });
      const h = mgr.acquire("lorcana");
      h.onLatency(onLatency);
      fakes[0].__emit("connect"); // socket now live so emitPing will fire
      fakes[0].emit.mockClear();

      vi.advanceTimersByTime(1000);
      expect(fakes[0].emit).toHaveBeenCalledWith("ping", { t: expect.any(Number) });

      // Server echoes back a pong referencing a timestamp 50ms in the past.
      const now = Date.now();
      fakes[0].__emit("pong", { serverTime: "2026-01-01T00:00:00.000Z", t: now - 50 });

      expect(mgr.getState("lorcana").latencyMs).toBe(50);
      expect(onLatency).toHaveBeenCalledWith(50);
      expect(onAnalytics).toHaveBeenCalledWith(
        "ws_latency_sample",
        expect.objectContaining({ namespace: "/lorcana", latencyMs: 50 }),
      );

      h.release();
    });

    it("does not start a ping loop when ping config is omitted", () => {
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      const h = mgr.acquire("lorcana");
      fakes[0].__emit("connect");
      fakes[0].emit.mockClear();

      vi.advanceTimersByTime(10_000);

      expect(fakes[0].emit).not.toHaveBeenCalled();

      h.release();
    });

    it("clears the ping timer and pong listener on release / teardown", () => {
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
        ping: { intervalMs: 1000 },
      });
      const h = mgr.acquire("lorcana");
      fakes[0].__emit("connect");
      fakes[0].emit.mockClear();

      h.release();

      // Ping timer cleared: advancing time does not emit another ping.
      vi.advanceTimersByTime(5_000);
      expect(fakes[0].emit).not.toHaveBeenCalled();

      // Pong listener cleared: latency is no longer updated.
      const before = mgr.getState("lorcana").latencyMs;
      fakes[0].__emit("pong", { serverTime: "x", t: Date.now() - 99 });
      expect(mgr.getState("lorcana").latencyMs).toBe(before);

      // Entry torn down → idle.
      expect(mgr.getState("lorcana").status).toBe("idle");
    });
  });

  describe("handle.onAuthenticated", () => {
    it("fires when the socket becomes connected and authenticated", () => {
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      mgr.setCredentials("lorcana", { token: "j1" });
      const h = mgr.acquire("lorcana");

      const cb = vi.fn();
      h.onAuthenticated(cb);

      // connect alone (no auth) must NOT fire onAuthenticated.
      fakes[0].__emit("connect");
      expect(cb).not.toHaveBeenCalled();

      // welcome(auth) flips authenticated true → fire.
      fakes[0].__emit("welcome", { authenticated: true, connectionId: "c1" });
      expect(cb).toHaveBeenCalledTimes(1);

      h.release();
    });

    it("fires immediately if already authenticated at registration", () => {
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      mgr.setCredentials("lorcana", { token: "j1" });
      const h = mgr.acquire("lorcana");
      fakes[0].__emit("connect");
      fakes[0].__emit("welcome", { authenticated: true, connectionId: "c1" });

      const cb = vi.fn();
      h.onAuthenticated(cb);
      expect(cb).toHaveBeenCalledTimes(1);

      h.release();
    });

    it("is edge-triggered (does not refire on unrelated state changes)", () => {
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      mgr.setCredentials("lorcana", { token: "j1" });
      const h = mgr.acquire("lorcana");

      const cb = vi.fn();
      h.onAuthenticated(cb);

      fakes[0].__emit("connect");
      fakes[0].__emit("welcome", { authenticated: true, connectionId: "c1" });
      expect(cb).toHaveBeenCalledTimes(1);

      // Unrelated state change (latency update via pong) — state stays
      // connected+authenticated, so onAuthenticated must not refire.
      fakes[0].__emit("pong", { serverTime: "x", t: Date.now() - 50 });
      expect(cb).toHaveBeenCalledTimes(1);

      h.release();
    });
  });

  describe("packet logging", () => {
    afterEach(() => {
      Reflect.deleteProperty(globalThis, "localStorage");
      vi.restoreAllMocks();
    });

    it("logs handshake, incoming packets, outgoing packets, and lifecycle when enabled", () => {
      const store = installLocalStorageStub();
      store.set("tcg:gateway-packet-log", "1");
      const consoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      mgr.setCredentials("lorcana", { ticket: "ticket-secret", token: "jwt-secret" });
      const h = mgr.acquire("lorcana");

      let authPayload: unknown;
      authOpts().auth((data) => {
        authPayload = data;
      });
      fakes[0].__emit("connect");
      fakes[0].__emit("welcome", {
        authenticated: true,
        authenticationMethod: "ticket",
        connectionId: "conn_1",
      });
      h.emit("heartbeat", { game: { gameId: "game_1", matchId: "match_1" } });

      expect(authPayload).toEqual({ ticket: "ticket-secret", token: "jwt-secret" });
      expect(consoleLog).toHaveBeenCalledWith(
        "[gateway:handshake] /lorcana auth",
        expect.objectContaining({
          payload: { hasTicket: true, hasToken: true, requireAuth: false },
        }),
      );
      expect(consoleLog).toHaveBeenCalledWith(
        "[gateway:lifecycle] /lorcana connect",
        expect.objectContaining({ event: "connect", namespace: "/lorcana" }),
      );
      expect(consoleLog).toHaveBeenCalledWith(
        "[gateway:receive] /lorcana welcome",
        expect.objectContaining({
          payload: expect.objectContaining({ authenticated: true }),
        }),
      );
      expect(consoleLog).toHaveBeenCalledWith(
        "[gateway:send] /lorcana heartbeat",
        expect.objectContaining({
          payload: { game: { gameId: "game_1", matchId: "match_1" } },
        }),
      );
      expect(
        consoleLog.mock.calls.some((call) => JSON.stringify(call).includes("ticket-secret")),
      ).toBe(false);
      expect(
        consoleLog.mock.calls.some((call) => JSON.stringify(call).includes("jwt-secret")),
      ).toBe(false);

      h.release();
    });
  });

  describe("handle.join / handle.leave", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });
    afterEach(() => {
      vi.useRealTimers();
    });

    it("emits join_game on authenticated with a correlationId", () => {
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      mgr.setCredentials("lorcana", { token: "j1" });
      const h = mgr.acquire("lorcana");
      fakes[0].emit.mockClear();

      h.join({ gameId: "game_1", role: "player", gameProfileId: "profile_7" });

      // Not authenticated yet — no emit at registration.
      expect(fakes[0].emit).not.toHaveBeenCalled();

      fakes[0].__emit("connect");
      fakes[0].__emit("welcome", { authenticated: true, connectionId: "c1" });

      expect(fakes[0].emit).toHaveBeenCalledWith(
        "join_game",
        expect.objectContaining({
          gameId: "game_1",
          role: "player",
          gameProfileId: "profile_7",
          correlationId: expect.any(String),
        }),
      );
      // correlationId is a fresh uuid (non-empty).
      const payload = fakes[0].emit.mock.calls[0]![1] as { correlationId: string };
      expect(payload.correlationId.length).toBeGreaterThan(0);

      h.release();
    });

    it("dedupes by socket id (does not re-emit on the same socket)", () => {
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      mgr.setCredentials("lorcana", { token: "j1" });
      const h = mgr.acquire("lorcana");
      h.join({ gameId: "game_1", role: "player" });
      fakes[0].__emit("connect");
      fakes[0].__emit("welcome", { authenticated: true, connectionId: "c1" });
      expect(fakes[0].emit).toHaveBeenCalledTimes(1);

      // Flap auth off then back on while staying on the SAME socket —
      // onAuthenticated re-fires, but performJoin dedupes by socket id.
      fakes[0].__emit("welcome", { authenticated: false, connectionId: "c1" });
      fakes[0].__emit("welcome", { authenticated: true, connectionId: "c1" });

      const joinCalls = fakes[0].emit.mock.calls.filter((c) => c[0] === "join_game");
      expect(joinCalls).toHaveLength(1);

      h.release();
    });

    it("re-emits after a disconnect+reconnect (new socket id)", () => {
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      mgr.setCredentials("lorcana", { token: "j1" });
      const h = mgr.acquire("lorcana");
      h.join({ gameId: "game_1", role: "player" });
      fakes[0].__emit("connect");
      fakes[0].__emit("welcome", { authenticated: true, connectionId: "c1" });
      expect(fakes[0].emit.mock.calls.filter((c) => c[0] === "join_game")).toHaveLength(1);

      // Advance past the 2s in-flight window so the second emit isn't skipped.
      vi.advanceTimersByTime(2500);

      // Reconnect on a brand-new socket id.
      fakes[0].__emit("disconnect", "transport close");
      fakes[0].id = "conn_2";
      fakes[0].__emit("connect");
      fakes[0].__emit("welcome", { authenticated: true, connectionId: "c2" });

      expect(fakes[0].emit.mock.calls.filter((c) => c[0] === "join_game")).toHaveLength(2);

      h.release();
    });

    it("in-flight guard skips emit within the 2s window", () => {
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      mgr.setCredentials("lorcana", { token: "j1" });
      const h = mgr.acquire("lorcana");
      h.join({ gameId: "game_1", role: "player" });
      fakes[0].__emit("connect");
      fakes[0].__emit("welcome", { authenticated: true, connectionId: "c1" });
      expect(fakes[0].emit.mock.calls.filter((c) => c[0] === "join_game")).toHaveLength(1);

      // Immediate disconnect+reconnect (no time advance) on a new socket id —
      // socket-id dedup would allow the emit, but the in-flight guard skips.
      fakes[0].__emit("disconnect", "transport close");
      fakes[0].id = "conn_2";
      fakes[0].__emit("connect");
      fakes[0].__emit("welcome", { authenticated: true, connectionId: "c2" });

      expect(fakes[0].emit.mock.calls.filter((c) => c[0] === "join_game")).toHaveLength(1);

      h.release();
    });

    it("leave clears join intent and emits leave_game", () => {
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      mgr.setCredentials("lorcana", { token: "j1" });
      const h = mgr.acquire("lorcana");
      h.join({ gameId: "game_1", role: "spectator", gameProfileId: "p7" });
      fakes[0].emit.mockClear();

      h.leave();

      expect(fakes[0].emit).toHaveBeenCalledWith("leave_game", {
        gameId: "game_1",
        gameProfileId: "p7",
      });

      // Now authenticate — the internal onAuthenticated subscription was
      // torn down by leave(), so no join_game re-emit happens.
      fakes[0].__emit("connect");
      fakes[0].__emit("welcome", { authenticated: true, connectionId: "c1" });
      expect(fakes[0].emit.mock.calls.filter((c) => c[0] === "join_game")).toHaveLength(0);

      h.release();
    });
  });

  describe("handle.onHeartbeatAck", () => {
    it("surfaces heartbeat_ack via onHeartbeatAck", () => {
      const mgr = createGatewayConnectionManager({
        gatewayOrigin: "wss://gateway.tcg.online",
      });
      mgr.setCredentials("lorcana", { token: "j1" });
      const h = mgr.acquire("lorcana");
      const cb = vi.fn();
      h.onHeartbeatAck(cb);

      const payload = {
        serverTime: "2026-06-18T12:00:00.000Z",
        stateVersions: { game_1: 42 },
      };
      fakes[0].__emit("heartbeat_ack", payload);

      expect(cb).toHaveBeenCalledWith(payload);

      h.release();
    });
  });
});
