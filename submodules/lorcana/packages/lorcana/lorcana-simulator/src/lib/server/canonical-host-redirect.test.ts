import { describe, expect, it } from "bun:test";

import { canonicalHostRedirect } from "./canonical-host-redirect.js";

describe("canonicalHostRedirect", () => {
  it("permanently canonicalizes the legacy hostname while preserving the request URI", () => {
    expect(
      canonicalHostRedirect(
        new URL("https://new.lorcanito.com/matchmaking/leaderboard?seasonId=spring-2026"),
      ),
    ).toBe("https://lorcanito.com/matchmaking/leaderboard?seasonId=spring-2026");
  });

  it("accepts hostname casing and a DNS trailing dot", () => {
    expect(canonicalHostRedirect(new URL("https://NEW.LORCANITO.COM./replay/game-1"))).toBe(
      "https://lorcanito.com/replay/game-1",
    );
  });

  it("does not redirect the canonical host or unrelated simulator hosts", () => {
    expect(canonicalHostRedirect(new URL("https://lorcanito.com/matchmaking"))).toBeNull();
    expect(canonicalHostRedirect(new URL("https://simulator.example.com/matchmaking"))).toBeNull();
  });
});
