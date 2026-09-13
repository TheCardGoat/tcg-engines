import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailWildInTheStreets,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Wild in the Streets", () => {
  it("asks which spent Unit to defeat", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailWildInTheStreets], eddies: 5 },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true },
          { card: welcomeToNightCityRetailFieldOperator, spent: true },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailWildInTheStreets, { as: P1 });
    expect(engine.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it("leaves a ready Unit on the field", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [welcomeToNightCityRetailWildInTheStreets], eddies: 5 },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }] },
    );

    engine.playCard(welcomeToNightCityRetailWildInTheStreets, { as: P1 });

    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });
});
