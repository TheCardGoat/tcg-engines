import { describe, expect, it } from "vite-plus/test";
import { alphaCorpoSecurity, welcomeToNightCityRetailPeaceOffering } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Peace Offering", () => {
  it("sets one Gig to another Gig's value and draws from a value-pair", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPeaceOffering],
        deck: [alphaCorpoSecurity],
        eddies: 1,
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 6 },
        ],
      },
      {},
      { preserveDeckOrder: true },
    );
    const handBefore = engine.getHandCount(P1);

    engine.playCard(welcomeToNightCityRetailPeaceOffering, { as: P1 });
    const selectedGigIds = engine.getGigDice(P1).map((die) => die.id);
    engine.resolveEffectTargetIds(selectedGigIds, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((card) => card.definitionId === welcomeToNightCityRetailPeaceOffering.id),
    ).toBe(true);
  });
});
