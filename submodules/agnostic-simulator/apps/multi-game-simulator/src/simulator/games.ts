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
    slug: "naruto",
    name: "Naruto",
    description:
      "Leader, chakra, characters, supports, and the counter-step chain through the shared contract.",
    accentColor: "#eb6101",
    accentSoft: "#fdeede",
    badgeLabel: "Visual fixtures",
    defaultIndexPath: "/naruto/simulator/tests",
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
