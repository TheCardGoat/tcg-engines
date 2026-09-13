import { describe, expect, it } from "vitest";
import { nextRiftboundGameHref } from "./navigation";

describe("nextRiftboundGameHref", () => {
  it("moves to the next game while preserving navigation but removing browser identity", () => {
    expect(
      nextRiftboundGameHref(
        "https://tcg.online/riftbound/simulator/matches/match-1/games/game-1?playerId=p1&returnTo=%2Friftbound%2Fmatchmaking",
        "match 1",
        "game/2",
      ),
    ).toBe(
      "https://tcg.online/riftbound/simulator/matches/match%201/games/game%2F2?returnTo=%2Friftbound%2Fmatchmaking",
    );
  });
});
