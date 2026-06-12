import { describe, expect, it } from "vite-plus/test";
import { promoLucynaKushinada } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Lucyna Kushinada", () => {
  it("is a zero-power promo legend with no rules text or abilities", () => {
    expect(promoLucynaKushinada.type).toBe("legend");
    expect(promoLucynaKushinada.set.code).toBe("promo");
    expect(promoLucynaKushinada.cost).toBeNull();
    expect(promoLucynaKushinada.power).toBe(0);
    expect(promoLucynaKushinada.rulesText).toBeNull();
    expect(promoLucynaKushinada.abilities).toEqual([]);
  });

  it("can be included face down in a player's legend area", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: promoLucynaKushinada, faceDown: true }],
    });

    const lucyna = engine.getCard(promoLucynaKushinada, "legendArea", P1);
    expect(lucyna.meta.faceDown).toBe(true);
    expect(lucyna.definitionId).toBe(promoLucynaKushinada.id);
  });
});
