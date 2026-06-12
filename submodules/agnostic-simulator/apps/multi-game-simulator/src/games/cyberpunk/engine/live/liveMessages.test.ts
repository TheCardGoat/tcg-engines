import { describe, expect, test } from "vitest";
import { reduceLiveGatewayMessage } from "./liveMessages";
import type { LiveGatewayMessage } from "./liveGateway";
import type { LiveMatchContext } from "./matchContext";

describe("live gateway message reducer", () => {
  test("preserves the mounted simulator basename when match state advances to the next game", () => {
    const effect = reduceLiveGatewayMessage(
      liveMatchContext(),
      {
        type: "match_state",
        matchId: "match 1",
        status: "in_progress",
        player1Score: 1,
        player2Score: 0,
        currentGameId: "game 2",
        gameIds: ["game 1", "game 2"],
      } as LiveGatewayMessage,
      {
        matchId: "match 1",
        gameId: "game 1",
        search: "?playerId=p1",
        basename: "/cyberpunk/simulator/",
      },
    );

    expect(effect).toEqual({
      type: "redirect",
      href: "/cyberpunk/simulator/matches/match%201/games/game%202?playerId=p1",
    });
  });
});

function liveMatchContext(): LiveMatchContext {
  return {
    match: {
      matchId: "match 1",
      status: "in_progress",
      format: "best_of_3",
      currentGameId: "game 1",
      gameIds: ["game 1", "game 2"],
    },
    game: {
      gameId: "game 1",
      gameNumber: 1,
      status: "completed",
      authority: "server",
      state: null,
      version: 1,
    },
  };
}
