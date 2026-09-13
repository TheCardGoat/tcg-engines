import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveGatewayTicket } from "./gateway-ticket.js";

describe("resolveGatewayTicket", () => {
  beforeEach(() => {
    vi.stubEnv(
      "GAME_RUNTIME_API_INTERNAL_URLS",
      JSON.stringify({
        cyberpunk: "http://general-api:3000",
        riftbound: "http://general-api:3000",
      }),
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("reports required-auth 401 ticket failures without anonymous fallback", async () => {
    const fetcher = vi.fn<typeof fetch>(
      async () => new Response(JSON.stringify({ error: "session.not_found" }), { status: 401 }),
    );

    await expect(
      resolveGatewayTicket({
        request: new Request("https://tcg.online/cyberpunk/simulator/matches/m1/games/g1", {
          headers: { cookie: "better-auth.session_token=abc" },
        }),
        gameSlug: "cyberpunk",
        matchId: "m1",
        playerId: "p1",
        requireAuth: true,
        fetcher,
      }),
    ).resolves.toEqual({
      status: "ticket_failed",
      reason: "missing_credentials",
      httpStatus: 401,
      errorCode: "GatewayTicketHttpError",
    });
  });

  it("allows anonymous fallback for non-required ticket failures", async () => {
    const fetcher = vi.fn<typeof fetch>(async () => new Response("unavailable", { status: 503 }));

    await expect(
      resolveGatewayTicket({
        request: new Request("https://tcg.online/cyberpunk/simulator/"),
        gameSlug: "cyberpunk",
        requireAuth: false,
        fetcher,
      }),
    ).resolves.toEqual({ status: "anonymous_allowed", reason: "not_required" });
  });

  it("mints Riftbound tickets through the server-only runtime origin", async () => {
    vi.stubEnv(
      "GAME_RUNTIME_API_INTERNAL_URLS",
      JSON.stringify({ riftbound: "http://general-api:3000" }),
    );
    const fetcher = vi.fn<typeof fetch>(async () =>
      Response.json({ ticket: "ticket", authToken: "token" }),
    );

    await expect(
      resolveGatewayTicket({
        request: new Request("http://localhost:8080/riftbound/simulator/matches/m1/games/g1", {
          headers: { cookie: "better-auth.session_token=abc" },
        }),
        gameSlug: "riftbound",
        matchId: "m1",
        playerId: "p1",
        requireAuth: true,
        fetcher,
      }),
    ).resolves.toEqual({ status: "ready", ticket: { ticket: "ticket", authToken: "token" } });

    expect(fetcher).toHaveBeenCalledWith(
      "http://general-api:3000/v1/gateway/ticket",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          gameSlug: "riftbound",
          matchId: "m1",
          playerId: "p1",
        }),
      }),
    );
  });

  it("does not use a browser-visible public origin when the internal map is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("GAME_RUNTIME_API_INTERNAL_URLS", "");
    vi.stubEnv(
      "VITE_GAME_RUNTIME_API_URLS",
      JSON.stringify({ cyberpunk: "https://api.tcg.online" }),
    );
    const fetcher = vi.fn<typeof fetch>();

    await expect(
      resolveGatewayTicket({
        request: new Request("https://tcg.online/cyberpunk/simulator/"),
        gameSlug: "cyberpunk",
        requireAuth: true,
        fetcher,
      }),
    ).resolves.toEqual({
      status: "ticket_failed",
      reason: "request_failed",
      errorCode: "Error",
    });
    expect(fetcher).not.toHaveBeenCalled();
  });
});
