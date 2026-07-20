import { describe, expect, it } from "bun:test";
import { getAllCardsByIdSync } from "@tcg/lorcana-cards/cards/sync";
import { lorcanaServerAdapter } from "./adapter";

describe("Lorcana metadata projection", () => {
  it("projects individual inks and the exact ink combination", () => {
    const cards = Object.values(getAllCardsByIdSync());
    const first = cards.find((card) => card.inkType.length > 0)!;
    const second = cards.find((card) => card.inkType.some((ink) => !first.inkType.includes(ink)))!;
    const projection = lorcanaServerAdapter.metadata!.projectDeck([
      { cardId: first.id, quantity: 4 },
      { cardId: second.id, quantity: 4 },
    ]);
    expect(projection.facets.filter((facet) => facet.type === "color")).toHaveLength(
      projection.colors.length,
    );
    expect(projection.facets.filter((facet) => facet.type === "color-combination")).toHaveLength(1);
  });

  it("uses the Lorcana quantity profile for templates and synergies", () => {
    const card = Object.values(getAllCardsByIdSync())[0]!;
    expect(
      lorcanaServerAdapter.metadata!.normalizeTemplate([{ cardId: card.id, quantity: 3 }]),
    ).toEqual([{ cardId: card.id, quantity: 2 }]);
    expect(
      lorcanaServerAdapter.metadata!.normalizeSynergy([{ cardId: card.id, quantity: 3 }]),
    ).toEqual([{ cardId: card.id, quantity: 1 }]);
  });
});
