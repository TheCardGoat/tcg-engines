import { beforeEach, describe, expect, it, vi } from "vitest";
import { base } from "$app/paths";

const serverJsonMock = vi.fn();
const serverJsonOrNullMock = vi.fn();
const serializeErrorDetailsMock = vi.fn((error: unknown) => ({
  message: error instanceof Error ? error.message : String(error),
}));

class MockServerJsonError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly statusText: string,
    readonly url: string,
  ) {
    super(message);
  }
}

vi.mock("$lib/config/public-url-config.js", () => ({
  getApiOrigin: () => "https://api.lorcanito.test",
}));

vi.mock("$lib/server/fetch-with-cf.js", () => ({
  getServerApiOrigin: () => "http://lorcana-api.internal:8080",
}));

vi.mock("$lib/server/error-details.js", () => ({
  serializeErrorDetails: serializeErrorDetailsMock,
}));

vi.mock("$lib/data/server/server-json.js", () => ({
  ServerJsonError: MockServerJsonError,
  serverJson: serverJsonMock,
  serverJsonOrNull: serverJsonOrNullMock,
}));

const { load } = await import("./+page.server");

describe("server game page fallback", () => {
  beforeEach(() => {
    serverJsonMock.mockReset();
    serverJsonOrNullMock.mockReset();
    serializeErrorDetailsMock.mockClear();
  });

  it("redirects an expired completed game to its durable replay", async () => {
    serverJsonMock.mockRejectedValue(
      new MockServerJsonError("Server request failed: 404", 404, "Not Found", "context"),
    );
    serverJsonOrNullMock.mockImplementation(async (url: string) =>
      url.includes("/replays/") ? { gameId: "game-1" } : null,
    );

    await expect(
      load({
        params: { matchId: "match-1", gameId: "game-1" },
        url: new URL("https://lorcanito.com/matches/match-1/games/game-1"),
        request: new Request("https://lorcanito.com/matches/match-1/games/game-1"),
      } as never),
    ).rejects.toMatchObject({ status: 303, location: `${base}/replay/game-1` });
  });

  it("redirects a completed live context to its durable replay", async () => {
    serverJsonMock.mockResolvedValue({
      schemaVersion: 1,
      match: {
        matchId: "match-1",
        currentGameId: "game-1",
        gameType: "lorcana",
        format: "core-constructed",
        matchType: "testing",
        status: "completed",
        participants: [
          { id: "player-1", seat: 1, userId: "user-1", displayName: "Player One" },
          { id: "player-2", seat: 2, userId: "user-2", displayName: "Player Two" },
        ],
        gameIds: ["game-1"],
        scores: { "player-1": 0, "player-2": 1 },
        winnerId: "player-2",
      },
      game: {
        gameId: "game-1",
        gameNumber: 1,
        status: "completed",
        authority: "server",
        stateVersion: 42,
        view: {},
      },
      viewer: {
        role: "player",
        actorId: "player-1",
        seat: 1,
        userId: "user-1",
        permissions: {
          act: false,
          chat: true,
          propose: false,
          useManualControls: false,
          concede: false,
          spectate: false,
          viewReplay: true,
          downloadReplay: true,
          forkReplay: false,
        },
      },
      capabilities: {
        actions: false,
        chat: true,
        proposals: false,
        manualControls: false,
        spectating: false,
        conceding: false,
        replay: true,
      },
      presence: {
        players: [
          { id: "player-1", connected: false },
          { id: "player-2", connected: false },
        ],
      },
      history: { recentMoves: [], engineLogs: [] },
      replayUrl: "/v1/games/lorcana/play/replays/game-1",
    });
    serverJsonOrNullMock.mockImplementation(async (url: string) =>
      url.includes("/replays/") ? { gameId: "game-1" } : null,
    );

    await expect(
      load({
        params: { matchId: "match-1", gameId: "game-1" },
        url: new URL("https://lorcanito.com/matches/match-1/games/game-1"),
        request: new Request("https://lorcanito.com/matches/match-1/games/game-1"),
      } as never),
    ).rejects.toMatchObject({ status: 303, location: `${base}/replay/game-1` });
    expect(serverJsonOrNullMock).toHaveBeenCalledWith(
      "http://lorcana-api.internal:8080/v1/games/lorcana/play/replays/game-1",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("keeps the expired-match error when no durable replay exists", async () => {
    const consoleInfo = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    serverJsonMock.mockRejectedValue(
      new MockServerJsonError("Server request failed: 404", 404, "Not Found", "context"),
    );
    serverJsonOrNullMock.mockResolvedValue(null);

    const result = await load({
      params: { matchId: "match-1", gameId: "game-1" },
      url: new URL("https://lorcanito.com/matches/match-1/games/game-1"),
      request: new Request("https://lorcanito.com/matches/match-1/games/game-1"),
    } as never);

    expect(result).toMatchObject({
      mode: "error",
      matchId: "match-1",
      gameId: "game-1",
      message: "Match not found. It may have expired.",
    });
    expect(consoleInfo).toHaveBeenCalledWith(
      "[game-page-server] context expired {*}",
      expect.objectContaining({
        event: "game-page.context_expired",
        matchId: "match-1",
        gameId: "game-1",
      }),
    );
    expect(consoleError).not.toHaveBeenCalled();
    consoleInfo.mockRestore();
    consoleError.mockRestore();
  });

  it("logs the failing fallback operation with its structured cause", async () => {
    const replayTimeout = new Error("Server request failed after 2 attempts", {
      cause: new Error("The operation was aborted due to timeout"),
    });
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    serverJsonMock.mockRejectedValue(
      new MockServerJsonError("Server request failed: 404", 404, "Not Found", "context"),
    );
    serverJsonOrNullMock.mockRejectedValue(replayTimeout);

    await load({
      params: { matchId: "match-1", gameId: "game-1" },
      url: new URL("https://lorcanito.com/matches/match-1/games/game-1"),
      request: new Request("https://lorcanito.com/matches/match-1/games/game-1"),
    } as never);

    expect(serializeErrorDetailsMock).toHaveBeenCalledWith(replayTimeout);
    expect(consoleError).toHaveBeenCalledWith(
      "[game-page-server] context fetch error {*}",
      expect.objectContaining({
        operation: "checking for a durable replay after a missing match context",
        contextUrl:
          "http://lorcana-api.internal:8080/v1/games/lorcana/play/matches/match-1/games/game-1/context",
      }),
    );
    consoleError.mockRestore();
  });
});
