import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  welcomeToNightCityRetailCaliberTotentanzSTopDog,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Caliber - Totentanz's Top Dog", () => {
  it("on play defeats a rival unit with cost two or less", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailCaliberTotentanzSTopDog],
        eddies: 5,
      },
      {
        field: [alphaCorpoSecurity],
      },
    );

    engine.playCard(welcomeToNightCityRetailCaliberTotentanzSTopDog, { as: P1 });
    expect(engine.getPrompt(P1).choice?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(alphaCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
  });

  it("defines a defeated trigger that makes the rival discard", () => {
    expect(welcomeToNightCityRetailCaliberTotentanzSTopDog.abilities[1]!.trigger).toEqual({
      trigger: "defeated",
    });
  });

  it("has two discard effects, with the second tied to a matching friendly Gig value", () => {
    const effects = welcomeToNightCityRetailCaliberTotentanzSTopDog.abilities[1]!.effects;
    expect(effects.map((effect) => effect.effect)).toEqual(["discardFromHand", "discardFromHand"]);
    expect(effects[1]).toMatchObject({ amount: 1 });
  });
});
