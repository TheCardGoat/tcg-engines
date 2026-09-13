import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailPadreManOfTheCross,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const padre = welcomeToNightCityRetailPadreManOfTheCross;

describe("Padre — Man of the Cross", () => {
  it("is a green Fixer/Ganger/Valentino legend", () => {
    expect(padre).toMatchObject({
      type: "legend",
      color: "green",
      classifications: ["Fixer", "Ganger", "Valentino"],
      printNumber: "074",
    });
  });

  it("on Call can spend a rival Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: padre, faceDown: true }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false }],
      },
    );

    engine.callLegend(padre, { as: P1 });
    engine.resolveChooseEffect("spend", { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );
  });

  it("on Call can draw 1 instead", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: padre, faceDown: true }],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      eddies: 2,
    });
    const handBefore = engine.getHandCount(P1);
    engine.callLegend(padre, { as: P1 });
    engine.resolveChooseEffect("draw", { as: P1 });
    expect(engine.getHandCount(P1)).toBe(handBefore + 1);
  });

  it("spends to copy one Gig's value onto another", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        legendArea: [{ card: padre, faceDown: false, spent: false }],
        gigArea: [{ dieType: "d6", faceValue: 5 }],
      },
      {
        gigArea: [{ dieType: "d8", faceValue: 2 }],
      },
    );

    engine.activateAbility(padre, 1, { as: P1 });
    const source = engine.findGigIdByType(P1, "d6");
    const target = engine.findGigIdByType(P2, "d8");
    engine.resolveEffectTargetIds([source, target], { as: P1 });

    expect(engine.getGigDice(P2).find((die) => die.id === target)?.faceValue).toBe(5);
    expect(engine.getCard(padre, "legendArea", P1).meta.spent).toBe(true);
  });
});
