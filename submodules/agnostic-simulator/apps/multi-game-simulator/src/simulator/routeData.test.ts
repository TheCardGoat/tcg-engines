import { describe, expect, test, vi } from "vitest";

import {
  fetchSharedSimulatorRouteDataForRoute,
  parseSharedSimulatorRoute,
  participantIsPremium,
} from "./routeData";

describe("shared simulator route data", () => {
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
          state: {},
          cardsMaps: { cardInstances: {}, owners: {} },
        },
        viewerSeat: "spectator",
        realtime: {
          wsUrl: "wss://gateway.tcg.online",
          ticket: "ticket_1",
          protocolVersion: 1,
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

    expect(fetcher.mock.calls[0]?.[0]).toBe(
      "https://gundam-api.tcg.online/v1/games/gundam/play/matches/m1/games/g1/context",
    );
    expect(data.routeKind).toBe("live-match");
    expect(data.matchPageData?.game.gameId).toBe("g1");
  });
});
