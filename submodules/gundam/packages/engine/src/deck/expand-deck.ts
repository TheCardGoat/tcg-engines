import type { Card } from "@tcg/gundam-types";

import type { DeckList } from "./deck-list.ts";

export interface ExpandedDeck {
  readonly deck: ReadonlyArray<Card>;
  readonly resourceDeck: ReadonlyArray<Card>;
}

export interface ExpandDeckOptions {
  readonly catalog: ReadonlyMap<string, Card> | Record<string, Card>;
}

function getCard(
  catalog: ReadonlyMap<string, Card> | Record<string, Card>,
  cardNumber: string,
): Card | undefined {
  if (catalog instanceof Map) return catalog.get(cardNumber);
  return (catalog as Record<string, Card>)[cardNumber];
}

/**
 * Expands a `DeckList` into flat `Card[]` arrays suitable for seeding
 * a `DevRuntime.p1.deck` / `resourceDeck`. Entries point at the same
 * `Card` object instances held in the catalog (no cloning) — the
 * engine assigns unique instance IDs on placement, so shared card
 * definitions are safe.
 *
 * Order within the output reflects the decklist order (repeated
 * entries are contiguous). The engine shuffles the deck zone during
 * `mulliganOnEnter`, so input order does not affect match play.
 *
 * Throws on an unknown `cardNumber` — callers should
 * `validateDeckList` first to surface all issues rather than
 * short-circuiting on the first missing card.
 */
export function expandDeck(list: DeckList, options: ExpandDeckOptions): ExpandedDeck {
  const deck: Card[] = [];
  for (const entry of list.cards) {
    // Fail fast on malformed counts. `validateDeckList` catches these
    // too, but callers that skip validation would otherwise silently
    // produce an under-sized deck (the `for` loop just doesn't run
    // when count is 0 or negative), and the mismatch only surfaces
    // deep inside the engine's draw/shuffle paths.
    if (!Number.isInteger(entry.count) || entry.count <= 0) {
      throw new Error(
        `expandDeck: "${entry.cardNumber}" has non-positive count ${entry.count} in deck "${list.name}"`,
      );
    }
    const card = getCard(options.catalog, entry.cardNumber);
    if (!card) {
      throw new Error(`expandDeck: unknown card "${entry.cardNumber}" in deck "${list.name}"`);
    }
    for (let i = 0; i < entry.count; i++) deck.push(card);
  }

  if (!Number.isInteger(list.resource.count) || list.resource.count <= 0) {
    throw new Error(
      `expandDeck: resource deck has non-positive count ${list.resource.count} in deck "${list.name}"`,
    );
  }
  const resCard = getCard(options.catalog, list.resource.cardNumber);
  if (!resCard) {
    throw new Error(
      `expandDeck: unknown resource card "${list.resource.cardNumber}" in deck "${list.name}"`,
    );
  }
  const resourceDeck: Card[] = [];
  for (let i = 0; i < list.resource.count; i++) resourceDeck.push(resCard);

  return { deck, resourceDeck };
}
