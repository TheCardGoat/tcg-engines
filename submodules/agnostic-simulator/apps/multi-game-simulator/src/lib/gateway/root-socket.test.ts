import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { AuthSession } from "@tcg/shared/auth";

/**
 * Root-socket + shared-manager migration tests.
 *
 * The root socket is now a thin wrapper over the singleton
 * `@tcg/gateway-client` manager. These tests assert:
 *  - the root acquires the namespace once and connects once;
 *  - same-slug re-init is idempotent (no second socket, handle reused) and the
 *    refreshed SSR credentials are visible through the controller's `get()`;
 *  - a stable CredentialsController is installed per slug and its `refresh()`
 *    fetches a fresh ticket snapshot (the library owns refresh-on-failure);
 *  - a second acquire on the same slug (LiveMatch) does NOT open a second
 *    socket — the core one-socket-per-namespace guarantee;
 *  - slug changes rebuild, null slug tears down;
 *  - SSR credentials (ticket/token/requireAuth) flow into the handshake.
 */

const ioMock = vi.hoisted(() => vi.fn());
const ticketMock = vi.hoisted(() => vi.fn());

vi.mock("socket.io-client", () => ({ io: ioMock }));

vi.mock("socket.io-msgpack-parser", () => ({
  __esModule: true,
  encode: () => new Uint8Array(),
  decode: () => undefined,
}));

// The credentials controller's `refresh()` calls the shared gateway ticket
// resolver (`@tcg/simulator-runtime/gateway`) with a per-game `apiBaseUrl`
// resolved from the slug. Mock that module so the refresh test is hermetic.
// `normalizeOrigin` is also consumed by gateway-manager.ts, so preserve it.
vi.mock("@tcg/simulator-runtime/gateway", () => ({
  requestGatewayTicket: ticketMock,
  normalizeOrigin: (input: string) => input,
}));

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
  io: { on: ReturnType<typeof vi.fn>; off: ReturnType<typeof vi.fn> };
}

function makeFakeSocket(): FakeSocket {
  return {
    connected: false,
    id: "conn_1",
    on: vi.fn(),
    off: vi.fn(),
    onAny: vi.fn(),
    offAny: vi.fn(),
    emit: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
    removeAllListeners: vi.fn(),
    io: { on: vi.fn(), off: vi.fn() },
  };
}

type RootSocketModule = typeof import("./root-socket");
type ManagerModule = typeof import("./gateway-manager");

let fakes: FakeSocket[];
let initRootSocket: RootSocketModule["initRootSocket"];
let destroyRootSocket: RootSocketModule["destroyRootSocket"];
let getRootSocketHandleForTests: RootSocketModule["getRootSocketHandleForTests"];
let getRootSocketControllerForTests: RootSocketModule["getRootSocketControllerForTests"];
let getGatewayManager: ManagerModule["getGatewayManager"];
let resetGatewayManagerForTests: ManagerModule["resetGatewayManagerForTests"];

function lastFake(): FakeSocket {
  const last = fakes.at(-1);
  if (!last) throw new Error("io was never called");
  return last;
}

function invokeAuth(): Record<string, unknown> {
  const opts = ioMock.mock.calls.at(-1)?.[1] as
    | { auth: (cb: (d: unknown) => void) => void }
    | undefined;
  if (!opts) throw new Error("no io options");
  let captured: Record<string, unknown> = {};
  opts.auth((d) => {
    captured = d as Record<string, unknown>;
  });
  return captured;
}

function makeSession(token: string): AuthSession {
  return {
    id: "session_1",
    userId: "user_1",
    token,
    expiresAt: new Date("2026-12-31T00:00:00.000Z"),
    ipAddress: null,
    userAgent: null,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };
}

beforeEach(async () => {
  vi.clearAllMocks();
  fakes = [];
  ioMock.mockImplementation(() => {
    const fake = makeFakeSocket();
    fakes.push(fake);
    return fake;
  });
  vi.resetModules();
  const rootMod = await import("./root-socket");
  const mgrMod = await import("./gateway-manager");
  initRootSocket = rootMod.initRootSocket;
  destroyRootSocket = rootMod.destroyRootSocket;
  getRootSocketHandleForTests = rootMod.getRootSocketHandleForTests;
  getRootSocketControllerForTests = rootMod.getRootSocketControllerForTests;
  getGatewayManager = mgrMod.getGatewayManager;
  resetGatewayManagerForTests = mgrMod.resetGatewayManagerForTests;
  resetGatewayManagerForTests();
});

afterEach(() => {
  destroyRootSocket();
  resetGatewayManagerForTests();
});

