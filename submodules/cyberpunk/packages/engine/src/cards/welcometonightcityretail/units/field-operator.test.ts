import { describe, expect, it } from "vite-plus/test";
import { alphaRuthlessLowlife, welcomeToNightCityRetailFieldOperator } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Field Operator", () => {
  it("draws on play when friendly Street Cred is even", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailFieldOperator],
        deck: [alphaRuthlessLowlife],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      alphaRuthlessLowlife.id,
    );
  });

  it("does not draw on play when friendly Street Cred is odd", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailFieldOperator],
      deck: [alphaRuthlessLowlife],
      eddies: 3,
      gigArea: [{ dieType: "d6", faceValue: 3 }],
    });

    engine.playCard(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
  });
});
