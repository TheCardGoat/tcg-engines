import { describe, expect, test } from "vitest";
import {
  liveGatewayJoinFromEvent,
  parseGatewayEvent,
  reduceLiveGatewayMessage,
} from "./liveMessages.js";
import type { LiveGatewayMessage } from "./liveGateway.js";
import type { LiveMatchContext } from "./matchContext.js";

describe("live gateway message reducer", () => {
  test("keeps the completed game open when the series advances", () => {
    const ended = reduceLiveGatewayMessage(
      liveMatchContext(),
      {
        type: "game_ended",
        gameId: "game 1",
        matchId: "match 1",
        matchCompleted: false,
        nextGameId: "game 2",
        player1Score: 1,
        player2Score: 0,
      } as LiveGatewayMessage,
      { gameId: "game 1" },
    );
    expect(ended).toMatchObject({
      type: "state",
      context: {
        game: { gameId: "game 1", status: "completed" },
        match: { currentGameId: "game 2" },
      },
    });
    if (ended.type !== "state") throw new Error("Expected the finished game context");

    const effect = reduceLiveGatewayMessage(
      ended.context,
      {
        type: "match_state",
        matchId: "match 1",
        status: "in_progress",
        player1Score: 1,
        player2Score: 0,
        currentGameId: "game 2",
        gameIds: ["game 1", "game 2"],
      } as LiveGatewayMessage,
      { gameId: "game 1" },
    );

    expect(effect).toMatchObject({
      type: "state",
      context: {
        game: { gameId: "game 1", status: "completed" },
        match: { currentGameId: "game 2", player1Score: 1, player2Score: 0 },
      },
    });
  });

  test("does not redirect a delayed nonterminal update that names the next game", () => {
    const context = liveMatchContext();
    context.game.status = "completed";
    expect(
      reduceLiveGatewayMessage(
        context,
        {
          type: "match_state",
          matchId: "match 1",
          status: "in_progress",
          currentGameId: "game 2",
          gameIds: ["game 1", "game 2"],
        } as LiveGatewayMessage,
        { gameId: "game 1" },
      ),
    ).toMatchObject({ type: "state", context: { match: { currentGameId: "game 2" } } });
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

  test("applies the actor-scoped command response without waiting for its broadcast", () => {
    const state = {
      G: {
        gameEnded: false,
        winnerId: null,
      },
      ctx: {
        stateID: 2,
        playerIds: ["player-1", "player-2"],
      },
    };

    const message = parseGatewayEvent("submit_interaction:response", {
      correlationId: "choose-first-player",
      status: "ok",
      data: {
        gameId: "game 1",
        stateVersion: 2,
        patches: [],
        engineLogs: [],
        animationPlan: null,
        state,
        moveType: "interaction:resolveFirstPlayer",
        actorId: "player-1",
        correlationId: "stale-inner-correlation",
      },
    });

    expect(message).toMatchObject({
      type: "move_accepted",
      gameId: "game 1",
      stateVersion: 2,
      state,
      actorId: "player-1",
      correlationId: "choose-first-player",
    });
    if (!message) {
      throw new Error("Expected a move_accepted message");
    }

    expect(
      reduceLiveGatewayMessage(liveMatchContext(), message, { gameId: "game 1" }),
    ).toMatchObject({
      type: "state",
      context: {
        game: {
          state: {
            G: state.G,
          },
          version: 2,
        },
      },
    });
  });

  test("parses the current unicast move_accepted snapshot", () => {
    const state = {
      G: { gameEnded: false, winnerId: null },
      ctx: { stateID: 2, playerIds: ["player-1", "player-2"] },
    };

    expect(
      parseGatewayEvent("move_accepted", {
        gameId: "game 1",
        stateVersion: 2,
        patches: [],
        engineLogs: [],
        animationPlan: null,
        state,
        moveType: "interaction:resolveFirstPlayer",
        actorId: "player-1",
        correlationId: "choose-first-player",
      }),
    ).toMatchObject({
      type: "move_accepted",
      gameId: "game 1",
      stateVersion: 2,
      state,
      correlationId: "choose-first-player",
    });
  });

  test("does not treat a rejected command response as authoritative state", () => {
    expect(
      parseGatewayEvent("submit_interaction:response", {
        correlationId: "rejected-move",
        status: "err",
        data: {
          gameId: "game 1",
          code: "rejected_stale",
          reason: "State changed",
          currentVersion: 2,
        },
      }),
    ).toBeNull();
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
      status: "in_progress",
      authority: "server",
      state: null,
      version: 1,
    },
  };
}
