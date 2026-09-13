import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailJohnnySilverhandRockingRenegade,
  welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
} from "@tcg/cyberpunk-cards";
import { getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Johnny Silverhand — Rocking Renegade", () => {
  it("is a red Merc/Rocker/Samurai legend with an activated spend ability", () => {
    const card = welcomeToNightCityRetailJohnnySilverhandRockingRenegade;
    expect(card.type).toBe("legend");
    expect(card.color).toBe("red");
    expect(card.classifications).toEqual(["Merc", "Rocker", "Samurai"]);
    expect(card.printNumber).toBe("003");
    expect(card.abilities[0]?.trigger).toMatchObject({ trigger: "activated" });
    expect(card.abilities[0]?.costs?.[0]).toMatchObject({
      cost: "payEddies",
      amount: 2,
      reduction: {
        reductionPerCount: 1,
        min: 0,
      },
    });
  });

  it("grants attack-on-play to a non-Rocker without giving +2 power", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: welcomeToNightCityRetailJohnnySilverhandRockingRenegade,
          faceDown: false,
          spent: false,
        },
      ],
      // Rocker also present — must NOT make non-Rocker receive +2.
      field: [
        { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: true },
        {
          card: welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
          spent: false,
          hasLag: true,
        },
      ],
      eddies: 2,
    });

    const result = engine.activateAbility(
      welcomeToNightCityRetailJohnnySilverhandRockingRenegade,
      0,
      { as: P1 },
    );
    expect(result.success).toBe(true);

    const pending = engine.getState().G.turnMetadata.pendingChoice;
    if (pending?.type === "chooseTarget") {
      engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });
    }

    const operator = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P1);
    const rules = getEffectiveRules(engine.getState(), operator.instanceId as string);
    expect(rules).toContain("canAttackOnPlayedTurnAgainstUnits");

    const powerBuffs = engine
      .getState()
      .G.activeEffects.filter(
        (effect) => effect.targetCardId === operator.instanceId && effect.kind === "powerModifier",
      );
    expect(powerBuffs).toHaveLength(0);
  });

  it("also buffs a selected ROCKER Unit with +2 power", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: welcomeToNightCityRetailJohnnySilverhandRockingRenegade,
          faceDown: false,
          spent: false,
        },
      ],
      field: [
        {
          card: welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
          spent: false,
          hasLag: true,
        },
      ],
      eddies: 2,
    });

    engine.activateAbility(welcomeToNightCityRetailJohnnySilverhandRockingRenegade, 0, {
      as: P1,
    });
    const pending = engine.getState().G.turnMetadata.pendingChoice;
    if (pending?.type === "chooseTarget") {
      engine.resolveEffectTarget(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, {
        as: P1,
      });
    }

    const rocker = engine.getCard(
      welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
      "field",
      P1,
    );
    const powerBuff = engine
      .getState()
      .G.activeEffects.filter(
        (effect) => effect.targetCardId === rocker.instanceId && effect.kind === "powerModifier",
      );
    expect(powerBuff.length).toBeGreaterThan(0);
  });

  it("reduces the Eddie cost by 1 per friendly 8+ Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: welcomeToNightCityRetailJohnnySilverhandRockingRenegade,
          faceDown: false,
          spent: false,
        },
      ],
      field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: true }],
      eddies: 1,
      gigArea: [{ dieType: "d10", faceValue: 8 }],
    });

    const result = engine.activateAbility(
      welcomeToNightCityRetailJohnnySilverhandRockingRenegade,
      0,
      { as: P1 },
    );
    expect(result.success).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
  });
});
