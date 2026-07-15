import { describe, expect, it } from "vite-plus/test";
import {
  boxTopperRetailSaburoArasakaStubbornPatriarch,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailFieldOperator,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Saburo Arasaka - Stubborn Patriarch (box topper retail)", () => {
  it("gives a friendly Arasaka Unit +1 power while it attacks", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false, playedThisTurn: false },
        ],
        legendArea: [{ card: boxTopperRetailSaburoArasakaStubbornPatriarch, faceDown: false }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );
    const fieldOperatorId = engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1);

    expect(getEffectivePower(engine.getState(), fieldOperatorId)).toBe(
      welcomeToNightCityRetailFieldOperator.power,
    );

    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailCorpoSecurity,
      {
        as: P1,
      },
    );

    expect(getEffectivePower(engine.getState(), fieldOperatorId)).toBe(
      welcomeToNightCityRetailFieldOperator.power + 1,
    );
  });

  it("does not boost a non-Arasaka Unit while it attacks", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, playedThisTurn: false }],
        legendArea: [{ card: boxTopperRetailSaburoArasakaStubbornPatriarch, faceDown: false }],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }],
      },
    );
    const delamainId = engine.findCardId(welcomeToNightCityRetailDelamainCab, "field", P1);

    engine.attackUnit(welcomeToNightCityRetailDelamainCab, welcomeToNightCityRetailCorpoSecurity, {
      as: P1,
    });

    expect(getEffectivePower(engine.getState(), delamainId)).toBe(
      welcomeToNightCityRetailDelamainCab.power,
    );
  });
});
