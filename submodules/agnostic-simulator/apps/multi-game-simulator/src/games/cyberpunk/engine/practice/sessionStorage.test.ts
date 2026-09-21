import { afterEach, describe, expect, test, vi } from "vitest";

const primeAuthSession = vi.fn(async () => {});
vi.mock("../../auth/auth-store", () => ({ primeAuthSession }));
vi.mock("../live/runtimeHeaders", () => ({
  cyberpunkRuntimeRequestHeaders: () => ({ "x-runtime-test": "1" }),
}));
vi.mock("../../../../runtime/gameRuntimeApi", () => ({
  playUrl: (slug: string, suffix: string) => `http://api.test/v1/games/${slug}/play${suffix}`,
}));
vi.mock("../index", () => ({ DEFAULT_AUTOMATED_ACTION_STRATEGY_ID: "default" }));
vi.mock("./deckFixtures", () => ({
  DEFAULT_BOT_PRACTICE_DECK_ID: "bot-default",
  DEFAULT_PLAYER_PRACTICE_DECK_ID: "player-default",
}));

const { createPracticeMatchConfig, fetchPracticeMatchConfigFromServer } =
  await import("./sessionStorage.ts");

function jsonFetcher(status: number, body: unknown) {
  return (async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    })) as unknown as typeof fetch;
}

describe("fetchPracticeMatchConfigFromServer", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("maps a quick_match_config response to a rejoin-ready practice config", async () => {
    const fetcher = jsonFetcher(200, {
      object: "quick_match_config",
      gameId: "game-1",
      matchId: "match-1",
      playerId: "player-1",
      botPlayerId: "bot-1",
      botStrategyId: "aggressive",
      botFixtureId: null,
      botDeckText: null,
    });

    const config = await fetchPracticeMatchConfigFromServer("game-1", fetcher);

    // A rejoin hydrates the engine from the server snapshot, so the recovered
    // config only needs the strategy; decks are intentionally omitted.
    expect(config).toEqual({
      matchId: "game-1",
      source: "card-db",
      botStrategyId: "aggressive",
      seed: null,
      createdAt: expect.any(Number),
    });
    expect(primeAuthSession).toHaveBeenCalled();
  });

  test("falls back to the default bot strategy when the server omits it", async () => {
    const fetcher = jsonFetcher(200, {
      object: "quick_match_config",
      gameId: "game-1",
      botStrategyId: null,
    });

    const config = await fetchPracticeMatchConfigFromServer("game-1", fetcher);

    expect(config?.botStrategyId).toBe("default");
  });

  test("returns null on 404 without throwing", async () => {
    const fetcher = jsonFetcher(404, { code: "config_not_found" });

    await expect(fetchPracticeMatchConfigFromServer("game-1", fetcher)).resolves.toBeNull();
  });

  test("returns null when the response object type is unexpected", async () => {
    const fetcher = jsonFetcher(200, { object: "something_else" });

    await expect(fetchPracticeMatchConfigFromServer("game-1", fetcher)).resolves.toBeNull();
  });
});

describe("createPracticeMatchConfig", () => {
  test("keeps play-both-sides intent in the local session", () => {
    expect(createPracticeMatchConfig({ mode: "self" }).mode).toBe("self");
  });

  test("defaults legacy launches to bot practice", () => {
    expect(createPracticeMatchConfig().mode).toBe("bot");
  });
});
