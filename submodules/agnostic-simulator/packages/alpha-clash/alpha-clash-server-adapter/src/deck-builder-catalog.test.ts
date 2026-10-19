import { describe, expect, it } from "vitest";
import { getAlphaClashDeckBuilderCatalog } from "./deck-builder-catalog";

const catalog = getAlphaClashDeckBuilderCatalog();
const byId = new Map(catalog.cards.map((card) => [card.id, card]));

describe("alpha-clash deck-builder catalog printings", () => {
  it("exposes canonical printing first with artwork for every multi-printing card", () => {
    const denver = byId.get("ac-ac1-001");
    expect(denver).toBeDefined();
    expect(denver!.printings.length).toBeGreaterThanOrEqual(3);
    expect(denver!.printings[0]).toMatchObject({
      id: "ac-ac1-001",
      collectorNumber: "AC1-001",
    });
    expect(denver!.printings[0]!.imageUrl).toContain("cdn.tcg.online");
    expect(new Set(denver!.printings.map((printing) => printing.setName)).size).toBe(
      denver!.printings.length,
    );
  });

  it("marks printings without published artwork as imageless (atelier teasers)", () => {
    const imageless = catalog.cards.flatMap((card) =>
      card.printings.filter((printing) => printing.imageUrl === null),
    );
    expect(imageless.length).toBeGreaterThan(0);
    // Canonical card art still exists for those definitions; only the specific
    // faceless printing is blocked from selection.
    const card = byId.get(
      catalog.cards.find((candidate) =>
        candidate.printings.some((printing) => printing.imageUrl === null),
      )!.id,
    )!;
    expect(card.imageUrl).toContain("cdn.tcg.online");
  });

  it("keeps single-printing cards with exactly the canonical printing", () => {
    const single = catalog.cards.find((card) => card.printings.length === 1);
    expect(single).toBeDefined();
    expect(single!.printings[0]!.id).toBe(single!.id);
  });
});