describe("initRootSocket (shared manager)", () => {
  it("acquires the namespace once and connects once", () => {
    initRootSocket({
      session: makeSession("s"),
      gameSlug: "cyberpunk",
      ticket: "t1",
      authToken: "j1",
    });

    expect(ioMock).toHaveBeenCalledTimes(1);
    expect(ioMock.mock.calls[0]?.[0]).toBe("wss://gateway.tcg.online/cyberpunk");
    expect(lastFake().connect).toHaveBeenCalledTimes(1);
  });

  it("is idempotent for the same slug: reuses the handle, no second socket or reconnect", () => {
    const session = makeSession("s");
    initRootSocket({ session, gameSlug: "cyberpunk", ticket: "t1", authToken: "j1" });
    const first = getRootSocketHandleForTests();

    initRootSocket({ session, gameSlug: "cyberpunk", ticket: "t2", authToken: "j2" });

    expect(ioMock).toHaveBeenCalledTimes(1);
    expect(getRootSocketHandleForTests()).toBe(first);
    const fake = lastFake();
    expect(fake.disconnect).not.toHaveBeenCalled();
    expect(fake.connect).toHaveBeenCalledTimes(1);
    // The controller is the single source of truth for credentials. Same-slug
    // re-init overwrites the snapshot the controller's `get()` reads, so the
    // refreshed SSR ticket arms the next handshake (the socket never connected
    // yet, so the single-use ticket has not been consumed).
    expect(getRootSocketControllerForTests()?.get()).toMatchObject({
      ticket: "t2",
      token: "j2",
      requireAuth: true,
    });
    expect(invokeAuth()).toMatchObject({ ticket: "t2", token: "j2" });
  });

  it("installs a stable credentials controller per slug whose refresh() fetches a fresh ticket snapshot", async () => {
    ticketMock.mockResolvedValue({ ticket: "refreshed_ticket", authToken: "refreshed_jwt" });
    initRootSocket({
      session: makeSession("sess1"),
      gameSlug: "cyberpunk",
      ticket: "t1",
      authToken: "j1",
    });

    const controller = getRootSocketControllerForTests();
    expect(controller).not.toBeNull();
    // get() returns the seeded SSR snapshot (re-read on every handshake).
    expect(controller!.get()).toEqual({ ticket: "t1", token: "j1", requireAuth: true });

    // The controller is stable across a same-slug re-init (same reference):
    // the library throws if a second acquire supplies a different controller.
    initRootSocket({
      session: makeSession("sess1"),
      gameSlug: "cyberpunk",
      ticket: "t2",
      authToken: "j2",
    });
    expect(getRootSocketControllerForTests()).toBe(controller);

    // refresh() hits the shared gateway ticket resolver with the per-game
    // runtime-API origin and maps the response ({ ticket, authToken }) into a
    // GatewayCredentials snapshot ({ ticket, token, requireAuth }).
    const snapshot = await controller!.refresh();
    expect(ticketMock).toHaveBeenCalledWith({ apiBaseUrl: expect.any(String) });
    expect(snapshot).toEqual({
      ticket: "refreshed_ticket",
      token: "refreshed_jwt",
      requireAuth: true,
    });
    // The refreshed snapshot is now visible via get().
    expect(controller!.get()).toEqual({
      ticket: "refreshed_ticket",
      token: "refreshed_jwt",
      requireAuth: true,
    });
  });

  it("keeps exactly ONE socket when a second consumer acquires the same slug (LiveMatch)", () => {
    initRootSocket({
      session: makeSession("s"),
      gameSlug: "cyberpunk",
      ticket: "t1",
      authToken: "j1",
    });
    expect(ioMock).toHaveBeenCalledTimes(1);

    // LiveMatch acquires the SAME namespace from the shared manager.
    const liveHandle = getGatewayManager().acquire("cyberpunk");

    // No second Socket.IO socket is created.
    expect(ioMock).toHaveBeenCalledTimes(1);
    expect(lastFake().connect).toHaveBeenCalledTimes(1);

    liveHandle.release();
    // Releasing the LiveMatch handle does not tear down the root's socket.
    expect(lastFake().disconnect).not.toHaveBeenCalled();
  });

  it("tears down on a null slug", () => {
    initRootSocket({ session: makeSession("s"), gameSlug: "cyberpunk" });
    expect(ioMock).toHaveBeenCalledTimes(1);

    initRootSocket({ session: makeSession("s"), gameSlug: null });

    expect(getRootSocketHandleForTests()).toBeNull();
    expect(ioMock).toHaveBeenCalledTimes(1);
    const fake = lastFake();
    expect(fake.removeAllListeners).toHaveBeenCalledTimes(1);
    expect(fake.disconnect).toHaveBeenCalledTimes(1);
  });

  it("rebuilds when the slug changes", () => {
    const session = makeSession("s");
    initRootSocket({ session, gameSlug: "lorcana" });
    initRootSocket({ session, gameSlug: "gundam" });

    expect(ioMock).toHaveBeenCalledTimes(2);
    expect(ioMock.mock.calls[0]?.[0]).toBe("wss://gateway.tcg.online/lorcana");
    expect(ioMock.mock.calls[1]?.[0]).toBe("wss://gateway.tcg.online/gundam");
    // The old namespace socket was torn down.
    expect(fakes[0]?.disconnect).toHaveBeenCalledTimes(1);
    expect(fakes[0]?.removeAllListeners).toHaveBeenCalledTimes(1);
  });

  it("pushes SSR credentials into the handshake auth and consumes the single-use ticket", () => {
    initRootSocket({
      session: makeSession("sess1"),
      gameSlug: "cyberpunk",
      ticket: "t1",
      authToken: "jwt1",
    });

    // First handshake: ticket + JWT + requireAuth.
    expect(invokeAuth()).toEqual({ ticket: "t1", token: "jwt1", requireAuth: true });
    // Second handshake: ticket cleared (single-use), JWT retained.
    expect(invokeAuth()).toEqual({ token: "jwt1", requireAuth: true });
  });

  it("omits requireAuth and credentials for an anonymous root", () => {
    initRootSocket({ session: null, gameSlug: "cyberpunk" });
    expect(invokeAuth()).toEqual({});
  });
});
