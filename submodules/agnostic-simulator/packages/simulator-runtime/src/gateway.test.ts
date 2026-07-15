import { describe, expect, it, vi } from "vitest";

import {
  buildGatewaySocketIoUrl,
  buildGatewayTicketUrl,
  requestGatewayTicket,
  shouldRefreshAnonymousWelcome,
} from "./gateway.js";

describe("simulator gateway runtime", () => {
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
