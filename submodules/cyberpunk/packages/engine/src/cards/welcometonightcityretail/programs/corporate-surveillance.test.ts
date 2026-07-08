import { describe, expect, it } from "vite-plus/test";
import {
  alphaArmoredMinotaur,
  alphaCorpoSecurity,
  welcomeToNightCityRetailCorporateSurveillance,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Corporate Surveillance", () => {
  it("spends a rival Unit with cost 4 or less and moves the Program to trash", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCorporateSurveillance],
        eddies: 2,
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailCorporateSurveillance, { as: P1 });

    expect(engine.getCard(alphaCorpoSecurity, "field", P2).meta.spent).toBe(true);
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorporateSurveillance.id,
    );
  });

  it("does not offer rival Units above cost 4 as legal targets", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCorporateSurveillance],
        eddies: 2,
      },
      {
        field: [{ card: alphaArmoredMinotaur, spent: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailCorporateSurveillance, { as: P1 });

    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(engine.getCard(alphaArmoredMinotaur, "field", P2).meta.spent).toBe(false);
  });
});
