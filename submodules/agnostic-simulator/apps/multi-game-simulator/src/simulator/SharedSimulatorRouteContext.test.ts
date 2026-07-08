import { describe, expect, test } from "vitest";
import type { SharedSimulatorRouteData } from "./routeData";

import { buildSharedSimulatorRouteContext } from "./SharedSimulatorRouteContext";

describe("SharedSimulatorRouteContext", () => {
  test("derives current and opponent player metadata from shared match page data", () => {
    const data: SharedSimulatorRouteData = {
      gameSlug: "cyberpunk",
      routeKind: "live-match",
      matchId: "m1",
      gameId: "g1",
      matchResolution: null,
      error: null,
      matchPageData: {
        viewerSeat: 0,
        realtime: {
          wsUrl: "wss://gateway.example.test",
          ticket: "ticket",
          protocolVersion: 1,
        },
        match: {
          matchId: "m1",
          gameType: "cyberpunk",
          format: "constructed",
          matchType: "ranked",
          status: "in_progress",
          gameIds: ["g1"],
          participants: [
            {
              id: "p1",
              seat: 0,
              userId: "u1",
              displayName: "Current",
              mmrAtMatch: 1510,
              isPremium: true,
            },
            {
              id: "p2",
              seat: 1,
              userId: "u2",
              displayName: "Opponent",
              mmrAtMatch: 1490,
              subscriptionTier: "supporter",
            },
          ],
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
      },
    };

    const context = buildSharedSimulatorRouteContext(data);

    expect(context.currentPlayer.participant?.id).toBe("p1");
    expect(context.currentPlayer.isPremium).toBe(true);
    expect(context.currentPlayer.mmr).toBe(1510);
    expect(context.opponentPlayer.participant?.id).toBe("p2");
    expect(context.opponentPlayer.isPremium).toBe(true);
    expect(context.opponentPlayer.mmr).toBe(1490);
  });
});
