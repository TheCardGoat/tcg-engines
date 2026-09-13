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
      session: {
        schemaVersion: 2,
        phase: "playing",
        revision: 0,
        viewer: {
          role: "player",
          actorId: "p1",
          userId: "u1",
          seat: 1,
          permissions: {
            act: true,
            chat: true,
            propose: true,
            useManualControls: true,
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
          manualControls: true,
          spectating: true,
          conceding: true,
          replay: false,
        },
        presence: { players: [] },
        history: { recentMoves: [], engineLogs: [] },
        realtime: {
          wsUrl: "wss://gateway.example.test",
          ticket: "ticket",
          reconnectToken: "reconnect",
          expiresAt: "2026-07-22T01:00:00.000Z",
          protocolVersion: 2,
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
              seat: 1,
              userId: "u1",
              displayName: "Current",
              mmrAtMatch: 1510,
              isPremium: true,
            },
            {
              id: "p2",
              seat: 2,
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
          view: {},
          resources: { cardsMaps: { cardInstances: {}, owners: {} } },
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
