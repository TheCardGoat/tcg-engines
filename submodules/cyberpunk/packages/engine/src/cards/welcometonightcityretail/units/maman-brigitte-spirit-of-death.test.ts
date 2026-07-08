import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailMamanBrigitteSpiritOfDeath,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Maman Brigitte", () => {
  it("requires discarding two Programs before bottom-decking an unequipped rival unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailMamanBrigitteSpiritOfDeath,
          welcomeToNightCityRetailCorporateSurveillance,
          welcomeToNightCityRetailFloorIt,
        ],
        eddies: 5,
      },
      {
        field: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.playCard(welcomeToNightCityRetailMamanBrigitteSpiritOfDeath, { as: P1 });

    engine.resolveDiscardFromHand(
      [welcomeToNightCityRetailCorporateSurveillance, welcomeToNightCityRetailFloorIt],
      { as: P1 },
    );
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toEqual([
      welcomeToNightCityRetailCorporateSurveillance.id,
      welcomeToNightCityRetailFloorIt.id,
    ]);
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("deck", P2).at(-1)?.definitionId).toBe(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });
});
