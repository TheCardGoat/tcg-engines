import { afterEach, describe, expect, it, mock } from "bun:test";
import type {
  LiveMatchBootstrapV1,
  ResolvedMatchViewer,
  ScopedRealtimeAccess,
} from "@tcg/game-page-contract";
import {
  createLiveMatchCredentialsController,
  refreshLiveMatchRealtimeAccess,
} from "./live-match-credentials.js";

function access(ticket: string, reconnectToken: string): ScopedRealtimeAccess {
  return {
    wsUrl: "wss://gateway.tcg.online/lorcana",
    ticket,
    reconnectToken,
    expiresAt: new Date(Date.now() + 60_000).toISOString(),
    protocolVersion: 2,
  };
}

describe("live match gateway credentials", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("replaces an expired scoped token with genuinely fresh bootstrap credentials", async () => {
    const initial = access("initial-ticket", "expired-scope");
    const refreshed = access("fresh-ticket", "fresh-scope");
    const refresh = mock(async () => refreshed);
    const controller = createLiveMatchCredentialsController(initial, refresh);

    expect(controller.get()).toEqual({
      ticket: "initial-ticket",
      token: "expired-scope",
      expiresAt: Date.parse(initial.expiresAt),
      requireAuth: true,
    });

    await expect(controller.refresh()).resolves.toEqual({
      ticket: "fresh-ticket",
      token: "fresh-scope",
      expiresAt: Date.parse(refreshed.expiresAt),
      requireAuth: true,
    });
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(controller.get()).toEqual({
      ticket: "fresh-ticket",
      token: "fresh-scope",
      expiresAt: Date.parse(refreshed.expiresAt),
      requireAuth: true,
    });
  });

  it("keeps the previous credentials when the authorized bootstrap refresh fails", async () => {
    const initial = access("initial-ticket", "current-scope");
    const controller = createLiveMatchCredentialsController(initial, async () => {
      throw new Error("unauthorized");
    });

    await expect(controller.refresh()).rejects.toThrow("unauthorized");
    expect(controller.get()).toEqual({
      ticket: "initial-ticket",
      token: "current-scope",
      expiresAt: Date.parse(initial.expiresAt),
      requireAuth: true,
    });
  });

  it("refetches the canonical bootstrap with cookies and returns its fresh scoped access", async () => {
    const expectedViewer = playerViewer();
    const refreshed = access("fresh-ticket", "fresh-scope");
    const fetchMock = mock(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      Response.json(bootstrap(expectedViewer, refreshed), { status: 200 }),
    );
    globalThis.fetch = fetchMock as unknown as typeof fetch;

    await expect(
      refreshLiveMatchRealtimeAccess({
        matchId: "match/1",
        gameId: "game 1",
        expectedViewer,
      }),
    ).resolves.toEqual(refreshed);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      "http://localhost:3000/v1/games/lorcana/play/matches/match%2F1/games/game%201/context",
    );
    expect(fetchMock.mock.calls[0]?.[1]).toMatchObject({
      method: "GET",
      credentials: "include",
    });
  });

  it("rejects refreshed credentials if the authorized bootstrap changes player identity", async () => {
    const expectedViewer = playerViewer();
    const changedViewer = { ...expectedViewer, actorId: "other-player" };
    globalThis.fetch = mock(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      Response.json(bootstrap(changedViewer, access("fresh-ticket", "fresh-scope")), {
        status: 200,
      }),
    ) as unknown as typeof fetch;

    await expect(
      refreshLiveMatchRealtimeAccess({
        matchId: "match/1",
        gameId: "game 1",
        expectedViewer,
      }),
    ).rejects.toThrow("changed the player identity");
  });

  it("allows a permitted anonymous spectator bootstrap to rotate its request-local id", async () => {
    const expectedViewer = spectatorViewer("spectator-before");
    const refreshed = access("spectator-ticket", "spectator-scope");
    globalThis.fetch = mock(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      Response.json(bootstrap(spectatorViewer("spectator-after"), refreshed), {
        status: 200,
      }),
    ) as unknown as typeof fetch;

    await expect(
      refreshLiveMatchRealtimeAccess({
        matchId: "match/1",
        gameId: "game 1",
        expectedViewer,
      }),
    ).resolves.toEqual(refreshed);
  });
});

function playerViewer(): Extract<ResolvedMatchViewer, { role: "player" }> {
  return {
    role: "player",
    actorId: "player-1",
    seat: 1,
    userId: "user-1",
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
  };
}

function spectatorViewer(spectatorId: string): Extract<ResolvedMatchViewer, { role: "spectator" }> {
  return {
    role: "spectator",
    spectatorId,
    permissions: {
      act: false,
      chat: false,
      propose: false,
      useManualControls: false,
      concede: false,
      spectate: true,
      viewReplay: false,
      downloadReplay: false,
      forkReplay: false,
    },
  };
}

function bootstrap(
  viewer: ResolvedMatchViewer,
  realtime: ScopedRealtimeAccess,
): LiveMatchBootstrapV1 {
  return {
    schemaVersion: 1,
    match: {
      matchId: "match/1",
      gameType: "lorcana",
      format: "core-constructed",
      matchType: "practice_vs_bot",
      status: "in_progress",
      participants: [
        { id: "player-1", seat: 1, displayName: "Player" },
        { id: "bot-1", seat: 2, displayName: "Bot", isBot: true },
      ],
      gameIds: ["game 1"],
    },
    game: {
      gameId: "game 1",
      gameNumber: 1,
      status: "in_progress",
      authority: "client",
      stateVersion: 1,
      view: {},
    },
    viewer,
    capabilities: {
      actions: true,
      chat: true,
      proposals: true,
      manualControls: true,
      spectating: false,
      conceding: true,
      replay: false,
    },
    presence: {
      players: [
        { id: "player-1", connected: true },
        { id: "bot-1", connected: true },
      ],
    },
    history: { recentMoves: [], engineLogs: [] },
    realtime,
  };
}
