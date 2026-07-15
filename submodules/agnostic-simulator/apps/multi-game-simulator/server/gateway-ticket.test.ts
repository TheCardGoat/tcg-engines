import { describe, expect, it, vi } from "vitest";
import { resolveGatewayTicket } from "./gateway-ticket.js";

describe("resolveGatewayTicket", () => {
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
});
