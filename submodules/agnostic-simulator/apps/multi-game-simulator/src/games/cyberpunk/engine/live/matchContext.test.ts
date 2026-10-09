import { describe, expect, test } from "vitest";
import { P1, P2, privateField } from "@tcg/cyberpunk-engine";
import { buildCyberpunkInteractionView } from "@tcg/cyberpunk-server-adapter/interaction-protocol";
import {
  composeCanonicalMoveLogForViewer,
  createCanonicalEngineMoveLog,
  createEngineLogMessage,
} from "@tcg/shared/game-engine";
import type { LiveMatchBootstrapV1 } from "@tcg/game-page-contract";
import { DEFAULT_SCENARIO, getScenario } from "../fixtures/scenarios";
import { projectMoveLogEntries } from "../moveLogProjection";
import { prepareLiveContext } from "./liveMessages";
import {
  buildLiveMatchGameHref,
  getMatchmakingReturnUrl,
  liveMatchContextFromBootstrap,
  normalizeRemoteMoveLog,
  projectLiveStateForSimulator,
  projectLiveValueForSimulator,
  projectSimulatorStateForLive,
  resolveMatchOverviewDestination,
  type LiveMatchOverview,
} from "./matchContext.js";

const basename = "/cyberpunk/simulator/";

describe("live match route destinations", () => {
  test.each(["undoToTurnStart", "rewindToTurnStart"])(
    "normalizes hosted %s logs to a turn-start undo entry",
    (moveType) => {
      const moveLog = normalizeRemoteMoveLog({
        moveType,
        playerId: String(P1),
        timestamp: 1,
        turnNumber: 3,
        public: [{ key: "cyberpunk.move.rewindToTurnStart", values: { scope: "turnStart" } }],
      });
      expect(moveLog).toEqual({
        type: "undo",
        scope: "turnStart",
        playerId: String(P1),
        timestamp: 1,
        turnNumber: 3,
      });

      if (!moveLog) {
        throw new Error("Expected hosted turn-start undo log to normalize");
      }
      const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
      expect(
        projectMoveLogEntries(matchState, [{ id: 1, side: "player", log: moveLog }], "player")[0]
          ?.message,
      ).toBe("Rewound to the start of turn 3.");
    },
  );

  test("keeps public draw facts when the card names are private to the viewer", () => {
    const drawLog = normalizeRemoteMoveLog({
      moveType: "action",
      playerId: String(P1),
      timestamp: 1,
      turnNumber: 1,
      public: [
        {
          key: "cyberpunk.effect.draw.resolved",
          values: {
            messageKey: "effect.draw.resolved",
            params: {
              sourceCardName: "Panam Palmer: Strength Through Family",
              drawnCount: 2,
            },
          },
        },
        {
          key: "cyberpunk.effect.draw.resolved",
          values: {
            messageKey: "effect.draw.resolved",
            params: { drawnCardNames: "Fool on the Hill, MaxTac Squadron" },
          },
        },
      ],
    });

    expect(drawLog).toMatchObject({
      type: "action",
      messageKey: "effect.draw.resolved",
      params: {
        sourceCardName: "Panam Palmer: Strength Through Family",
        drawnCount: 2,
        drawnCardNames: "Fool on the Hill, MaxTac Squadron",
      },
    });
  });

  test("shows hosted search names to the searcher and only the count to the rival", () => {
    const canonical = createCanonicalEngineMoveLog({
      moveType: "searchDeck",
      playerId: String(P1),
      timestamp: 1,
      turnNumber: 1,
      messages: [
        createEngineLogMessage({
          key: "cyberpunk.move.searchDeck",
          values: {
            revealedCount: 2,
            revealedCardNames: privateField(["Mantis Blades", "Floor It"], [P1]),
          },
        }),
      ],
    });
    const matchState = getScenario(DEFAULT_SCENARIO).build().getState();
    const messageFor = (viewer: typeof P1, side: "player" | "opponent") => {
      const normalized = normalizeRemoteMoveLog(
        composeCanonicalMoveLogForViewer(canonical, viewer),
      );
      if (!normalized) throw new Error("Expected search log to normalize");
      return projectMoveLogEntries(
        matchState,
        [{ id: 1, side: "player", log: normalized }],
        side,
      )[0];
    };

    expect(canonical.public[0]?.values).not.toHaveProperty("revealedCardNames");
    expect(messageFor(P1, "player")?.message).toBe(
      "Revealed the top 2 cards of the deck: Mantis Blades, Floor It.",
    );
    expect(messageFor(P2, "opponent")?.message).toBe("Revealed the top 2 cards of the deck.");
    expect(messageFor(P2, "opponent")?.cardRefs).toBeUndefined();
  });

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

  test("builds live game hrefs under the current simulator mount", () => {
    expect(buildLiveMatchGameHref("match 1", "game 2", "?playerId=p1")).toBe(
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
          {
            id: String(P1),
            seat: 1,
            displayName: "Seat One",
            visualSettings: { playmatId: "maelstrom", cardBackId: "goat-classic" },
          },
          { id: String(P2), seat: 2, displayName: "Seat Two", subscriptionTier: "tier3" },
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
      history: {
        recentMoves: [],
        engineLogs: [
          {
            tag: "engine_log",
            data: {
              moveType: "keepHand",
              playerId: String(P1),
              timestamp: 1,
              turnNumber: 1,
              public: [],
            },
            ts: 1,
          },
        ],
        chatMessages: [],
      },
    } satisfies LiveMatchBootstrapV1;

    const context = prepareLiveContext(liveMatchContextFromBootstrap(bootstrap));
    expect(
      context.match.participants?.find((participant) => participant.id === String(P2))
        ?.subscriptionTier,
    ).toBe("tier3");
    expect(
      context.match.participants?.find((participant) => participant.id === String(P1))?.playmatId,
    ).toBe("maelstrom");
    expect(
      context.match.participants?.find((participant) => participant.id === String(P1))?.cardBackId,
    ).toBe("goat-classic");

    // Bootstrap engine-log entries must arrive wrapped as { timestamp, log }
    // records so the page's engine-log parser (which requires a .log object)
    // keeps them instead of dropping every history entry.
    expect(context.history?.engineLogs).toEqual([
      {
        timestamp: 1,
        log: {
          moveType: "keepHand",
          playerId: String(P1),
          timestamp: 1,
          turnNumber: 1,
          public: [],
        },
      },
    ]);
    for (const record of context.history?.engineLogs ?? []) {
      expect(record).toMatchObject({ log: expect.any(Object) });
    }

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

    const betweenGamesContext = liveMatchContextFromBootstrap({
      ...bootstrap,
      match: {
        ...bootstrap.match,
        status: "waiting",
        currentGameId: "game-next",
        gameIds: [bootstrap.game.gameId, "game-next"],
      },
      game: {
        ...bootstrap.game,
        status: "completed",
      },
    });

    expect(betweenGamesContext.match.currentGameId).toBe("game-next");
    expect(betweenGamesContext.match.status).toBe("waiting");
    expect(betweenGamesContext.game.status).toBe("completed");
    expect(() =>
      liveMatchContextFromBootstrap({
        ...bootstrap,
        match: { ...bootstrap.match, status: "waiting" },
      }),
    ).toThrow("before the match starts");

    const completedContext = prepareLiveContext(
      liveMatchContextFromBootstrap({
        ...bootstrap,
        match: {
          ...bootstrap.match,
          status: "completed",
          winnerId: String(P2),
        },
        game: {
          ...bootstrap.game,
          status: "completed",
        },
      }),
    );

    expect(completedContext.game.state?.G.gameEnded).toBe(true);
    expect(completedContext.game.state?.G.winnerId).toBe(P1);
  });
});
