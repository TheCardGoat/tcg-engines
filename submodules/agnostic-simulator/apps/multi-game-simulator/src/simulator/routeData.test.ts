import { liveGameFromSession } from "@tcg/game-page-contract";
import { describe, expect, test, vi } from "vitest";

import {
  fetchSharedSimulatorRouteDataForRoute,
  parseSharedSimulatorRoute,
  participantIsPremium,
} from "./routeData";

describe("shared simulator route data", () => {
  test("relays the server-issued spectator cookie through the SSR route response", async () => {
    const cookie = "tcg-auth-spectator=server-issued; Path=/; HttpOnly; SameSite=Lax";
    const fetcher = vi.fn(
      async () => new Response(null, { status: 404, headers: { "Set-Cookie": cookie } }),
    );
    vi.stubGlobal("fetch", fetcher);
    vi.stubEnv("GAME_RUNTIME_API_INTERNAL_URLS", JSON.stringify({ gundam: "http://runtime.test" }));
    try {
      const response = await makeSimulatorRouteLoader("live-match")({
        request: new Request("https://tcg.online/gundam/simulator/matches/m1/games/g1", {
          headers: { Cookie: "tcg-auth-spectator=existing" },
        }),
        url: new URL("https://tcg.online/gundam/simulator/matches/m1/games/g1"),
        pattern: "/:gameSlug/simulator/matches/:matchId/games/:gameId",
        params: { gameSlug: "gundam", matchId: "m1", gameId: "g1" },
        context: new RouterContextProvider(),
      });
      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(response.data.error).toContain("expired");
      expect(new Headers(response.init?.headers).getSetCookie()).toEqual([cookie]);
      expect(new Headers(vi.mocked(fetch).mock.calls[0]?.[1]?.headers).get("cookie")).toBe(
        "tcg-auth-spectator=existing",
      );
    } finally {
      vi.unstubAllGlobals();
      vi.unstubAllEnvs();
    }
  });
  test.each(["live-match", "match-landing"] as const)(
    "explains a missing %s without claiming a result or exposing HTTP errors",
    async (routeKind) => {
      const fetcher = vi.fn(async () => new Response(null, { status: 404 }));
      const data = await fetchSharedSimulatorRouteDataForRoute({
        request: new Request("https://tcg.online/flesh-and-blood/simulator/matches/m1/games/g1"),
        route: { gameSlug: "flesh-and-blood", routeKind, matchId: "m1", gameId: "g1" },
        fetcher,
      });
      expect(data.error).toContain("may have expired after inactivity");
      expect(data.error).toContain("accessible to you");
      expect(data.error).not.toMatch(/HTTP|404|won|lost/);
      expect(data.session).toBeNull();
      expect(fetcher).toHaveBeenCalledTimes(1);
    },
  );

  test.each([401, 403, 503])("gives appropriate recovery for HTTP %s", async (status) => {
    const data = await fetchSharedSimulatorRouteDataForRoute({
      request: new Request("https://tcg.online/gundam/simulator/matches/m1"),
      route: { gameSlug: "gundam", routeKind: "match-landing", matchId: "m1" },
      fetcher: async () => new Response(null, { status }),
    });
    expect(data.error).toContain(status === 503 ? "try again in a moment" : "signed in");
    expect(data.error).not.toContain("expired");
  });

  test("keeps internal fetch errors out of player-facing copy", async () => {
    const data = await fetchSharedSimulatorRouteDataForRoute({
      request: new Request("https://tcg.online/gundam/simulator/matches/m1"),
      route: { gameSlug: "gundam", routeKind: "match-landing", matchId: "m1" },
      fetcher: async () => {
        throw new Error("internal host unavailable");
      },
    });
    expect(data.error).toContain("try again in a moment");
    expect(data.error).not.toContain("internal host");
  });

  test("parses canonical live-match routes consistently across games", () => {
    expect(
      parseSharedSimulatorRoute(
        new URL("https://tcg.online/one-piece/simulator/matches/m1/games/g1"),
      ),
    ).toEqual({
      gameSlug: "one-piece",
      routeKind: "live-match",
      matchId: "m1",
      gameId: "g1",
    });

    expect(
      parseSharedSimulatorRoute(
        new URL("https://tcg.online/cyberpunk/simulator/matches/m%201/games/g%2F1"),
      ),
    ).toEqual({
      gameSlug: "cyberpunk",
      routeKind: "live-match",
      matchId: "m 1",
      gameId: "g/1",
    });
  });

  test("parses match landing, practice, and legacy mounted routes", () => {
    expect(
      parseSharedSimulatorRoute(new URL("https://tcg.online/gundam/simulator/matches/m1")),
    ).toMatchObject({
      gameSlug: "gundam",
      routeKind: "match-landing",
      matchId: "m1",
    });

    expect(
      parseSharedSimulatorRoute(new URL("https://tcg.online/gundam/simulator/play/practice")),
    ).toMatchObject({
      gameSlug: "gundam",
      routeKind: "play-practice",
    });

    expect(
      parseSharedSimulatorRoute(new URL("https://tcg.online/cyberpunk/simulator/practice")),
    ).toMatchObject({
      gameSlug: "cyberpunk",
      routeKind: "practice-vs-ai",
    });

    expect(
      parseSharedSimulatorRoute(new URL("https://tcg.online/gundam/simulator/match/m1?gameId=g1")),
    ).toEqual({
      gameSlug: "gundam",
      routeKind: "live-match",
      matchId: "m1",
      gameId: "g1",
    });
  });

  test("normalizes premium support status without making UI parse tier names", () => {
    expect(participantIsPremium({ id: "p1", seat: 0, displayName: "A", isPremium: true })).toBe(
      true,
    );
    expect(
      participantIsPremium({
        id: "p1",
        seat: 0,
        displayName: "A",
        subscriptionTier: "supporter",
      }),
    ).toBe(true);
    expect(participantIsPremium({ id: "p1", seat: 0, displayName: "A" })).toBe(false);
  });

  test("fetches live-match data from typed framework route params", async () => {
    const fetcher = vi.fn(async () =>
      Response.json({
        schemaVersion: 2,
        phase: "playing",
        revision: 0,
        match: {
          matchId: "m1",
          gameType: "gundam",
          format: "best_of_1",
          matchType: "casual",
          status: "in_progress",
          participants: [],
          gameIds: ["g1"],
        },
        game: {
          gameId: "g1",
          gameNumber: 1,
          status: "in_progress",
          authority: "server",
          stateVersion: 1,
          view: {},
          resources: { cardsMaps: { cardInstances: {}, owners: {} } },
        },
        viewer: {
          role: "spectator",
          spectatorId: "s1",
          permissions: spectatorPermissions(),
        },
        capabilities: liveCapabilities(),
        presence: { players: [] },
        history: { recentMoves: [], engineLogs: [] },
        realtime: {
          wsUrl: "wss://gateway.tcg.online",
          ticket: "ticket_1",
          reconnectToken: "reconnect_1",
          expiresAt: "2026-07-22T01:00:00.000Z",
          protocolVersion: 2,
        },
      }),
    );

    const data = await fetchSharedSimulatorRouteDataForRoute({
      request: new Request("https://tcg.online/gundam/simulator/matches/m1/games/g1"),
      route: {
        gameSlug: "gundam",
        routeKind: "live-match",
        matchId: "m1",
        gameId: "g1",
      },
      fetcher,
    });

    expect((fetcher.mock.calls as unknown as Array<[string]>)[0]?.[0]).toBe(
      "https://api.tcg.online/v1/games/gundam/play/matches/m1/games/g1/session",
    );
    expect(data.routeKind).toBe("live-match");
    expect(data.session && liveGameFromSession(data.session)?.game.gameId).toBe("g1");
  });

  test("accepts the canonical live-match bootstrap for a seated player", async () => {
    const fetcher = vi.fn(async () =>
      Response.json({
        schemaVersion: 2,
        phase: "playing",
        revision: 0,
        match: {
          matchId: "m1",
          gameType: "riftbound",
          format: "best_of_1",
          matchType: "private",
          status: "in_progress",
          participants: [
            {
              id: "p1",
              seat: 1,
              displayName: "Player One",
            },
            {
              id: "p2",
              seat: 2,
              displayName: "Player Two",
            },
          ],
          gameIds: ["g1"],
        },
        game: {
          gameId: "g1",
          gameNumber: 1,
          status: "in_progress",
          authority: "client",
          stateVersion: 0,
          view: null,
        },
        viewer: {
          role: "player",
          actorId: "p1",
          userId: "u1",
          seat: 1,
          permissions: playerPermissions(),
        },
        capabilities: liveCapabilities(),
        presence: { players: [] },
        history: { recentMoves: [], engineLogs: [] },
        realtime: {
          wsUrl: "wss://gateway.tcg.online/riftbound",
          ticket: "ticket_1",
          reconnectToken: "reconnect_1",
          expiresAt: "2026-07-22T01:00:00.000Z",
          protocolVersion: 2,
        },
      }),
    );

    const data = await fetchSharedSimulatorRouteDataForRoute({
      request: new Request(
        "https://tcg.online/riftbound/simulator/matches/m1/games/g1?playerId=p1",
      ),
      route: {
        gameSlug: "riftbound",
        routeKind: "live-match",
        matchId: "m1",
        gameId: "g1",
      },
      fetcher,
    });

    expect(data.session).toMatchObject({
      viewer: { role: "player", actorId: "p1", seat: 1 },
      match: {
        participants: [
          { id: "p1", seat: 1, displayName: "Player One" },
          { id: "p2", seat: 2, displayName: "Player Two" },
        ],
      },
      game: { authority: "client", stateVersion: 0, view: null },
    });
  });

  test("loads one authoritative session without a second preparation request", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        Response.json({
          schemaVersion: 2,
          phase: "playing",
          revision: 0,
          match: {
            matchId: "m1",
            gameType: "gundam",
            format: "best_of_1",
            matchType: "casual",
            status: "in_progress",
            participants: [],
            gameIds: ["g1"],
          },
          game: {
            gameId: "g1",
            gameNumber: 1,
            status: "in_progress",
            authority: "server",
            stateVersion: 1,
            view: {},
            resources: { cardsMaps: { cardInstances: {}, owners: {} } },
          },
          viewer: {
            role: "spectator",
            spectatorId: "s1",
            permissions: spectatorPermissions(),
          },
          capabilities: liveCapabilities(),
          presence: { players: [] },
          history: { recentMoves: [], engineLogs: [] },
          realtime: {
            wsUrl: "wss://gateway.tcg.online",
            ticket: "ticket_1",
            reconnectToken: "reconnect_1",
            expiresAt: "2026-07-22T01:00:00.000Z",
            protocolVersion: 2,
          },
        }),
      )
      .mockRejectedValueOnce(new TypeError("fetch failed"));

    const data = await fetchSharedSimulatorRouteDataForRoute({
      request: new Request("https://tcg.online/gundam/simulator/matches/m1/games/g1"),
      route: {
        gameSlug: "gundam",
        routeKind: "live-match",
        matchId: "m1",
        gameId: "g1",
      },
      fetcher,
    });

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(data).toMatchObject({
      error: null,
      session: { game: { gameId: "g1" } },
    });
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
});

function liveCapabilities() {
  return {
    actions: true,
    chat: true,
    proposals: true,
    manualControls: true,
    spectating: true,
    conceding: true,
    replay: false,
  };
}

function playerPermissions() {
  return {
    act: true,
    chat: true,
    propose: true,
    useManualControls: true,
    concede: true,
    spectate: false,
    viewReplay: false,
    downloadReplay: false,
    forkReplay: false,
  };
}

function spectatorPermissions() {
  return {
    ...playerPermissions(),
    act: false,
    chat: false,
    propose: false,
    useManualControls: false,
    concede: false,
    spectate: true,
  };
}
import { makeSimulatorRouteLoader } from "../routes/simulator-route-loader";
import { RouterContextProvider } from "react-router";
