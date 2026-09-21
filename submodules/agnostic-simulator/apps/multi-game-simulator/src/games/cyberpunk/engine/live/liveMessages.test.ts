import { describe, expect, test } from "vitest";
import { liveGatewayJoinFromEvent, reduceLiveGatewayMessage } from "./liveMessages.js";
import type { LiveGatewayMessage } from "./liveGateway.js";
import type { LiveMatchContext } from "./matchContext.js";

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
      href: "/cyberpunk/simulator/matches/match%201/games/game%202",
    });
  });

  test("seats a player from the raw game_joined envelope", () => {
    expect(
      liveGatewayJoinFromEvent("game_joined", {
        gameId: "game 1",
        role: "player",
        stateVersion: 1,
        presentation: { kind: "not-a-real-envelope" },
      }),
    ).toEqual({ gameId: "game 1", role: "player" });
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
