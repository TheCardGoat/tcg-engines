import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailChromeReverie,
  welcomeToNightCityRetailCorpoSecurity,
} from "@tcg/cyberpunk-cards";
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
        field: [
          { card: welcomeToNightCityRetailCorpoSecurity, spent: false, playedThisTurn: false },
        ],
      },
    );

    engine.playCard(welcomeToNightCityRetailChromeReverie, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, {
      as: P1,
      allowPendingChoice: true,
      reason: "Chrome Reverie still needs a friendly min Gig for the Legend call check",
    });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).definitionId).toBe(
      welcomeToNightCityRetailCorpoSecurity.id,
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
