import { resolveQuickMatchAuthority } from "./play-configs";
import { describe, expect, test } from "vitest";

import { deriveMatchAccessPolicy, getPlayGameConfig } from "./play-configs";

describe("play game configuration", () => {
  test("enables Riftbound only for private client-authoritative play", () => {
    expect(getPlayGameConfig("riftbound")).toEqual({
      slug: "riftbound",
      isActive: true,
      runtimeAuthority: "client",
      capabilities: {
        matchmaking: false,
        lobby: true,
        leaderboards: false,
        spectating: false,
      },
      timeControl: {
        supportedModes: ["none"],
        matchmaking: { mode: "none" },
      },
    });
  });

  test("keeps existing active games server-authoritative and spectatable", () => {
    for (const slug of ["lorcana", "gundam", "cyberpunk"] as const) {
      const config = getPlayGameConfig(slug);
      expect(config?.runtimeAuthority).toBe("server");
      expect(config?.capabilities.spectating).toBe(true);
    }
  });

  test("enables Naruto Phase 2 hosted multiplayer capabilities", () => {
    expect(getPlayGameConfig("naruto")).toEqual({
      slug: "naruto",
      isActive: true,
      runtimeAuthority: "server",
      capabilities: {
        matchmaking: true,
        lobby: true,
        leaderboards: true,
        spectating: true,
      },
      timeControl: {
        supportedModes: ["none"],
        matchmaking: { mode: "none" },
      },
    });
  });

  test("keeps every matchmaking clock policy within the game's supported modes", () => {
    for (const slug of ["lorcana", "gundam", "cyberpunk", "flesh-and-blood", "naruto"] as const) {
      const config = getPlayGameConfig(slug);
      expect(config.capabilities.matchmaking).toBe(true);
      expect(config.timeControl.supportedModes).toContain(config.timeControl.matchmaking.mode);
    }
  });

  test("configures Gundam matchmaking with the standard dynamic clock", () => {
    expect(getPlayGameConfig("gundam").timeControl).toEqual({
      supportedModes: ["none", "dynamic"],
      matchmaking: {
        mode: "dynamic",
        initialReserveMs: 180_000,
        turnPassBonusMs: 60_000,
        perActionBonusMs: 5_000,
        extras: {
          reserveCapMs: 180_000,
          resetTimeOnSkipMs: 0,
          graceMs: 15_000,
          maxDecisionTimeMs: 180_000,
        },
      },
    });
  });
});

describe("deriveMatchAccessPolicy", () => {
  test("allows public spectators for a public server-authoritative match", () => {
    expect(deriveMatchAccessPolicy("gundam", { matchType: "ranked" })).toEqual({
      spectatorAccess: "public",
      replayAccess: "public_after_match",
    });
  });

  test("disables spectators for private lobbies", () => {
    expect(
      deriveMatchAccessPolicy("cyberpunk", {
        matchType: "private",
        lobbyVisibility: "private",
      }),
    ).toEqual({ spectatorAccess: "disabled", replayAccess: "participants" });
  });

  test("never enables spectators when the game does not support them", () => {
    expect(
      deriveMatchAccessPolicy("riftbound", {
        matchType: "private",
        lobbyVisibility: "public",
        spectatorAccess: "public",
      }),
    ).toEqual({ spectatorAccess: "disabled", replayAccess: "public_after_match" });
  });

  test("keeps practice matches participant-only", () => {
    expect(deriveMatchAccessPolicy("cyberpunk", { matchType: "practice_vs_bot" })).toEqual({
      spectatorAccess: "disabled",
      replayAccess: "participants",
    });
  });
});

test("uses supported hosted practice authority without changing sibling defaults", () => {
  expect(resolveQuickMatchAuthority("flesh-and-blood")).toBe("server");
  expect(resolveQuickMatchAuthority("flesh-and-blood", "client")).toBeUndefined();
  expect(resolveQuickMatchAuthority("flesh-and-blood", "server")).toBe("server");
  expect(resolveQuickMatchAuthority("gundam")).toBe("client");
  expect(resolveQuickMatchAuthority("lorcana", "client")).toBe("client");
  expect(resolveQuickMatchAuthority("lorcana", "server")).toBe("server");
});

test("GA exposes server-authoritative hosted play with a clockless policy", () => {
  const config = getPlayGameConfig("grand-archive");
  expect(config.isActive).toBe(true);
  expect(config.runtimeAuthority).toBe("server");
  expect(config.quickMatchAuthorities).toEqual(["server"]);
  expect(config.capabilities).toEqual({
    matchmaking: true,
    lobby: true,
    leaderboards: true,
    spectating: true,
  });
  expect(config.timeControl.matchmaking).toEqual({ mode: "none" });
});
