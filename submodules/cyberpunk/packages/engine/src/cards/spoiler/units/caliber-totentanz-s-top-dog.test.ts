import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaFloorIt,
  spoilerCaliberTotentanzSTopDog,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Caliber - Totentanz's Top Dog", () => {
  it("defines a defeated trigger that makes the rival discard", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [alphaFloorIt, alphaCorpoSecurity],
      field: [{ card: spoilerCaliberTotentanzSTopDog, spent: true }],
      gigArea: [{ dieType: "d6", faceValue: 2 }],
    });

    expect(engine.getCard(spoilerCaliberTotentanzSTopDog, "field", P1).definitionId).toBe(
      spoilerCaliberTotentanzSTopDog.id,
    );
    expect(spoilerCaliberTotentanzSTopDog.abilities[0]!.trigger).toEqual({ trigger: "defeated" });
  });

  it("has two discard effects, with the second tied to a matching friendly Gig value", () => {
    const effects = spoilerCaliberTotentanzSTopDog.abilities[0]!.effects;
    expect(effects.map((effect) => effect.effect)).toEqual(["discardFromHand", "discardFromHand"]);
    expect(effects[1]).toMatchObject({ amount: 1 });
  });
});
