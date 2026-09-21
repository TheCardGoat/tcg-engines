import { afterEach, describe, expect, test, vi } from "vitest";

import {
  createImportedPracticeMatchConfig,
  DEFAULT_BOT_PRACTICE_DECK_ID,
  getPracticeDeckFixture,
  type PracticeMatchConfig,
} from "../engine";
import {
  launchHostedPracticeForPayload,
  liveMatchHref,
  practiceIdempotencyKey,
} from "./WebviewPractice.page";

describe("WebviewPractice live match redirect", () => {
  const response = {
    object: "quick_match",
    matchId: "match 1",
    gameId: "cyberpunk-game/2",
    playerId: "player_1",
    botPlayerId: "bot_1",
    wsTicket: "ticket_1",
    authToken: "auth_1",
  } as const;

  test("preserves the mounted Cyberpunk simulator path after creating practice", () => {
    window.history.replaceState({}, "", "/cyberpunk/simulator/play/practice?source=matchmaking");

    const href = liveMatchHref(response, "default");
    const url = new URL(href, window.location.origin);
    expect(url.pathname).toBe("/cyberpunk/simulator/matches/match%201/games/cyberpunk-game%2F2");
    expect(url.searchParams.get("botStrategyId")).toBe("default");
    expect(url.searchParams.get("returnTo")).toBe(
      `${window.location.origin}/cyberpunk/matchmaking`,
    );
    expect(url.searchParams.get("returnTo")).not.toContain("tcg.online");
  });

  test("falls back to the Cyberpunk simulator mount when Vite is rooted", () => {
    window.history.replaceState({}, "", "/play/practice?source=matchmaking");

    expect(liveMatchHref(response, "first-legal")).toContain(
      "/cyberpunk/simulator/matches/match%201/games/cyberpunk-game%2F2?",
    );
  });
});

describe("WebviewPractice single-flight launch", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // The single-flight cache is module-scoped, so every test uses its own
  // payload key to stay independent of the others.
  const singleFlightPayload = "cGF5bG9hZC1zaW5nbGUtZmxpZ2h0";
  const keyedPayload = "cGF5bG9hZC1rZXllZA";
  const retryPayload = "cGF5bG9hZC1yZXRyeQ";

  function stubQuickMatchFetch(responseMatchId: string): { calls: Request[] } {
    const calls: Request[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url =
          typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        calls.push(new Request(url, init));
        if (url.endsWith("/v1/auth/session")) {
          return { ok: false, status: 503, headers: { get: () => null } } as unknown as Response;
        }
        return {
          ok: true,
          status: 200,
          headers: { get: () => null },
          json: async () => ({
            object: "quick_match",
            matchId: responseMatchId,
            gameId: "cyberpunk-game-1",
            playerId: "player_1",
            botPlayerId: "bot_1",
          }),
        } as unknown as Response;
      }),
    );
    return { calls };
  }

  function importedConfig(): PracticeMatchConfig {
    const fixture = getPracticeDeckFixture(DEFAULT_BOT_PRACTICE_DECK_ID);
    if (!fixture) {
      throw new Error("Default bot practice deck fixture is missing");
    }
    return createImportedPracticeMatchConfig({
      playerDeck: fixture.deck,
      botDeck: { ...fixture.deck, playerId: "bot", playerName: "Bot" },
    });
  }

  test("one payload launches exactly one quick-match request, even when launched twice", async () => {
    const { calls } = stubQuickMatchFetch("match_single");
    const config = importedConfig();

    const [first, second] = await Promise.all([
      launchHostedPracticeForPayload(singleFlightPayload, config),
      launchHostedPracticeForPayload(singleFlightPayload, config),
    ]);

    const quickMatchCalls = calls.filter((request) => request.url.endsWith("/quick-match"));
    expect(quickMatchCalls).toHaveLength(1);
    await expect(quickMatchCalls[0]?.json()).resolves.toMatchObject({ authority: "server" });
    expect(first.matchId).toBe("match_single");
    expect(second.matchId).toBe("match_single");
  });

  test("the quick-match request carries a server-acceptable idempotency key", async () => {
    const { calls } = stubQuickMatchFetch("match_keyed");
    const config = importedConfig();

    await launchHostedPracticeForPayload(keyedPayload, config);

    const quickMatchCall = calls.find((request) => request.url.endsWith("/quick-match"));
    expect(quickMatchCall).toBeDefined();
    const key = quickMatchCall?.headers.get("idempotency-key") ?? "";
    expect(key).toMatch(/^[A-Za-z0-9_-]{16,128}$/);
  });

  test("a failed launch is retried with a fresh request instead of replaying the rejection", async () => {
    const calls: Request[] = [];
    let attempts = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url =
          typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
        if (url.endsWith("/quick-match")) {
          attempts += 1;
          calls.push(new Request(url, init));
          if (attempts === 1) {
            throw new Error("network dropped");
          }
        }
        return {
          ok: true,
          status: 200,
          headers: { get: () => null },
          json: async () => ({
            object: "quick_match",
            matchId: "match_retry",
            gameId: "cyberpunk-game-1",
            playerId: "player_1",
            botPlayerId: "bot_1",
          }),
        } as unknown as Response;
      }),
    );
    const config = importedConfig();

    await expect(launchHostedPracticeForPayload(retryPayload, config)).rejects.toThrow(
      "network dropped",
    );
    const retry = await launchHostedPracticeForPayload(retryPayload, config);

    expect(retry.matchId).toBe("match_retry");
    expect(calls).toHaveLength(2);
  });

  test("idempotency keys are stable per payload and distinct across payloads", async () => {
    const [sameFirst, sameSecond, other] = await Promise.all([
      practiceIdempotencyKey("payload-a"),
      practiceIdempotencyKey("payload-a"),
      practiceIdempotencyKey("payload-b"),
    ]);

    expect(sameFirst).toBe(sameSecond);
    expect(sameFirst).not.toBe(other);
    expect(sameFirst).toMatch(/^[A-Za-z0-9_-]{16,128}$/);
  });
});
