import type { GameSlug } from "@tcg/simulator-contract";

export interface GameMeta {
  slug: GameSlug;
  name: string;
  description: string;
  accentColor: string;
  accentSoft: string;
  badgeLabel: string;
  defaultIndexPath?: string;
  includeInIndex?: boolean;
}

export const GAMES: readonly GameMeta[] = [
  {
    slug: "riftbound",
    name: "Riftbound",
    description:
      "Private client-authoritative matches using the shared lobby and realtime match infrastructure.",
    accentColor: "#55d6c2",
    accentSoft: "#dffbf6",
    badgeLabel: "Private tabletop",
    defaultIndexPath: "/riftbound/simulator",
  },
  {
    slug: "alpha-clash",
    name: "Alpha Clash",
    description:
      "Contenders, Clash cards, resources, Portal, and the six clash steps in server-authoritative live matches.",
    accentColor: "#c2502b",
    accentSoft: "#fbeee8",
    badgeLabel: "Live matches",
    defaultIndexPath: "/alpha-clash/simulator",
  },
  {
    slug: "one-piece",
    name: "One Piece",
    description:
      "Leader, character, life, DON!!, and counter timing rendered from the shared contract.",
    accentColor: "#b4232f",
    accentSoft: "#fdebed",
    badgeLabel: "Visual fixtures",
    defaultIndexPath: "/one-piece/simulator/tests",
  },
  {
    slug: "gundam",
    name: "Gundam",
    description:
      "Battle area, shield, resource, base, and paired pilot metadata in one table layout.",
    accentColor: "#1f5faa",
    accentSoft: "#e8f1fb",
    badgeLabel: "Visual fixtures",
    defaultIndexPath: "/gundam/simulator",
  },
  {
    slug: "cyberpunk",
    name: "Cyberpunk",
    description:
      "Legend, eddies, gear, dice, and gig targeting through the shared fixture harness.",
    accentColor: "#b47919",
    accentSoft: "#fff5df",
    badgeLabel: "Visual fixtures",
    defaultIndexPath: "/cyberpunk/simulator/tests",
  },
  {
    slug: "lorcana",
    name: "Lorcana",
    description:
      "Characters, ink, locations, lore, and ordering prompts through the same fixture harness.",
    accentColor: "#6d4cc2",
    accentSoft: "#f0ecff",
    badgeLabel: "External fixtures",
    includeInIndex: false,
  },
  {
    slug: "flesh-and-blood",
    name: "Flesh and Blood",
    description:
      "Hero, combat chain, permanents, and practice vs bots with a visual fixture catalog.",
    accentColor: "#8a1c1c",
    accentSoft: "#fbeaea",
    badgeLabel: "Visual fixtures",
    defaultIndexPath: "/flesh-and-blood/simulator",
  },
  {
    slug: "grand-archive",
    name: "Grand Archive",
    description:
      "Server-authoritative Opportunity, materialization, decisions, and viewer-safe hidden zones.",
    accentColor: "#bb5a32",
    accentSoft: "#fff0e8",
    badgeLabel: "Executable adapter",
    defaultIndexPath: "/grand-archive/simulator",
  },
  {
    slug: "naruto",
    name: "Naruto Card Game",
    description:
      "An offline, provisional rules preview for Leader, Chakra, Characters, Support cards, and Summons.",
    accentColor: "#eb6101",
    accentSoft: "#fdeede",
    badgeLabel: "Preview rules",
    defaultIndexPath: "/naruto/simulator",
  },
];

const GAME_SLUGS = new Set(GAMES.map((g) => g.slug));

export function isGameSlug(value: string): value is GameSlug {
  return (GAME_SLUGS as ReadonlySet<string>).has(value);
}

export function getGameMeta(slug: GameSlug): GameMeta | undefined {
  return GAMES.find((g) => g.slug === slug);
}

export function listIndexGames(): readonly GameMeta[] {
  return GAMES.filter((g) => g.includeInIndex !== false);
}

export function getGameDefaultIndexPath(slug: GameSlug): string | null {
  return getGameMeta(slug)?.defaultIndexPath ?? null;
}
