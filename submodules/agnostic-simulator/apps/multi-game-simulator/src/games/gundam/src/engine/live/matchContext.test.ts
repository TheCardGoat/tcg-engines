import { afterEach, describe, expect, it, vi } from "vitest";

import { getMatchmakingReturnUrl } from "./matchContext.ts";

describe("getMatchmakingReturnUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("uses Gundam's per-game matchmaking URL instead of Cyberpunk's shared URL", () => {
    vi.stubEnv("VITE_MATCHMAKING_URL", "http://localhost:5173/cyberpunk/matchmaking");
    vi.stubEnv("VITE_GUNDAM_MATCHMAKING_URL", "http://localhost:5173/gundam/matchmaking");

    expect(getMatchmakingReturnUrl("")).toBe("http://localhost:5173/gundam/matchmaking");
  });

  it("falls back to Gundam production matchmaking when no per-game URL is set", () => {
    vi.stubEnv("VITE_MATCHMAKING_URL", "http://localhost:5173/cyberpunk/matchmaking");

    expect(getMatchmakingReturnUrl("")).toBe("https://tcg.online/gundam/matchmaking");
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
