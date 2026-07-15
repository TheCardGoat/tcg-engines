import { describe, expect, it } from "vite-plus/test";
import { CyberpunkTestEngine, P1 } from "../../testing/index.ts";
import { promoLucynaKushinada } from "@tcg/cyberpunk-cards";

const card = promoLucynaKushinada; // legend, cost null, power 0, no abilities (vanilla promo)

describe("Lucyna Kushinada", () => {
  it("definition matches expected stats", () => {
    expect(card.type).toBe("legend");
    expect(card.cost).toBeNull();
    expect(card.power).toBe(0);
    expect(card.abilities).toEqual([]);
    expect(card.set.code).toBe("promo");
  });

  it("can be placed in the legend area at fixture setup", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [card],
    });

    const legendArea = engine.getCardsInZone("legendArea", P1);
    expect(legendArea.some((c) => c.definitionId === card.id)).toBe(true);
  });
});
