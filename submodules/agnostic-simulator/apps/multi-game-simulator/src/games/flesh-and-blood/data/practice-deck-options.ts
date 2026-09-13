/**
 * Practice setup deck picker options.
 *
 * Every option is a format-legal tournament text fixture (Classic Constructed
 * or Silver Age). Living Legend and Blitz are reserved for future fixture
 * groups so the picker language stays format-honest.
 */
import {
  DEFAULT_PLAYER_DECK_ID,
  FAB_DECK_TEXT_FIXTURES,
  type FabDeckFormat,
  type FabDeckTextFixture,
} from "@tcg/flesh-and-blood-engine/simulator";

/** Player-facing format bucket for the practice deck picker. */
export type FabPracticeDeckFormatGroup =
  | "classic-constructed"
  | "blitz"
  | "living-legend"
  | "silver-age";

export interface FabPracticeDeckOption {
  readonly id: string;
  readonly label: string;
  readonly description: string;
  readonly formatGroup: FabPracticeDeckFormatGroup;
  readonly source: "tournament-text";
}

export const FAB_PRACTICE_DECK_FORMAT_GROUP_LABEL: Record<FabPracticeDeckFormatGroup, string> = {
  "classic-constructed": "Classic Constructed",
  blitz: "Blitz",
  "living-legend": "Living Legend",
  "silver-age": "Silver Age",
};

/** Ordered groups shown in the practice selects (skip empty). */
export const FAB_PRACTICE_DECK_FORMAT_GROUP_ORDER: readonly FabPracticeDeckFormatGroup[] = [
  "classic-constructed",
  "blitz",
  "living-legend",
  "silver-age",
];

function formatGroupForTextFormat(format: FabDeckFormat): FabPracticeDeckFormatGroup {
  switch (format) {
    case "classic-constructed":
      return "classic-constructed";
    case "silver-age":
      return "silver-age";
    default: {
      const _exhaustive: never = format;
      return _exhaustive;
    }
  }
}

function tournamentOption(deck: FabDeckTextFixture): FabPracticeDeckOption {
  return {
    id: deck.id,
    label: deck.name,
    description: deck.description,
    formatGroup: formatGroupForTextFormat(deck.format),
    source: "tournament-text",
  };
}

/** Flat list of format-legal tournament text fixtures. */
export const FAB_PRACTICE_DECK_OPTIONS: readonly FabPracticeDeckOption[] =
  FAB_DECK_TEXT_FIXTURES.map(tournamentOption);

export function getFabPracticeDeckOption(deckId: string): FabPracticeDeckOption | undefined {
  return FAB_PRACTICE_DECK_OPTIONS.find((deck) => deck.id === deckId);
}

export function getFabPracticeDeckOptionsByFormatGroup(
  group: FabPracticeDeckFormatGroup,
): readonly FabPracticeDeckOption[] {
  return FAB_PRACTICE_DECK_OPTIONS.filter((deck) => deck.formatGroup === group);
}

/** Non-empty format groups in display order for `<optgroup>` rendering. */
export function listFabPracticeDeckOptionGroups(): readonly {
  readonly group: FabPracticeDeckFormatGroup;
  readonly label: string;
  readonly options: readonly FabPracticeDeckOption[];
}[] {
  return FAB_PRACTICE_DECK_FORMAT_GROUP_ORDER.flatMap((group) => {
    const options = getFabPracticeDeckOptionsByFormatGroup(group);
    if (options.length === 0) return [];
    return [
      {
        group,
        label: FAB_PRACTICE_DECK_FORMAT_GROUP_LABEL[group],
        options,
      },
    ];
  });
}

/**
 * Pick a random Classic Constructed tournament deck id for practice open.
 * Falls back to the default CC fixture when no CC fixtures exist.
 * Optional `excludeIds` avoids mirroring the other seat when enough CC lists exist.
 */
export function pickRandomClassicConstructedDeckId(
  random: () => number = Math.random,
  excludeIds: readonly string[] = [],
): string {
  const all = getFabPracticeDeckOptionsByFormatGroup("classic-constructed");
  if (all.length === 0) return DEFAULT_PLAYER_DECK_ID;

  const available = all.filter((option) => !excludeIds.includes(option.id));
  const pool = available.length > 0 ? available : all;
  const index = Math.min(pool.length - 1, Math.floor(random() * pool.length));
  return pool[index]!.id;
}

/** Random player + bot Classic Constructed seats (prefer distinct when possible). */
export function pickRandomClassicConstructedMatchup(random: () => number = Math.random): {
  readonly playerDeckId: string;
  readonly botDeckId: string;
} {
  const playerDeckId = pickRandomClassicConstructedDeckId(random);
  const botDeckId = pickRandomClassicConstructedDeckId(random, [playerDeckId]);
  return { playerDeckId, botDeckId };
}
