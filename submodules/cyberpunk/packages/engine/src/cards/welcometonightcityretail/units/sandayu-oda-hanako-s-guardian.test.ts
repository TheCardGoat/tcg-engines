import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailSandayuOdaHanakoSGuardian,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Sandayu Oda - Hanako's Guardian", () => {
  it("spends one rival unit for each friendly value-pair", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSandayuOdaHanakoSGuardian],
        eddies: 7,
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
      {
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
        ],
      },
    );

    expect(
      engine.playCard(welcomeToNightCityRetailSandayuOdaHanakoSGuardian, { as: P1 }),
    ).toMatchObject({
      success: true,
    });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2).meta.spent).toBe(
      true,
    );
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      false,
    );
  });

  it("can attack rival units the turn it is played", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailSandayuOdaHanakoSGuardian],
        eddies: 7,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailSandayuOdaHanakoSGuardian, { as: P1 });
    expect(
      engine.attackUnit(
        welcomeToNightCityRetailSandayuOdaHanakoSGuardian,
        welcomeToNightCityRetailCorpoSecurity,
        {
          as: P1,
        },
      ),
    ).toMatchObject({
      success: true,
    });
  });
});
