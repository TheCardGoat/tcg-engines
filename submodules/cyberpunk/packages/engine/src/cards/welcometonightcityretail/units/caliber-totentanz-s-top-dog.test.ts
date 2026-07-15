import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCaliberTotentanzSTopDog,
  welcomeToNightCityRetailCorpoSecurity,
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
        field: [welcomeToNightCityRetailCorpoSecurity],
      },
    );

    engine.playCard(welcomeToNightCityRetailCaliberTotentanzSTopDog, { as: P1 });
    expect(engine.getPrompt(P1).choice?.type).toBe("chooseTarget");
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
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
