import { describe, expect, it } from "vitest";
import { structuredCards } from "@tcg/cyberpunk-cards";
import { cyberpunkServerAdapter } from "./adapter";

describe("Cyberpunk metadata projection", () => {
  it("declares lineup, Legend, and color facets for both ranking layers", () => {
    expect(cyberpunkServerAdapter.metadata!.facets).toSatisfy((definitions) =>
      definitions
        .filter((definition) => definition.type !== "ram-coalition")
        .every((definition) => definition.ranking.specialistSkill && definition.ranking.mastery),
    );
  });

  it("projects Legends, their lineup, and exact colors deterministically", () => {
    const legends = structuredCards.filter((card) => card.type === "legend").slice(0, 3);
    expect(legends).toHaveLength(3);
    const deck = legends.map((card) => ({ cardId: card.id, quantity: 1 }));

    const first = cyberpunkServerAdapter.metadata!.projectDeck(deck);
    const second = cyberpunkServerAdapter.metadata!.projectDeck([...deck].reverse());

    expect(first).toEqual(second);
    expect(first.projectionVersion).toBe(2);
    expect(first.facets.filter((facet) => facet.type === "ram-coalition")).toHaveLength(1);
    expect(first.facets.filter((facet) => facet.type === "legend")).toHaveLength(3);
    expect(first.facets.filter((facet) => facet.type === "legend-lineup")).toHaveLength(1);
    expect(first.facets.filter((facet) => facet.type === "color-combination")).toHaveLength(1);
  });

  it("uses the approved alpha RAM for Rebecca in both public-id and canonical projections", () => {
    const rebecca = structuredCards.find((card) => card.canonicalId === "rebecca-having-a-moment")!;
    expect(rebecca.ram).toBe(2);
    expect(rebecca.color).toBe("red");
    for (const cardId of [rebecca.id, rebecca.canonicalId]) {
      const result = cyberpunkServerAdapter.metadata!.projectDeck([{ cardId, quantity: 1 }]);
      expect(
        result.facets.find((facet) => facet.type === "legend")?.members?.[0].attributes?.ram,
      ).toBe(2);
      expect(result.facets.some((facet) => facet.type === "ram-coalition")).toBe(false);
    }
  });

  it("keeps opposite RAM allocations separate for real catalog Legends", () => {
    const green = structuredCards
      .filter((card) => card.type === "legend" && card.color === "green")
      .slice(0, 2);
    const red = structuredCards
      .filter((card) => card.type === "legend" && card.color === "red")
      .slice(0, 2);
    expect(green).toHaveLength(2);
    expect(red).toHaveLength(2);
    const project = (cards: typeof green) =>
      cyberpunkServerAdapter.metadata!.projectDeck(
        cards.map((card) => ({ cardId: card.id, quantity: 1 })),
      );
    const greenHeavy = project([...green, red[0]!]);
    const redHeavy = project([green[0]!, ...red]);
    expect(greenHeavy.colors).toEqual(redHeavy.colors);
    expect(greenHeavy.facets.find((facet) => facet.type === "ram-coalition")?.key).toBe(
      "blue:0|green:4|red:2|yellow:0",
    );
    expect(redHeavy.facets.find((facet) => facet.type === "ram-coalition")?.key).toBe(
      "blue:0|green:2|red:4|yellow:0",
    );
  });

  it("keeps Legends in templates but excludes them from synergy packages", () => {
    const legend = structuredCards.find((card) => card.type === "legend")!;
    const main = structuredCards.find((card) => card.type !== "legend")!;
    const deck = [
      { cardId: legend.id, quantity: 1 },
      { cardId: main.id, quantity: 3 },
    ];
    expect(cyberpunkServerAdapter.metadata!.normalizeTemplate(deck)).toEqual(
      [
        { cardId: legend.id, quantity: 1 },
        { cardId: main.id, quantity: 2 },
      ].sort((left, right) => left.cardId.localeCompare(right.cardId)),
    );
    expect(cyberpunkServerAdapter.metadata!.normalizeSynergy(deck)).toEqual([
      { cardId: main.id, quantity: 1 },
    ]);
  });
});
