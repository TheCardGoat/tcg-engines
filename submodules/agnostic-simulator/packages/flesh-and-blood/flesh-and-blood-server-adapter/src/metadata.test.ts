import { describe, expect, it } from "vitest";
import { allFleshAndBloodCards } from "@tcg/flesh-and-blood-cards/catalog";
import { fleshAndBloodMetadataAdapter } from "./metadata";

describe("Flesh and Blood metadata projection", () => {
  it("collapses hero variants to the hero moniker for mastery", () => {
    const variants = ["Bravo, Showstopper", "Bravo, Star of the Show"].map((name) =>
      allFleshAndBloodCards.find((card) => card.name === name),
    );
    expect(variants.every(Boolean)).toBe(true);

    for (const hero of variants) {
      const projection = fleshAndBloodMetadataAdapter.projectDeck([
        { cardId: hero!.canonicalId, quantity: 1 },
      ]);
      expect(projection.projectionVersion).toBe(2);
      expect(projection.facets).toEqual([
        expect.objectContaining({ type: "hero", key: "bravo", label: "Bravo" }),
      ]);
    }
    expect(fleshAndBloodMetadataAdapter.facets).toEqual([
      expect.objectContaining({ type: "hero", ranking: { specialistSkill: true, mastery: true } }),
    ]);
  });
});
