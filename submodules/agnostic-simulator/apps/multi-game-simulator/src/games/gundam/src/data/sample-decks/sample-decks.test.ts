import { describe, expect, it } from "vite-plus/test";

import { validateDeckList } from "@tcg/gundam-engine";

import { DEFAULT_DECK_ID, SAMPLE_DECKS, SAMPLE_DECK_IDS, buildGundamCardCatalog } from "./index.ts";

/**
 * Compile-and-validate gate for sample decks. If any deck is edited
 * to reference a cardNumber that doesn't exist or violates the 4-of
 * rule, this fails before the deck ships. Runs against the real
 * `@tcg/gundam-cards` catalog — no stub.
 */
describe("sample decks", () => {
  const catalog = buildGundamCardCatalog();

  for (const id of SAMPLE_DECK_IDS) {
    const deck = SAMPLE_DECKS[id];
    it(`${id}: passes validateDeckList against the real card catalog`, () => {
      const result = validateDeckList(deck, { catalog });
      if (!result.ok) {
        throw new Error(`${id} invalid:\n  - ${result.errors.join("\n  - ")}`);
      }
      expect(result.ok).toBe(true);
    });
  }

  it("exposes a default deck id that resolves to a real deck", () => {
    expect(SAMPLE_DECKS[DEFAULT_DECK_ID]).toBeDefined();
  });

  it("catalog contains the resources referenced by each deck", () => {
    for (const id of SAMPLE_DECK_IDS) {
      const deck = SAMPLE_DECKS[id];
      const resource = catalog[deck.resource.cardNumber];
      expect(resource, `${id} → ${deck.resource.cardNumber}`).toBeDefined();
      expect(resource?.type).toBe("resource");
    }
  });
});
