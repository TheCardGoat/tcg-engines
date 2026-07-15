import { describe, expect, test } from "vitest";
import {
  buildLiveMatchGameHref,
  parseLiveMatchContext,
  resolveMatchOverviewDestination,
  resolveSeriesDestination,
  type LiveMatchContext,
  type LiveMatchOverview,
} from "./matchContext.js";

const basename = "/cyberpunk/simulator/";

describe("live match route destinations", () => {
  test("preserves the mounted simulator basename for match overview redirects", () => {
    const overview = {
      object: "match",
      matchId: "match 1",
      status: "in_progress",
      currentGameId: "game 2",
      gameIds: ["game 1", "game 2"],
    } satisfies LiveMatchOverview;

    expect(resolveMatchOverviewDestination(overview, "?playerId=p1", basename)).toEqual({
      type: "game",
      href: "/cyberpunk/simulator/matches/match%201/games/game%202?playerId=p1",
    });
  });

  test("preserves the mounted simulator basename for next-game redirects", () => {
    const context = liveMatchContext({
      matchId: "match 1",
      currentGameId: "game 2",
      gameId: "game 1",
    });

    expect(resolveSeriesDestination(context, "?playerId=p1", basename)).toEqual({
      type: "nextGame",
      href: "/cyberpunk/simulator/matches/match%201/games/game%202?playerId=p1",
    });
  });

  test("builds live game hrefs under the current simulator mount", () => {
    expect(buildLiveMatchGameHref("match 1", "game 2", "?playerId=p1", basename)).toBe(
      "/cyberpunk/simulator/matches/match%201/games/game%202?playerId=p1",
    );
  });
});

describe("parseLiveMatchContext", () => {
  test("preserves live participant profile details for the human match sidebar", () => {
    const context = parseLiveMatchContext({
      object: "game_context",
      match: {
        matchId: "match_1",
        status: "in_progress",
        format: "best_of_1",
        currentGameId: "game_1",
        gameIds: ["game_1"],
        participants: [
          {
            id: "gp_self",
            seat: 1,
            userId: "user_self",
            displayName: "Wazar Testing",
            subscriptionTier: "tier2",
            isMobile: false,
            mmrAtMatch: 1425.4,
            deckName: "Corpo Control",
            deckListId: "dl_self",
          },
          {
            id: "gp_opp",
            seat: 2,
            userId: "user_opp",
            displayName: "MrGMBH",
            subscriptionTier: "free",
            isMobile: true,
            mmrAtMatch: 1510.2,
            deckName: "Mox Pressure",
            deckListId: "dl_opp",
          },
        ],
      },
      game: {
        gameId: "game_1",
        gameNumber: 1,
        status: "in_progress",
        authority: "server",
        player1Id: "gp_self",
        player2Id: "gp_opp",
        state: null,
        version: 4,
      },
    });

    expect(context.match.participants).toEqual([
      expect.objectContaining({
        id: "gp_self",
        seat: 1,
        userId: "user_self",
        displayName: "Wazar Testing",
        subscriptionTier: "tier2",
        isMobile: false,
        mmrAtMatch: 1425.4,
        deckName: "Corpo Control",
        deckListId: "dl_self",
      }),
      expect.objectContaining({
        id: "gp_opp",
        seat: 2,
        userId: "user_opp",
        displayName: "MrGMBH",
        subscriptionTier: "free",
        isMobile: true,
        mmrAtMatch: 1510.2,
        deckName: "Mox Pressure",
        deckListId: "dl_opp",
      }),
    ]);
  });
});

function liveMatchContext({
  matchId,
  currentGameId,
  gameId,
}: {
  matchId: string;
  currentGameId: string;
  gameId: string;
}): LiveMatchContext {
  return {
    match: {
      matchId,
      status: "in_progress",
      format: "best_of_3",
      currentGameId,
      gameIds: [gameId, currentGameId],
    },
    game: {
      gameId,
      gameNumber: 1,
      status: "completed",
      authority: "server",
      state: null,
      version: 1,
    },
  };
}
