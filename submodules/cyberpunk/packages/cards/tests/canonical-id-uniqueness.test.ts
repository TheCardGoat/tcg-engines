import { describe, expect, it } from "vite-plus/test";

import {
  getMergedCyberpunkCards,
  getMergedCyberpunkCardsById,
  structuredCards,
} from "../src/index.ts";

// Dum Dum's retail definition id is the canonical identity stored in decks,
// replays, and bundle keys — the consolidation must never re-parent it.
const DUM_DUM_RETAIL_ID = "3b3f941d-aa58-4337-99dc-4af3fd3ccd47";
const DUM_DUM_SLUG = "dum-dum-maelstrom-triggerman";

describe("canonical card uniqueness", () => {
  it("authors exactly one definition per slug", () => {
    const slugs = structuredCards.map((card) => card.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has one canonical pool entry per structured definition (identity-preserving merge)", () => {
    const merged = getMergedCyberpunkCards();
    expect(merged.length).toBe(structuredCards.length);
    const byId = new Map(structuredCards.map((card) => [card.id, card]));
    for (const canonical of merged) {
      expect(byId.get(canonical.id)?.slug).toBe(canonical.slug);
    }
  });

  it("stamps canonicalId = slug and a known appearance identity on every printing", () => {
    for (const card of getMergedCyberpunkCards()) {
      expect(card.canonicalId).toBe(card.slug);
      for (const printing of card.printings) {
        expect(typeof printing.artId).toBe("string");
        expect(printing.artId.length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps definition ids unique and stable across the consolidation", () => {
    const ids = structuredCards.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(getMergedCyberpunkCardsById().get(DUM_DUM_RETAIL_ID)?.slug).toBe(DUM_DUM_SLUG);
  });
});
