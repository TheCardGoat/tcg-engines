import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  welcomeToNightCityRetailKerryEurodyneTheLastRockerboy,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Kerry Eurodyne - The Last Rockerboy", () => {
  it("spends to draw two cards when a friendly Gig has value 8 or more", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [alphaCorpoSecurity, alphaCorpoSecurity],
      field: [{ card: welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, spent: false }],
      gigArea: [{ dieType: "d10", faceValue: 8 }],
    });
    const handBefore = engine.getHandCount(P1);

    engine.activateAbility(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, 0, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore + 2);
    expect(
      engine.getCard(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, "field", P1).meta.spent,
    ).toBe(true);
  });

  it("does not draw without an 8+ value Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [alphaCorpoSecurity, alphaCorpoSecurity],
      field: [{ card: welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, spent: false }],
      gigArea: [{ dieType: "d10", faceValue: 7 }],
    });
    const handBefore = engine.getHandCount(P1);

    engine.activateAbility(welcomeToNightCityRetailKerryEurodyneTheLastRockerboy, 0, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore);
  });

  it("filters the gig target by minValue: 8 (order-independent, not just first die)", () => {
    // Printed text: "If you control a Gig with 8+ value, draw 2." The
    // targetValue condition's gig target must carry minValue: 8 so the
    // resolver filters to 8+ dice before checking the first resolved die.
    // Without it, only the first die in gigArea is checked (order-dependent
    // bug where an 8+ die later in the array is missed).
    const ability = welcomeToNightCityRetailKerryEurodyneTheLastRockerboy.abilities[0]!;
    expect(ability.kind).toBe("triggered");
    const drawEffect = ability.effects[0]!;
    expect(drawEffect.effect).toBe("draw");
    const condition = drawEffect.conditions?.[0];
    expect(condition).toMatchObject({
      condition: "targetValue",
      property: "gigValue",
      comparison: "gte",
      value: 8,
    });
    expect(condition?.target).toMatchObject({
      selector: "gig",
      controller: "friendly",
      minValue: 8,
    });
  });
});
