import { describe, expect, test } from "vitest";
import { P1, P2 } from "@tcg/cyberpunk-engine";
import { buildCyberpunkInteractionView } from "@tcg/cyberpunk-server-adapter/interaction-protocol";
import type { LiveMatchBootstrapV1 } from "@tcg/game-page-contract";
import { DEFAULT_SCENARIO, getScenario } from "../fixtures/scenarios";
import { prepareLiveContext } from "./liveMessages";
import {
  buildLiveMatchGameHref,
  getMatchmakingReturnUrl,
  liveMatchContextFromBootstrap,
  projectLiveStateForSimulator,
  projectLiveValueForSimulator,
  projectSimulatorStateForLive,
  resolveMatchOverviewDestination,
  resolveSeriesDestination,
  type LiveMatchContext,
  type LiveMatchOverview,
} from "./matchContext.js";

const basename = "/cyberpunk/simulator/";

describe("live match route destinations", () => {
  test("preserves the mount and removes browser-selected identity from match redirects", () => {
    const overview = {
      object: "match",
      matchId: "match 1",
      status: "in_progress",
      currentGameId: "game 2",
      gameIds: ["game 1", "game 2"],
    } satisfies LiveMatchOverview;

    expect(resolveMatchOverviewDestination(overview, "?playerId=p1", basename)).toEqual({
      type: "game",
      href: "/cyberpunk/simulator/matches/match%201/games/game%202",
    });
  });

  test("preserves the mount and removes browser-selected identity from series redirects", () => {
    const context = liveMatchContext({
      matchId: "match 1",
      currentGameId: "game 2",
      gameId: "game 1",
    });

    expect(resolveSeriesDestination(context, "?playerId=p1", basename)).toEqual({
      type: "nextGame",
      href: "/cyberpunk/simulator/matches/match%201/games/game%202",
    });
  });

  test("builds live game hrefs under the current simulator mount", () => {
    expect(buildLiveMatchGameHref("match 1", "game 2", "?playerId=p1", basename)).toBe(
      "/cyberpunk/simulator/matches/match%201/games/game%202",
    );
  });

  test("preserves the staging matchmaking return target", () => {
    const staging = "https://staging.cardgoat.org/cyberpunk/matchmaking";
    expect(getMatchmakingReturnUrl("cyberpunk", `?returnTo=${encodeURIComponent(staging)}`)).toBe(
      staging,
    );
  });

  test("maps the viewing player to P1 even when they occupy server seat two", () => {
    const localState = getScenario(DEFAULT_SCENARIO).build().getState();
    const serverState = projectSimulatorStateForLive(localState, {
      player: "server-seat-one",
      opponent: "server-seat-two",
    });
    const projected = projectLiveStateForSimulator(serverState, {
      player: "server-seat-two",
      opponent: "server-seat-one",
    });

    expect(projected.ctx.playerIds).toEqual([P1, P2]);
    expect(projected.G.players[String(P1)]).toEqual(localState.G.players[String(P2)]);
    expect(projected.G.players[String(P2)]).toEqual(localState.G.players[String(P1)]);
    expect(projected.G.turnMetadata.activePlayerId).toBe(
      localState.G.turnMetadata.activePlayerId === P1 ? P2 : P1,
    );
  });

  test("maps authoritative animation zone owners into viewer-relative player ids", () => {
    const localState = getScenario(DEFAULT_SCENARIO).build().getState();
    const serverState = projectSimulatorStateForLive(localState, {
      player: "server-seat-two",
      opponent: "server-seat-one",
    });
    const projected = projectLiveValueForSimulator(
      {
        id: "draw",
        version: 2,
        steps: [
          {
            id: "draw-card",
            type: "entityTransfer",
            entity: { kind: "entity", id: "card-1" },
            from: { kind: "zone", id: "deck", ownerId: "server-seat-one" },
            to: { kind: "zone", id: "hand", ownerId: "server-seat-one" },
            sourceFace: "hidden",
            destinationFace: "hidden",
          },
        ],
      },
      serverState,
      { player: "server-seat-two", opponent: "server-seat-one" },
    );

    expect(projected.steps[0]).toMatchObject({
      from: { ownerId: String(P2) },
      to: { ownerId: String(P2) },
    });
  });

  test("maps a seat-two bootstrap and its authoritative interactions to the local side", () => {
    const source = getScenario(DEFAULT_SCENARIO).build();
    const sourceState = source.getState();
    const bootstrap = {
      schemaVersion: 1,
      match: {
        matchId: "match-seat-two",
        gameType: "cyberpunk",
        format: "best_of_1",
        matchType: "ranked",
        status: "in_progress",
        participants: [
          { id: String(P1), seat: 1, displayName: "Seat One" },
          { id: String(P2), seat: 2, displayName: "Seat Two" },
        ],
        gameIds: ["game-seat-two"],
      },
      game: {
        gameId: "game-seat-two",
        gameNumber: 1,
        status: "in_progress",
        authority: "server",
        stateVersion: sourceState.ctx.stateID,
        view: source.getFilteredView(P2),
        interactionView: buildCyberpunkInteractionView({
          actorId: P2,
          stateVersion: sourceState.ctx.stateID,
          prompt: source.getPrompt(P2),
          state: sourceState,
        }),
      },
      viewer: {
        role: "player",
        actorId: String(P2),
        seat: 2,
        userId: "user-seat-two",
        permissions: {
          act: true,
          chat: true,
          propose: true,
          useManualControls: false,
          concede: true,
          spectate: false,
          viewReplay: false,
          downloadReplay: false,
          forkReplay: false,
        },
      },
      capabilities: {
        actions: true,
        chat: true,
        proposals: true,
        manualControls: false,
        spectating: true,
        conceding: true,
        replay: false,
      },
      presence: {
        players: [
          { id: String(P1), connected: true },
          { id: String(P2), connected: true },
        ],
      },
      history: { recentMoves: [], engineLogs: [], chatMessages: [] },
    } satisfies LiveMatchBootstrapV1;

    const context = prepareLiveContext(liveMatchContextFromBootstrap(bootstrap));

    expect(context.game.actorIds).toEqual({ player: String(P2), opponent: String(P1) });
    expect(context.game.state?.ctx.playerIds).toEqual([P1, P2]);
    expect(context.game.interactionView?.actorId).toBe(String(P1));
    expect(Array.isArray(context.game.viewerProjection?.players[String(P1)]?.zones.hand)).toBe(
      true,
    );
    expect(typeof context.game.viewerProjection?.players[String(P2)]?.zones.hand).toBe("number");
    expect(context.game.state?.G.players[String(P1)]?.firstPlayer).toBe(
      sourceState.G.players[String(P2)]?.firstPlayer,
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
