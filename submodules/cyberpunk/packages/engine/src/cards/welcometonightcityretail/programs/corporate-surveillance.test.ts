import { describe, expect, it } from "vite-plus/test";
import {
  embracingPowerRetailStarterDeckMinotaur,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailCorporateSurveillance,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Corporate Surveillance", () => {
  it("lets the player choose one rival Unit with cost 4 or less to spend", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCorporateSurveillance],
        eddies: 2,
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailCorporateSurveillance, { as: P1 });
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected target choice.");
    const eligibleDefinitions = (choice.payload.eligibleIds ?? []).map(
      (id) => engine.getState().G.cardIndex[id]!.definitionId,
    );
    expect(eligibleDefinitions).toEqual(
      expect.arrayContaining([
        welcomeToNightCityRetailCorpoSecurity.id,
        welcomeToNightCityRetailFieldOperator.id,
      ]),
    );

    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );
    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2).meta.spent).toBe(
      false,
    );
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
        field: [{ card: embracingPowerRetailStarterDeckMinotaur, spent: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailCorporateSurveillance, { as: P1 });

    expect(engine.getPrompt(P1).choice).toBeNull();
    expect(engine.getCard(embracingPowerRetailStarterDeckMinotaur, "field", P2).meta.spent).toBe(
      false,
    );
  });
});
