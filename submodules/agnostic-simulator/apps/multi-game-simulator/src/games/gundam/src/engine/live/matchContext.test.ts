import { afterEach, describe, expect, it, vi } from "vitest";

import {
  buildGundamReplayHref,
  getMatchmakingReturnUrl,
  resolveMatchOverviewDestination,
} from "./matchContext.ts";

describe("buildGundamReplayHref", () => {
  it("keeps replay navigation inside the mounted Gundam simulator", () => {
    expect(buildGundamReplayHref("game id")).toBe("/gundam/simulator/replay/game%20id");
  });
});

describe("getMatchmakingReturnUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("uses Gundam's per-game matchmaking URL instead of Cyberpunk's shared URL", () => {
    vi.stubEnv("VITE_MATCHMAKING_URL", "http://localhost:5173/cyberpunk/matchmaking");
    vi.stubEnv("VITE_GUNDAM_MATCHMAKING_URL", "http://localhost:5173/gundam/matchmaking");

    expect(getMatchmakingReturnUrl("")).toBe("http://localhost:5173/gundam/matchmaking");
  });

  it("falls back to same-origin matchmaking when no per-game URL is set", () => {
    vi.stubEnv("VITE_MATCHMAKING_URL", "http://localhost:5173/cyberpunk/matchmaking");

    expect(getMatchmakingReturnUrl("")).toBe(`${window.location.origin}/gundam/matchmaking`);
  });

  it("does not follow a production returnTo while the simulator is on staging", () => {
    vi.stubGlobal("window", {
      location: {
        origin: "https://staging.cardgoat.org",
        hostname: "staging.cardgoat.org",
        protocol: "https:",
        search: "",
      },
    });

    expect(
      getMatchmakingReturnUrl("?returnTo=https%3A%2F%2Ftcg.online%2Fgundam%2Fmatchmaking"),
    ).toBe("https://staging.cardgoat.org/gundam/matchmaking");
  });

  it("honors an allowed returnTo query parameter", () => {
    vi.stubEnv("VITE_GUNDAM_MATCHMAKING_URL", "https://tcg.online/gundam/matchmaking");

    expect(
      getMatchmakingReturnUrl(
        "?returnTo=http%3A%2F%2Flocalhost%3A5173%2Fgundam%2Fmatchmaking%3Ftab%3Dpractice",
      ),
    ).toBe("http://localhost:5173/gundam/matchmaking?tab=practice");
  });
});

describe("resolveMatchOverviewDestination", () => {
  it("preserves the mount while removing browser-selected identity", () => {
    const destination = resolveMatchOverviewDestination(
      {
        object: "match",
        matchId: "match_1",
        status: "in_progress",
        currentGameId: "game_1",
        gameIds: ["game_1"],
      },
      "?playerId=p1&gameId=stale",
      "/gundam/simulator",
    );

    expect(destination.pathname).toBe("/gundam/simulator/matches/match_1/games/game_1");
    expect(destination.search).toBe("");
  });
});
