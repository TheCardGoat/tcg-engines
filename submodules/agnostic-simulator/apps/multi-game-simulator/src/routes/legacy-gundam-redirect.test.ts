import { describe, expect, test } from "vitest";

import { loader } from "./simulator-legacy-gundam-match";

describe("legacy Gundam simulator match redirect", () => {
  test("canonicalizes query gameId into the framework live-match route", async () => {
    let response: Response | null = null;
    try {
      loader({
        request: new Request(
          "https://tcg.online/gundam/simulator/match/m%201?gameId=g%2F1&playerId=p1",
        ),
        params: { gameSlug: "gundam", matchId: "m 1" },
        context: {},
      });
    } catch (error) {
      response = error instanceof Response ? error : null;
    }

    expect(response?.status).toBe(302);
    expect(response?.headers.get("Location")).toBe(
      "/gundam/simulator/matches/m%201/games/g%2F1?playerId=p1",
    );
  });
});
