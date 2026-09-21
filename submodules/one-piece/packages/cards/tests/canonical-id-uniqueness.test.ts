import { describe, expect, it } from "vite-plus/test";
import { allCards, cardCatalog } from "./../src/index.ts";

/**
 * Each catalog identity has exactly one definition, independent of every set
 * and collector-number printing (canonical-card consolidation). Reprints and
 * alternate arts live on the canonical definition's printings[].
 */
describe("canonical id uniqueness", () => {
  it("has exactly one definition per canonical id", () => {
    const canonicalIds = allCards.map((card) => card.canonicalId);
    const definitionIds = allCards.map((card) => card.id);

    expect(new Set(canonicalIds).size).toBe(canonicalIds.length);
    expect(definitionIds).toEqual(canonicalIds);
  });

  it("matches the runtime catalog exactly", () => {
    for (const card of allCards) {
      expect(cardCatalog.get(card.id)?.canonicalId).toBe(card.canonicalId);
    }
  });

  it("resolves every printing id to its owning card", () => {
    const printingIds = allCards.flatMap((card) => card.printings.map((printing) => printing.id));
    expect(new Set(printingIds).size).toBe(printingIds.length);
  });
});
