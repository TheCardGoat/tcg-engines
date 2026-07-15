import { describe, it } from "bun:test";

/**
 * `search-deck` suspends for the player to pick a card from their deck
 * matching a filter, then moves the chosen card and shuffles the deck.
 * Requires suspension plumbing + filter evaluator; simulator integration
 * tests cover cards like "Book of Secrets".
 */
describe("search-deck", () => {
  it.todo("unit: add search-deck coverage once suspension + filter plumbing is in the harness");
});
