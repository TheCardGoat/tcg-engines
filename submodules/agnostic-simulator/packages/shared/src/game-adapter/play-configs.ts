import type { PlayableGameSlug } from "@tcg/protocol/games";
import type { TimeControlConfig, TimeControlMode } from "../game-engine/time-control.js";

export interface PlayCapabilities {
  matchmaking: boolean;
  lobby: boolean;
  leaderboards: boolean;
  spectating: boolean;
}

export interface PlayGameConfig {
  slug: PlayableGameSlug;
  isActive: boolean;
  runtimeAuthority: "server" | "client";
  /** First entry is the hosted practice default; omitted preserves legacy client practice. */
  quickMatchAuthorities?: readonly ["server" | "client", ...("server" | "client")[]];
  capabilities: PlayCapabilities;
  timeControl: PlayTimeControlPolicy;
}

export interface PlayTimeControlPolicy {
  supportedModes: readonly TimeControlMode[];
  matchmaking: TimeControlConfig;
}

export type MatchSpectatorAccess = "public" | "authenticated" | "disabled";
export type MatchReplayAccess = "public_after_match" | "authenticated_after_match" | "participants";

export interface MatchAccessPolicy {
  spectatorAccess: MatchSpectatorAccess;
  replayAccess: MatchReplayAccess;
}

const NO_PLAY_CAPABILITIES: PlayCapabilities = {
  matchmaking: false,
  lobby: false,
  leaderboards: false,
  spectating: false,
};

function definePlayCapabilities(partial: Partial<PlayCapabilities>): PlayCapabilities {
  return { ...NO_PLAY_CAPABILITIES, ...partial };
}

function defineTimeControlPolicy<const Modes extends readonly TimeControlMode[]>(
  supportedModes: Modes,
  matchmaking: Extract<TimeControlConfig, { mode: Modes[number] }>,
): PlayTimeControlPolicy {
  return { supportedModes, matchmaking };
}

function standardDynamicTimeControlPolicy<
  const Modes extends readonly ["none", ...TimeControlMode[], "dynamic"],
>(supportedModes: Modes): PlayTimeControlPolicy {
  return {
    supportedModes,
    matchmaking: {
      mode: "dynamic",
      initialReserveMs: 3 * 60 * 1000,
      turnPassBonusMs: 60 * 1000,
      perActionBonusMs: 5 * 1000,
      extras: {
        reserveCapMs: 3 * 60 * 1000,
        resetTimeOnSkipMs: 0,
        graceMs: 15 * 1000,
        maxDecisionTimeMs: 3 * 60 * 1000,
      },
    },
  };
}

function clocklessTimeControlPolicy(): PlayTimeControlPolicy {
  return defineTimeControlPolicy(["none"], { mode: "none" });
}

