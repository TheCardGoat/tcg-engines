import { describe, expect, it } from "vitest";
import { createGrandArchiveCatalogIndex } from "./catalog.ts";

describe("Grand Archive catalog index", () => {
  it("resolves canonical, printing, and slug identities without parsing card text", () => {
    const card = {
      canonicalId: "card-uuid",
      slug: "looking-glass",
      name: "The Looking Glass",
      externalIds: { gatcgIndex: "card-uuid" },
      types: ["REGALIA"],
      subtypes: ["ITEM"],
      classes: [],
      elements: ["NORM"],
      cost: { type: "memory", value: "0" },
      memoryCost: 0,
      reserveCost: null,
      level: null,
      power: null,
      life: null,
      durability: null,
      speed: null,
      effect: null,
      effectRaw: null,
      effectHtml: null,
      legality: null,
      references: [],
      referencedBy: [],
      relatedFaces: [],
      printings: [
        {
          id: "edition-uuid",
          artId: "edition-uuid",
          setCode: "P24",
          collectorNumber: "001",
          rarity: "1",
          imageUrl: "https://api.gatcg.com/cards/images/example.jpg",
          editionSlug: "looking-glass-p24",
          configuration: "default",
          orientation: null,
          illustrator: null,
          flavor: null,
          set: {
            id: "set-uuid",
            prefix: "P24",
            name: "Promotional 2024",
            language: "EN",
            releaseDate: "2024-01-24",
          },
        },
      ],
    } as const;
    const index = createGrandArchiveCatalogIndex({
      schemaVersion: 1,
      game: "grand-archive",
      provenance: null,
      cards: [card],
    });
    expect(index.getCard("card-uuid")).toBe(card);
    expect(index.getCard("edition-uuid")).toBe(card);
    expect(index.getCard("looking-glass")).toBe(card);
    expect(index.search("regalia")).toEqual([card]);
  });
});
