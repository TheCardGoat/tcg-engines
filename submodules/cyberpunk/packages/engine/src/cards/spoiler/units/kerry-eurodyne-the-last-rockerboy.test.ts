import { describe, expect, it } from "vite-plus/test";
import { alphaCorpoSecurity, spoilerKerryEurodyneTheLastRockerboy } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Kerry Eurodyne - The Last Rockerboy", () => {
  it("spends to draw two cards when a friendly Gig is at max value", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [alphaCorpoSecurity, alphaCorpoSecurity],
      field: [{ card: spoilerKerryEurodyneTheLastRockerboy, spent: false }],
      gigArea: [{ dieType: "d6", faceValue: 6 }],
    });
    const handBefore = engine.getHandCount(P1);

    engine.activateAbility(spoilerKerryEurodyneTheLastRockerboy, 0, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore + 2);
    expect(engine.getCard(spoilerKerryEurodyneTheLastRockerboy, "field", P1).meta.spent).toBe(true);
  });

  it("does not draw without a max-value Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [alphaCorpoSecurity, alphaCorpoSecurity],
      field: [{ card: spoilerKerryEurodyneTheLastRockerboy, spent: false }],
      gigArea: [{ dieType: "d6", faceValue: 5 }],
    });
    const handBefore = engine.getHandCount(P1);

    engine.activateAbility(spoilerKerryEurodyneTheLastRockerboy, 0, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore);
  });
});
