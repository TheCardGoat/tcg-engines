import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJapantownJonin,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Japantown Jonin", () => {
  it("gives a friendly Unit +2 power this turn when played", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailJapantownJonin],
      field: [{ card: welcomeToNightCityRetailFieldOperator, hasLag: false }],
      eddies: 2,
    });
    const target = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);

    engine.playCard(welcomeToNightCityRetailJapantownJonin, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(getEffectivePower(engine.getState(), target.instanceId)).toBe(
      welcomeToNightCityRetailFieldOperator.power + 2,
    );

    engine.completeTurn({ as: P1 });
    expect(getEffectivePower(engine.getState(), target.instanceId)).toBe(
      welcomeToNightCityRetailFieldOperator.power,
    );
  });

  it("can target itself with the power boost", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailJapantownJonin],
      eddies: 2,
    });

    engine.playCard(welcomeToNightCityRetailJapantownJonin, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailJapantownJonin, { as: P1 });

    const jonin = engine.getCard(welcomeToNightCityRetailJapantownJonin, "field", P1);
    expect(getEffectivePower(engine.getState(), jonin.instanceId)).toBe(
      welcomeToNightCityRetailJapantownJonin.power + 2,
    );
  });
});
