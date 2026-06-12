import { describe, expect, test } from "vitest";
import {
  buildLiveMatchGameHref,
  resolveMatchOverviewDestination,
  resolveSeriesDestination,
  type LiveMatchContext,
  type LiveMatchOverview,
} from "./matchContext";

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
