/**
 * Card database accessors.
 *
 * `getAllCards` returns cards in the reference gallery order: numbered cards
 * first (sorted by collector number), unnumbered cards after (sorted by id).
 */

import { CARDS } from "./cards";
import type { CardDefinition, Color } from "./types";

const SORTED: readonly CardDefinition[] = [...CARDS].sort((a, b) => {
  const aNumbered = a.number !== "";
  const bNumbered = b.number !== "";
  if (aNumbered !== bNumbered) {
    return aNumbered ? -1 : 1;
  }
  if (a.number && b.number) {
    return a.number.localeCompare(b.number);
  }
  if (a.number) return -1;
  if (b.number) return 1;
  return a.id.localeCompare(b.id);
});

const BY_ID: ReadonlyMap<string, CardDefinition> = new Map(CARDS.map((c) => [c.id, c]));

export function getCardById(id: string): CardDefinition | undefined {
  return BY_ID.get(id);
}

export function getAllCards(): readonly CardDefinition[] {
  return SORTED;
}

export function getCardsByColor(color: Color): readonly CardDefinition[] {
  return SORTED.filter((c) => c.color === color);
}

/**
 * Lower-cased haystack of every searchable string on a card (names in all
 * languages, collector number, traits, support name/text, skill texts).
 */
export function cardSearchIndex(card: CardDefinition): string {
  return [
    card.nameEn,
    card.nameFr,
    card.nameJa,
    card.number,
    ...card.traits,
    card.support?.name ?? "",
    card.support?.text ?? "",
    ...card.skills.map((s) => s.text),
  ]
    .join(" ")
    .toLowerCase();
}

/** Case-insensitive substring search over `cardSearchIndex`. */
export function searchCards(query: string): readonly CardDefinition[] {
  const needle = query.trim().toLowerCase();
  if (needle === "") return SORTED;
  return SORTED.filter((c) => cardSearchIndex(c).includes(needle));
}
