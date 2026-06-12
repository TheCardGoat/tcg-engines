import { describe, expect, it } from "vite-plus/test";
import { alphaCorpoSecurity, spoilerSandayuOdaHanakoSGuardian } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Sandayu Oda - Hanako's Guardian", () => {
  it("spends one rival unit for each friendly value-pair", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [spoilerSandayuOdaHanakoSGuardian],
        eddies: 7,
        gigArea: [
          { dieType: "d4", faceValue: 3 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
      {
        field: [
          { card: alphaCorpoSecurity, spent: false },
          { card: alphaCorpoSecurity, spent: false },
        ],
      },
    );

    expect(engine.playCard(spoilerSandayuOdaHanakoSGuardian, { as: P1 })).toMatchObject({
      success: true,
    });
    expect(spoilerSandayuOdaHanakoSGuardian.abilities[0]!.effects[0]).toMatchObject({
      effect: "forEachFriendlyGigPair",
    });
  });

  it("can attack rival units the turn it is played", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [spoilerSandayuOdaHanakoSGuardian],
        eddies: 7,
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: true }],
      },
    );

    engine.playCard(spoilerSandayuOdaHanakoSGuardian, { as: P1 });
    expect(
      engine.attackUnit(spoilerSandayuOdaHanakoSGuardian, alphaCorpoSecurity, { as: P1 }),
    ).toMatchObject({
      success: true,
    });
  });
});
