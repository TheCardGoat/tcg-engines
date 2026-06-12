import { beforeEach, describe, expect, it, vi } from "vitest";

const ioMock = vi.hoisted(() => vi.fn());

vi.mock("socket.io-client", () => ({
  io: ioMock,
}));

vi.mock("socket.io-msgpack-parser", () => ({
  __esModule: true,
  encode: () => new Uint8Array(),
  decode: () => undefined,
}));

import {
  buildGatewaySocketIoUrl,
  buildGatewayTicketUrl,
  openSimulatorGateway,
  requestGatewayTicket,
  shouldRefreshAnonymousWelcome,
} from "./gateway.js";

describe("simulator gateway runtime", () => {
  beforeEach(() => {
    ioMock.mockReset();
    ioMock.mockReturnValue({ connect: vi.fn() });
  });

  it("builds ticket and Socket.IO urls from game runtime config", () => {
    expect(buildGatewayTicketUrl("https://api.tcg.online/v1/")).toBe(
      "https://api.tcg.online/v1/gateway/ticket",
    );
    expect(
      buildGatewaySocketIoUrl({
        gameSlug: "cyberpunk",
        gatewayOrigin: "wss://gateway.tcg.online/socket.io/",
      }),
    ).toBe("wss://gateway.tcg.online/cyberpunk");
  });

  it("opens a Socket.IO namespace with websocket msgpack transport and ticket auth", () => {
    openSimulatorGateway(
      { ticket: "ticket_1" },
      { gameSlug: "cyberpunk", gatewayOrigin: "wss://gateway.tcg.online" },
    );

    expect(ioMock).toHaveBeenCalledTimes(1);
    expect(ioMock.mock.calls[0]?.[0]).toBe("wss://gateway.tcg.online/cyberpunk");
    const opts = ioMock.mock.calls[0]?.[1] as {
      auth: (cb: (data: unknown) => void) => void;
      autoConnect: boolean;
      parser: unknown;
      path: string;
      transports: string[];
      withCredentials: boolean;
    };
    expect(opts.path).toBe("/socket.io/");
    expect(opts.transports).toEqual(["websocket"]);
    expect(opts.parser).toBeDefined();
    expect(opts.autoConnect).toBe(false);
    expect(opts.withCredentials).toBe(true);
    let auth: unknown;
    opts.auth((data) => {
      auth = data;
    });
    expect(auth).toEqual({ ticket: "ticket_1" });
  });

  it("re-reads gateway auth for reconnects", () => {
    let current = { ticket: "ticket_1" };
    openSimulatorGateway(current, {
      gameSlug: "cyberpunk",
      gatewayOrigin: "wss://gateway.tcg.online",
      getAuth: () => current,
    });

    const opts = ioMock.mock.calls[0]?.[1] as {
      auth: (cb: (data: unknown) => void) => void;
    };
    const received: unknown[] = [];
    opts.auth((data) => received.push(data));
    current = { ticket: "ticket_2" };
    opts.auth((data) => received.push(data));

    expect(received).toEqual([{ ticket: "ticket_1" }, { ticket: "ticket_2" }]);
  });

  it("marks required auth in the gateway handshake", () => {
    openSimulatorGateway(
      { ticket: "ticket_1", authToken: "token_1" },
      {
        gameSlug: "cyberpunk",
        gatewayOrigin: "wss://gateway.tcg.online",
        authMode: "required",
      },
    );

    const opts = ioMock.mock.calls[0]?.[1] as {
      auth: (cb: (data: unknown) => void) => void;
    };
    let auth: unknown;
    opts.auth((data) => {
      auth = data;
    });

    expect(auth).toEqual({
      ticket: "ticket_1",
      token: "token_1",
      requireAuth: true,
    });
  });

  it("classifies anonymous welcomes as auth violations only for required auth", () => {
    expect(shouldRefreshAnonymousWelcome("required", { authenticated: false })).toBe(true);
    expect(shouldRefreshAnonymousWelcome("required", { authenticated: true })).toBe(false);
    expect(shouldRefreshAnonymousWelcome("optional", { authenticated: false })).toBe(false);
  });

  it("requests a fresh gateway ticket with optional match params", async () => {
    const fetcher = vi.fn(async () => {
      return new Response(JSON.stringify({ ticket: "fresh_ticket", authToken: "fresh_token" }), {
        status: 200,
      });
    });
    const primeAuthSession = vi.fn(async () => {});

    await expect(
      requestGatewayTicket({
        apiBaseUrl: "https://api.tcg.online/v1",
        matchId: "match_1",
        playerId: "player_1",
        fetcher,
        primeAuthSession,
      }),
    ).resolves.toEqual({ ticket: "fresh_ticket", authToken: "fresh_token" });
    expect(primeAuthSession).not.toHaveBeenCalled();
    expect(fetcher).toHaveBeenCalledWith(
      "https://api.tcg.online/v1/gateway/ticket",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ matchId: "match_1", playerId: "player_1" }),
      }),
    );
  });
});
