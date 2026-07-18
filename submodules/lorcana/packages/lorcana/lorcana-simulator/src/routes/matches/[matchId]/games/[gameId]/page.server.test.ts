import { beforeEach, describe, expect, it, vi } from "vitest";

const serverJsonMock = vi.fn();
const serverJsonOrNullMock = vi.fn();

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
    ).rejects.toMatchObject({ status: 303, location: "/replay/game-1" });
  });

  it("keeps the expired-match error when no durable replay exists", async () => {
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
  });
});
