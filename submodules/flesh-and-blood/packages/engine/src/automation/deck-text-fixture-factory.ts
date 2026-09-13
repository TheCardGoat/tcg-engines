/**
 * Shared constructor for tournament text deck fixtures.
 */
import {
  fabDeckTags,
  type FabConstructedFormat,
  type FabDeckOrigin,
  type FabHeroClass,
  type FabTournamentDeckEntry,
} from "./deck-catalog-model.ts";

export type FabDeckFormat = FabConstructedFormat;
export type FabDeckTextFixture = FabTournamentDeckEntry;

export function lines(...chunks: readonly string[]): string {
  return chunks
    .flatMap((chunk) =>
      chunk
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith("#")),
    )
    .join("\n");
}

export function createFabTournamentTextFixture(input: {
  id: string;
  name: string;
  description: string;
  format: FabDeckFormat;
  hero: string;
  heroClass: FabHeroClass;
  event?: string;
  placement?: number;
  source?: string;
  author?: string;
  date?: string;
  tags?: readonly string[];
  arena: string;
  mainDeck: string;
}): FabDeckTextFixture {
  const origin: FabDeckOrigin = input.source
    ? { kind: "fabrary", url: input.source }
    : {
        kind: "community",
        ...(input.author ? { author: input.author } : {}),
        ...(input.date ? { date: input.date } : {}),
      };
  const cards = lines(`1x ${input.hero}`, input.arena, input.mainDeck);
  return {
    kind: "tournament",
    playable: false,
    id: input.id,
    name: input.name,
    description: input.description,
    format: input.format,
    hero: input.hero,
    heroName: input.hero,
    heroClass: input.heroClass,
    event: input.event,
    placement: input.placement,
    origin,
    source: input.source,
    tags: fabDeckTags(input.heroClass, input.format, origin.kind, input.event, input.tags),
    arena: lines(input.arena),
    mainDeck: lines(input.mainDeck),
    cards,
  };
}