const PLAY_GAME_CONFIGS = {
  lorcana: {
    slug: "lorcana" as const,
    isActive: true,
    runtimeAuthority: "server" as const,
    capabilities: definePlayCapabilities({
      matchmaking: true,
      lobby: true,
      leaderboards: true,
      spectating: true,
    }),
    timeControl: standardDynamicTimeControlPolicy(["none", "chess", "dynamic"]),
  },
  gundam: {
    slug: "gundam" as const,
    isActive: true,
    runtimeAuthority: "server" as const,
    capabilities: definePlayCapabilities({
      matchmaking: true,
      lobby: true,
      leaderboards: true,
      spectating: true,
    }),
    timeControl: standardDynamicTimeControlPolicy(["none", "dynamic"]),
  },
  cyberpunk: {
    slug: "cyberpunk" as const,
    isActive: true,
    runtimeAuthority: "server" as const,
    capabilities: definePlayCapabilities({
      matchmaking: true,
      lobby: true,
      leaderboards: true,
      spectating: true,
    }),
    timeControl: standardDynamicTimeControlPolicy(["none", "dynamic"]),
  },
  riftbound: {
    slug: "riftbound" as const,
    isActive: true,
    runtimeAuthority: "client" as const,
    capabilities: definePlayCapabilities({ lobby: true }),
    timeControl: clocklessTimeControlPolicy(),
  },
  "one-piece": {
    slug: "one-piece" as const,
    isActive: false,
    runtimeAuthority: "server" as const,
    capabilities: NO_PLAY_CAPABILITIES,
    timeControl: clocklessTimeControlPolicy(),
  },
  "flesh-and-blood": {
    slug: "flesh-and-blood" as const,
    isActive: true,
    runtimeAuthority: "server" as const,
    quickMatchAuthorities: ["server"],
    capabilities: definePlayCapabilities({
      matchmaking: true,
      lobby: true,
      leaderboards: true,
      spectating: true,
    }),
    timeControl: defineTimeControlPolicy(["none", "dynamic"], {
      mode: "dynamic",
      initialReserveMs: 180_000,
      perActionBonusMs: 5_000,
      turnPassBonusMs: 60_000,
      // FAB forfeits an exhausted reserve; it never skips a rules decision.
      extras: { reserveCapMs: 180_000, graceMs: 15_000 },
    }),
  },
  // Phase 2: hosted multiplayer on the provisional preview rules profile.
  naruto: {
    slug: "naruto" as const,
    isActive: true,
    runtimeAuthority: "server" as const,
    capabilities: definePlayCapabilities({
      matchmaking: true,
      lobby: true,
      leaderboards: true,
      spectating: true,
    }),
    timeControl: clocklessTimeControlPolicy(),
  },
  "grand-archive": {
    slug: "grand-archive" as const,
    isActive: true,
    runtimeAuthority: "server" as const,
    quickMatchAuthorities: ["server"] as const,
    capabilities: definePlayCapabilities({
      matchmaking: true,
      lobby: true,
      leaderboards: true,
      spectating: true,
    }),
    timeControl: clocklessTimeControlPolicy(),
  },
  platform: {
    slug: "platform" as const,
    isActive: false,
    runtimeAuthority: "server" as const,
    capabilities: NO_PLAY_CAPABILITIES,
    timeControl: clocklessTimeControlPolicy(),
  },
} satisfies Record<PlayableGameSlug, PlayGameConfig>;

export function getPlayGameConfig(slug: PlayableGameSlug): PlayGameConfig;
export function getPlayGameConfig(slug: string): PlayGameConfig | undefined;
export function getPlayGameConfig(slug: string): PlayGameConfig | undefined {
  return (PLAY_GAME_CONFIGS as Record<string, PlayGameConfig>)[slug];
}

/** Derive browser access exclusively from trusted server-owned match inputs. */
export function deriveMatchAccessPolicy(
  slug: string,
  input: {
    matchType?: string;
    lobbyVisibility?: "private" | "public";
    spectatorAccess?: MatchSpectatorAccess;
    replayAccess?: MatchReplayAccess;
  },
): MatchAccessPolicy {
  const config = getPlayGameConfig(slug);
  const inherentlyPrivate =
    input.matchType === "practice_vs_bot" ||
    (input.matchType === "private" && input.lobbyVisibility !== "public");
  const supportsSecureSpectating = config?.capabilities.spectating === true;
  const defaultSpectatorAccess: MatchSpectatorAccess =
    supportsSecureSpectating && !inherentlyPrivate ? "public" : "disabled";

  return {
    spectatorAccess: supportsSecureSpectating
      ? (input.spectatorAccess ?? defaultSpectatorAccess)
      : "disabled",
    replayAccess: input.replayAccess ?? (inherentlyPrivate ? "participants" : "public_after_match"),
  };
}

export function resolveQuickMatchAuthority(
  slug: string,
  requested?: "server" | "client",
): "server" | "client" | undefined {
  const allowed = getPlayGameConfig(slug)?.quickMatchAuthorities ?? ["client", "server"];
  const authority = requested ?? allowed[0];
  return allowed.includes(authority) ? authority : undefined;
}
