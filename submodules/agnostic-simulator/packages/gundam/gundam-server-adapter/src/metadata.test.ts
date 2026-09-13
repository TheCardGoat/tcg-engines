import { describe, expect, it } from "vitest";
import * as gundamCards from "@tcg/gundam-cards";
import type { Card } from "@tcg/gundam-types";
import { gundamServerAdapter } from "./adapter";

function cards(): Card[] {
  return Object.values(gundamCards).filter(
    (value): value is Card =>
      typeof value === "object" && value !== null && "cardNumber" in value && "type" in value,
  );
}

describe("Gundam metadata projection", () => {
  it("declares deck color facets for specialist skill and mastery", () => {
    expect(gundamServerAdapter.metadata!.facets).toSatisfy((definitions) =>
      definitions.every(
        (definition) => definition.ranking.specialistSkill && definition.ranking.mastery,
      ),
    );
  });

  it("projects the exact non-resource color set", () => {
    const colored = cards().find((card) => card.type !== "resource" && card.color)!;
    const projection = gundamServerAdapter.metadata!.projectDeck([
      { cardId: colored.id, quantity: 4 },
    ]);
    expect(projection.colors).toEqual([colored.color]);
    expect(projection.facets.some((facet) => facet.type === "color-combination")).toBe(true);
  });

  it("removes resources from strategy fingerprints", () => {
    const resource = cards().find((card) => card.type === "resource")!;
    expect(
      gundamServerAdapter.metadata!.normalizeTemplate([{ cardId: resource.id, quantity: 10 }]),
    ).toEqual([]);
    expect(
      gundamServerAdapter.metadata!.normalizeSynergy([{ cardId: resource.id, quantity: 10 }]),
    ).toEqual([]);
  });
});
