import { describe, expect, it } from "vite-plus/test";
import { promoLucynaKushinada } from "@tcg/cyberpunk-cards";
import {
  CyberpunkTestEngine,
  P1,
  expectCallableLegend,
  expectNoPendingChoice,
} from "@cyberpunk-engine/testing/index.ts";

// Lucyna Kushinada is a promo Legend with no card-specific abilities. Her tests
// exercise the core Legend rules (Call, flip, Eddie spend) through the engine.
const lucyna = promoLucynaKushinada;

describe("Lucyna Kushinada", () => {
  it("appears as callable while face-down", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: lucyna, faceDown: true }],
      eddies: 2,
    });
    expectCallableLegend(engine, lucyna);
  });

  it("flips face-up and costs 1 Eddie when Called, creating no ability prompt", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [lucyna],
      eddies: 2,
    });

    engine.callLegend(lucyna);

    const calledLucyna = engine.getCard(lucyna, "legendArea", P1);
    // Calling flips the Legend face-up and spends exactly 1 Eddie.
    expect(calledLucyna.meta.faceDown).toBe(false);
    expect(calledLucyna.meta.spent).toBe(false);
    expect(engine.getEddies(P1)).toBe(1);
    // No card-specific ability → no pending choice after the Call.
    expectNoPendingChoice(engine);
  });

  it("can be spent as 1 €$ (Eddie currency) like any Legend", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: lucyna, faceDown: false }],
      eddies: 0,
    });

    // A Legend can be spent to act as 1 Eddie when paying a cost. Spending
    // turns the Legend sideways — it is now a spent Eddie source.
    expect(engine.getCard(lucyna, "legendArea", P1).meta.spent).toBe(false);
    engine.judgeSpendCard(lucyna, { as: P1 });
    expect(engine.getCard(lucyna, "legendArea", P1).meta.spent).toBe(true);
  });
});
