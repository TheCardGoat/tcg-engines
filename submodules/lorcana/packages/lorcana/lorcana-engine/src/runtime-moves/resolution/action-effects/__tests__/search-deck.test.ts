import { describe, expect, it } from "bun:test";
import type { CardInstanceId } from "#core";
import type { SearchDeckEffect } from "@tcg/lorcana-types";
import { matchesSearchFilter } from "../search-deck-effect";

/**
 * `search-deck` suspends for the player to pick a card from their deck
 * matching a filter, then moves the chosen card and shuffles the deck.
 * Requires suspension plumbing + filter evaluator; simulator integration
 * tests cover cards like "Book of Secrets".
 */
describe("search-deck", () => {
  it("fails closed for an unsupported persisted filter", () => {
    const effect = {
      type: "search-deck",
      filters: [{ type: "unsupported-filter" }],
    } as unknown as SearchDeckEffect;
    const ctx = {
      cards: {
        getDefinition: () => ({ cardType: "item", cost: 2 }),
      },
    };

    expect(matchesSearchFilter(ctx as never, "deck-card" as CardInstanceId, effect)).toBe(false);
  });

  it.todo("unit: add search-deck coverage once suspension + filter plumbing is in the harness");
});
