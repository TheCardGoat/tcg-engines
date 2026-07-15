import type { PlayableGameSlug } from "@tcg/protocol/games";

export interface PlayCapabilities {
  matchmaking: boolean;
  lobby: boolean;
  leaderboards: boolean;
}

export interface PlayGameConfig {
  slug: PlayableGameSlug;
  isActive: boolean;
  capabilities: PlayCapabilities;
}

const NO_PLAY_CAPABILITIES: PlayCapabilities = {
  matchmaking: false,
  lobby: false,
  leaderboards: false,
};

function definePlayCapabilities(partial: Partial<PlayCapabilities>): PlayCapabilities {
  return { ...NO_PLAY_CAPABILITIES, ...partial };
}

const PLAY_GAME_CONFIGS = {
  lorcana: {
    slug: "lorcana" as const,
    isActive: true,
    capabilities: definePlayCapabilities({ matchmaking: true, lobby: true, leaderboards: true }),
  },
  gundam: {
    slug: "gundam" as const,
    isActive: true,
    capabilities: definePlayCapabilities({ matchmaking: true, lobby: true, leaderboards: true }),
  },
  cyberpunk: {
    slug: "cyberpunk" as const,
    isActive: true,
    capabilities: definePlayCapabilities({ matchmaking: true, lobby: true, leaderboards: true }),
  },
  riftbound: {
    slug: "riftbound" as const,
    isActive: false,
    capabilities: NO_PLAY_CAPABILITIES,
  },
  "one-piece": {
    slug: "one-piece" as const,
    isActive: false,
    capabilities: NO_PLAY_CAPABILITIES,
  },
  platform: {
    slug: "platform" as const,
    isActive: false,
    capabilities: NO_PLAY_CAPABILITIES,
  },
} satisfies Record<PlayableGameSlug, PlayGameConfig>;

export function getPlayGameConfig(slug: string): PlayGameConfig | undefined {
  return (PLAY_GAME_CONFIGS as Record<string, PlayGameConfig>)[slug];
}
