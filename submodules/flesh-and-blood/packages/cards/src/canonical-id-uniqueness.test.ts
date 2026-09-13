import { describe, expect, it } from "vitest";
import { STRUCTURED_CARDS_BY_CANONICAL_ID } from "./generated/card-registry.generated.ts";
import { fleshAndBloodCatalog } from "./generated/flesh-and-blood-catalog.ts";

/**
 * Each catalog identity has one runtime-registry row,
 * independent of every set and collector-number printing.
 */
describe("canonical id uniqueness", () => {
  it("matches the canonical catalog exactly", () => {
    const ids = fleshAndBloodCatalog.cards.map((card) => card.canonicalId);

    expect(new Set(ids).size).toBe(ids.length);
    expect(STRUCTURED_CARDS_BY_CANONICAL_ID.size).toBe(ids.length);
    expect(ids.filter((id) => !STRUCTURED_CARDS_BY_CANONICAL_ID.has(id))).toEqual([]);
  });
});
