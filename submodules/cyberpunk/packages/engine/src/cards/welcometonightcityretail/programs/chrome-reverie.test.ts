import { describe, expect, it } from "vite-plus/test";
import { alphaCorpoSecurity, welcomeToNightCityRetailChromeReverie } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Chrome Reverie", () => {
  it("can make a rival unit unable to attack until the caster's next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailChromeReverie],
        eddies: 3,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
      {
        field: [{ card: alphaCorpoSecurity, spent: false, playedThisTurn: false }],
      },
    );

    engine.playCard(welcomeToNightCityRetailChromeReverie, { as: P1 });
    engine.resolveEffectTarget(alphaCorpoSecurity, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    expect(engine.getCard(alphaCorpoSecurity, "field", P2).definitionId).toBe(
      alphaCorpoSecurity.id,
    );
  });

  it("does not call a legend when no friendly min Gig is present", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailChromeReverie],
      eddies: 3,
      gigArea: [{ dieType: "d6", faceValue: 3 }],
    });

    engine.playCard(welcomeToNightCityRetailChromeReverie, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(
      engine
        .getCardsInZone("trash", P1)
        .some((card) => card.definitionId === welcomeToNightCityRetailChromeReverie.id),
    ).toBe(true);
  });
});
