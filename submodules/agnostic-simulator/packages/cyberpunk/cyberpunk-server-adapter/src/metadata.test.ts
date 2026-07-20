import { describe, expect, it } from "vitest";
import { structuredCards } from "@tcg/cyberpunk-cards";
import { cyberpunkServerAdapter } from "./adapter";

describe("Cyberpunk metadata projection", () => {
  it("projects Legends, their lineup, and exact colors deterministically", () => {
    const legends = structuredCards.filter((card) => card.type === "legend").slice(0, 3);
    expect(legends).toHaveLength(3);
    const deck = legends.map((card) => ({ cardId: card.id, quantity: 1 }));

    const first = cyberpunkServerAdapter.metadata!.projectDeck(deck);
    const second = cyberpunkServerAdapter.metadata!.projectDeck([...deck].reverse());

    expect(first).toEqual(second);
    expect(first.facets.filter((facet) => facet.type === "legend")).toHaveLength(3);
    expect(first.facets.filter((facet) => facet.type === "legend-lineup")).toHaveLength(1);
    expect(first.facets.filter((facet) => facet.type === "color-combination")).toHaveLength(1);
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
