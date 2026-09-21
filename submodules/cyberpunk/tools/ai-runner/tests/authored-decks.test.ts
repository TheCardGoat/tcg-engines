import { describe, expect, test } from "vite-plus/test";
import {
  assertGeneratedDeckIsStrictlyLegal,
  createAuthoredBotLabDecks,
  createStructuredCatalog,
  deckListFromGenerated,
} from "../src/legal-decks.ts";
import { authoredBotLabDeckSpecs } from "../src/authored-decks.ts";

describe("authored bot-lab decks", () => {
  const decks = createAuthoredBotLabDecks();

  test("exposes one deck per spec", () => {
    expect(decks.map((deck) => deck.id)).toEqual(authoredBotLabDeckSpecs.map((spec) => spec.id));
  });

  test("every deck is strictly legal against the real catalog", () => {
    for (const deck of decks) {
      expect(() => assertGeneratedDeckIsStrictlyLegal(deck)).not.toThrow();
    }
  });

  test("every main deck holds exactly 40 cards within the copy cap", () => {
    const catalog = createStructuredCatalog();
    for (const deck of decks) {
      expect(deck.mainDeck).toHaveLength(40);
      const counts = new Map<string, number>();
      for (const slug of deck.mainDeck) counts.set(slug, (counts.get(slug) ?? 0) + 1);
      for (const [slug, count] of counts) {
        expect(count, `${deck.id}: ${slug}`).toBeLessThanOrEqual(3);
        expect(catalog.get(slug), `${deck.id}: ${slug}`).toBeDefined();
      }
    }
  });

  test("carries the spec's English title on each generated deck", () => {
    const titles = decks.map((deck) => deck.title);
    expect(new Set(titles).size).toBe(decks.length);
    expect(titles).toEqual(authoredBotLabDeckSpecs.map((spec) => spec.title));
  });

  test("converts to engine deck lists for both seats", () => {
    for (const deck of decks) {
      const list = deckListFromGenerated(deck, "p1");
      expect(list.playerId).toBe("p1");
      expect(list.legends).toHaveLength(3);
      expect(list.mainDeck).toHaveLength(40);
    }
  });
});
