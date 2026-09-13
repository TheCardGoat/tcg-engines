import { describe, expect, it } from "vitest";
import {
  buildPlatformMatchmakingRedirect,
  resolvePlatformMatchmakingReturnUrl,
} from "./platform-matchmaking-url.js";

describe("platform matchmaking URLs", () => {
  it("redirects the legacy lobby root to the configured platform lobby", () => {
    expect(
      buildPlatformMatchmakingRedirect(
        new URL("http://localhost:5180/matchmaking?deck=abc"),
        "http://localhost:8080/lorcana/matchmaking",
      ),
    ).toBe("http://localhost:8080/lorcana/matchmaking?deck=abc");
  });

  it("preserves supported lobby subroutes through a mounted simulator path", () => {
    expect(
      buildPlatformMatchmakingRedirect(
        new URL("https://tcg.online/lorcana/simulator/matchmaking/room/ABCD"),
      ),
    ).toBe("https://tcg.online/lorcana/matchmaking/room/ABCD");
  });

  it("collapses simulator-only lobby pages to the platform lobby", () => {
    expect(
      buildPlatformMatchmakingRedirect(new URL("https://lorcanito.com/matchmaking/meta-insights")),
    ).toBe("https://tcg.online/lorcana/matchmaking");
  });

  it("honors a platform-generated return URL on the current origin", () => {
    expect(
      resolvePlatformMatchmakingReturnUrl(
        new URL(
          "http://localhost:8080/lorcana/simulator/matches/m1?returnTo=http%3A%2F%2Flocalhost%3A8080%2Florcana%2Fmatchmaking",
        ),
        "http://localhost:8080/lorcana/matchmaking",
      ),
    ).toBe("http://localhost:8080/lorcana/matchmaking");
  });

  it("preserves a loopback matchmaking origin across local dev ports", () => {
    expect(
      resolvePlatformMatchmakingReturnUrl(
        new URL(
          "http://localhost:8080/lorcana/simulator/matches/m1?returnTo=http%3A%2F%2Flocalhost%3A5173%2Florcana%2Fmatchmaking",
        ),
        "http://localhost:8080/lorcana/matchmaking",
      ),
    ).toBe("http://localhost:5173/lorcana/matchmaking");
  });

  it("does not trust a different loopback hostname", () => {
    expect(
      resolvePlatformMatchmakingReturnUrl(
        new URL(
          "http://localhost:8080/lorcana/simulator/matches/m1?returnTo=http%3A%2F%2F127.0.0.1%3A5173%2Florcana%2Fmatchmaking",
        ),
        "http://localhost:8080/lorcana/matchmaking",
      ),
    ).toBe("http://localhost:8080/lorcana/matchmaking");
  });

  it("keeps a staging match on staging when its URL carries a production return target", () => {
    expect(
      resolvePlatformMatchmakingReturnUrl(
        new URL(
          "https://staging.cardgoat.org/lorcana/simulator/matches/m1?returnTo=https%3A%2F%2Ftcg.online%2Florcana%2Fmatchmaking",
        ),
        "https://tcg.online/lorcana/matchmaking",
      ),
    ).toBe("https://staging.cardgoat.org/lorcana/matchmaking");
  });

  it("rejects cross-origin return URLs", () => {
    expect(
      resolvePlatformMatchmakingReturnUrl(
        new URL(
          "https://tcg.online/lorcana/simulator/matches/m1?returnTo=https%3A%2F%2Fevil.example%2Florcana%2Fmatchmaking",
        ),
      ),
    ).toBe("https://tcg.online/lorcana/matchmaking");
  });

  it("can fall back to a platform subroute", () => {
    expect(
      resolvePlatformMatchmakingReturnUrl(
        new URL("https://tcg.online/lorcana/simulator/replay/g1"),
        undefined,
        "replays",
      ),
    ).toBe("https://tcg.online/lorcana/matchmaking/replays");
  });

  it("prefers an explicit subroute over a generic returnTo lobby URL", () => {
    expect(
      resolvePlatformMatchmakingReturnUrl(
        new URL(
          "https://tcg.online/lorcana/simulator/matches/m1?returnTo=https%3A%2F%2Ftcg.online%2Florcana%2Fmatchmaking",
        ),
        "https://tcg.online/lorcana/matchmaking",
        "atelier",
      ),
    ).toBe("https://tcg.online/lorcana/matchmaking/atelier");
  });

  it("keeps explicit subroutes on the current origin when returnTo is production", () => {
    expect(
      resolvePlatformMatchmakingReturnUrl(
        new URL(
          "https://staging.cardgoat.org/lorcana/simulator/matches/m1?returnTo=https%3A%2F%2Ftcg.online%2Florcana%2Fmatchmaking",
        ),
        "https://tcg.online/lorcana/matchmaking",
        "atelier",
      ),
    ).toBe("https://staging.cardgoat.org/lorcana/matchmaking/atelier");
  });
});
