import { describe, expect, test } from "vitest";

import { liveMatchHref } from "./WebviewPractice.page";

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

    expect(liveMatchHref(response, "default")).toBe(
      "/cyberpunk/simulator/matches/match%201/games/cyberpunk-game%2F2?returnTo=https%3A%2F%2Ftcg.online%2Fcyberpunk%2Fmatchmaking&playerId=player_1&botStrategyId=default&ticket=ticket_1&authToken=auth_1",
    );
  });

  test("falls back to the Cyberpunk simulator mount when Vite is rooted", () => {
    window.history.replaceState({}, "", "/play/practice?source=matchmaking");

    expect(liveMatchHref(response, "first-legal")).toContain(
      "/cyberpunk/simulator/matches/match%201/games/cyberpunk-game%2F2?",
    );
  });
});
