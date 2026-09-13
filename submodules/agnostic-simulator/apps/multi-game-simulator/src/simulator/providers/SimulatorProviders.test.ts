import { describe, expect, test } from "vitest";
import type { SharedSimulatorRouteData } from "../routeData";

import { buildSimulatorProviderValues } from "./SimulatorProviders";

const routeData: SharedSimulatorRouteData = {
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
    userSettings: {
      locale: "en-US",
      reducedMotion: true,
    },
  },
};

describe("SimulatorProviders", () => {
  test("organizes server-loaded simulator data into concept-specific values", () => {
    const values = buildSimulatorProviderValues({
      auth: {
        user: {
          id: "u1",
          name: "Account",
          displayUsername: "Player",
          emailVerified: true,
          role: "user",
          subscriptionTier: "tier2",
          createdAt: new Date(0),
          updatedAt: new Date(0),
        },
        session: {
          id: "s1",
          userId: "u1",
          token: "token",
          expiresAt: new Date(1),
          createdAt: new Date(0),
          updatedAt: new Date(0),
        },
      },
      gameSlug: "cyberpunk",
      gatewayTicket: { ticket: "ticket", authToken: "auth-token" },
      simulatorRouteData: routeData,
      viewerSettings: {
        playerSettings: { animationSpeed: "fast" },
        gameSettings: {
          cyberpunk: { visual: { cardBackId: "neon" } },
        },
      },
      rootSocketReady: true,
    });

    expect(values.route.routeKind).toBe("live-match");
    expect(values.auth).toMatchObject({
      userId: "u1",
      displayName: "Player",
      isAuthenticated: true,
      isPremium: true,
    });
    expect(values.runtime).toMatchObject({
      gameSlug: "cyberpunk",
      rootSocketReady: true,
    });
    expect(values.match.match?.matchId).toBe("m1");
    expect(values.game.game?.gameId).toBe("g1");
    expect(values.players.currentPlayer).toMatchObject({ isPremium: true, mmr: 1510 });
    expect(values.players.opponentPlayer).toMatchObject({ isPremium: true, mmr: 1490 });
    expect(values.userSettings.userSettings).toBeNull();
    expect(values.userSettings.viewerSettings).toMatchObject({
      playerSettings: { animationSpeed: "fast" },
      gameSettings: { cyberpunk: { visual: { cardBackId: "neon" } } },
    });
    expect(values.diagnostics).toMatchObject({
      matchId: "m1",
      gameId: "g1",
      error: null,
    });
  });
});
