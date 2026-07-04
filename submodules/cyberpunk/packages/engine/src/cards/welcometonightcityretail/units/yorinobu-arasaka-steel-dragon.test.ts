import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaRuthlessLowlife,
  welcomeToNightCityRetailYorinobuArasakaSteelDragon,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Yorinobu Arasaka - Steel Dragon", () => {
  it("plays a cheap Unit for free and lets it attack rival Units this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailYorinobuArasakaSteelDragon, alphaRuthlessLowlife],
        eddies: 7,
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    engine.playCard(welcomeToNightCityRetailYorinobuArasakaSteelDragon, { as: P1 });
    engine.resolveEffectTarget(alphaRuthlessLowlife, { as: P1 });
    engine.resolveCardToPlay(alphaRuthlessLowlife, { as: P1 });

    const lowlifeId = engine.findCardId(alphaRuthlessLowlife, "field", P1);
    expect(getEffectiveRules(engine.getState(), lowlifeId)).toContain(
      "canAttackOnPlayedTurnAgainstUnits",
    );
    expect(() =>
      engine.attackUnit(alphaRuthlessLowlife, alphaCorpoSecurity, { as: P1 }),
    ).not.toThrow();
  });
});
