import type { GameSlug, HarnessFixture } from "@tcg/simulator-contract";

export interface GameMeta {
  slug: GameSlug;
  name: string;
  description: string;
  accentColor: string;
  accentSoft: string;
}

export const GAMES: readonly GameMeta[] = [
  {
    slug: "one-piece",
    name: "One Piece",
    description:
      "Leader, character, life, DON!!, and counter timing rendered from the shared contract.",
    accentColor: "#b4232f",
    accentSoft: "#fdebed",
  },
  {
    slug: "gundam",
    name: "Gundam",
    description:
      "Battle area, shield, resource, base, and paired pilot metadata in one table layout.",
    accentColor: "#1f5faa",
    accentSoft: "#e8f1fb",
  },
  {
    slug: "cyberpunk",
    name: "Cyberpunk",
    description:
      "Legend, eddies, gear, dice, and gig targeting through the shared fixture harness.",
    accentColor: "#b47919",
    accentSoft: "#fff5df",
  },
  {
    slug: "lorcana",
    name: "Lorcana",
    description:
      "Characters, ink, locations, lore, and ordering prompts through the same fixture harness.",
    accentColor: "#6d4cc2",
    accentSoft: "#f0ecff",
  },
];

const GAME_SLUGS = new Set(GAMES.map((g) => g.slug));

export function isGameSlug(value: string): value is GameSlug {
  return (GAME_SLUGS as ReadonlySet<string>).has(value);
}

export function getGameMeta(slug: GameSlug): GameMeta | undefined {
  return GAMES.find((g) => g.slug === slug);
}

export function groupFixturesByGame(
  fixtures: readonly HarnessFixture[],
): Partial<Record<GameSlug, HarnessFixture[]>> {
  const groups: Partial<Record<GameSlug, HarnessFixture[]>> = {};

  for (const fixture of fixtures) {
    const list = groups[fixture.gameSlug] ?? [];
    list.push(fixture);
    groups[fixture.gameSlug] = list;
  }

  return groups;
}
