import { describe, expect, it } from "vite-plus/test";

import {
  buildGundamPracticeLiveMatchSearch,
  buildGundamPracticeRematchPath,
} from "../src/engine/practice/deckPayload.ts";
import { buildGundamSimulatorLiveMatchPath } from "./Practice.page.tsx";

describe("Gundam practice route", () => {
  it("redirects quick matches to the simulator live-match route", () => {
    expect(
      buildGundamSimulatorLiveMatchPath("match 1", "game/1", "returnTo=%2Fgundam%2Fmatchmaking"),
    ).toBe("/gundam/simulator/matches/match%201/games/game%2F1?returnTo=%2Fgundam%2Fmatchmaking");
  });

  it("preserves only the validated practice recipe for a hosted rematch", () => {
    const liveMatchSearch = buildGundamPracticeLiveMatchSearch(
      new URLSearchParams({
        source: "matchmaking",
        deck: "encoded-deck",
        opponent: "seed-aggro",
        strategy: "combat-aware",
        ticket: "must-not-survive",
        unexpected: "must-not-survive",
      }),
      "https://tcg.online/gundam/matchmaking",
    );

    expect(Object.fromEntries(liveMatchSearch)).toEqual({
      source: "matchmaking",
      deck: "encoded-deck",
      opponent: "seed-aggro",
      strategy: "combat-aware",
      practiceRecipe: "1",
      returnTo: "https://tcg.online/gundam/matchmaking",
    });
    expect(
      buildGundamPracticeRematchPath({
        matchType: "practice_vs_bot",
        viewerRole: "player",
        liveMatchSearch,
      }),
    ).toBe(
      "/gundam/simulator/practice?source=matchmaking&deck=encoded-deck&opponent=seed-aggro&strategy=combat-aware&returnTo=https%3A%2F%2Ftcg.online%2Fgundam%2Fmatchmaking",
    );
  });

  it("does not offer rematch for other match types, spectators, or unmarked URLs", () => {
    const marked = buildGundamPracticeLiveMatchSearch(
      new URLSearchParams({ opponent: "seed-aggro", strategy: "combat-aware" }),
      "https://tcg.online/gundam/matchmaking",
    );
    const cases = [
      { matchType: "ranked", viewerRole: "player", liveMatchSearch: marked },
      { matchType: "practice_vs_bot", viewerRole: "spectator", liveMatchSearch: marked },
      {
        matchType: "practice_vs_bot",
        viewerRole: "player",
        liveMatchSearch: new URLSearchParams({
          opponent: "seed-aggro",
          strategy: "combat-aware",
        }),
      },
    ] as const;

    for (const input of cases) {
      expect(buildGundamPracticeRematchPath(input)).toBeNull();
    }
  });

  it("keeps immutable saved bot deck references in the rematch recipe", () => {
    const liveMatchSearch = buildGundamPracticeLiveMatchSearch(
      new URLSearchParams({
        source: "matchmaking",
        opponentSource: "saved_version",
        botProfileId: "profile_1",
        botDeckId: "deck_2",
        botDeckVersionId: "version_7",
        strategy: "combat-aware",
      }),
      "https://tcg.online/gundam/matchmaking",
    );

    expect(
      buildGundamPracticeRematchPath({
        matchType: "practice_vs_bot",
        viewerRole: "player",
        liveMatchSearch,
      }),
    ).toContain("botDeckVersionId=version_7");
  });
});
