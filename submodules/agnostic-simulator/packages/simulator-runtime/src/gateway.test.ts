import { describe, expect, it, vi } from "vitest";

import {
  buildGatewaySocketIoUrl,
  buildGatewayTicketUrl,
  parseGatewayEvent,
  requestGatewayTicket,
  shouldRefreshAnonymousWelcome,
} from "./gateway.js";

describe("simulator gateway runtime", () => {
  it("reports rejected snapshots without logging private state and accepts the next valid sync", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const snapshot = {
        gameId: "g_1",
        stateVersion: 70,
        state: { privateCard: "secret" },
        engineLogs: [],
        animationPlan: null,
      };
      expect(
        parseGatewayEvent("state_sync", { ...snapshot, interactionView: { protocolVersion: -1 } }),
      ).toBeNull();
      expect(error).toHaveBeenCalledWith(
        "[gateway] authoritative snapshot rejected",
        expect.objectContaining({
          event: "state_sync",
          stateVersion: 70,
          issues: expect.any(Array),
        }),
      );
      expect(JSON.stringify(error.mock.calls)).not.toContain("secret");
      expect(parseGatewayEvent("state_sync", snapshot)).toMatchObject({
        type: "state_sync",
        stateVersion: 70,
      });
    } finally {
      error.mockRestore();
    }
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

  it("still parses game_joined after nested presentation or player extras fail the strict schema", () => {
    const parsed = parseGatewayEvent("game_joined", {
      gameId: "g_1",
      role: "player",
      stateVersion: 1,
      state: { ctx: { stateID: 1 }, G: {} },
      presentation: { kind: "not-a-real-envelope" },
      interactionView: { protocolVersion: 1 },
      dropEligibility: { allowed: true },
      players: [{ id: "p_1", connected: true, displayName: "Runner" }],
    });
    expect(parsed).toMatchObject({
      type: "game_joined",
      gameId: "g_1",
      role: "player",
      stateVersion: 1,
      state: { ctx: { stateID: 1 }, G: {} },
      players: [{ id: "p_1", connected: true }],
    });
    expect(parsed).toMatchObject({
      unparsedSnapshot: expect.arrayContaining([
        "presentation",
        "interactionView",
        "dropEligibility",
      ]),
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
        gameSlug: "cyberpunk",
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
        body: JSON.stringify({
          gameSlug: "cyberpunk",
          matchId: "match_1",
          playerId: "player_1",
        }),
      }),
    );
  });
});
