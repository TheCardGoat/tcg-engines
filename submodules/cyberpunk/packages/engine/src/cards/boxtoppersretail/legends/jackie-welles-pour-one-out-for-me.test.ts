import { describe, expect, it } from "vite-plus/test";
import {
  boxTopperRetailJackieWellesPourOneOutForMe,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDelamainCab,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Jackie Welles - Pour One Out For Me (box topper retail)", () => {
  it("decreases a friendly Gig after the first blue Unit play and draws when it becomes min", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailDelamainCab],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        legendArea: [{ card: boxTopperRetailJackieWellesPourOneOutForMe, faceDown: false }],
        gigArea: [{ dieType: "d4", faceValue: 3 }],
        eddies: 4,
      },
      undefined,
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveAdjustGig(1, { as: P1 });

    expect(engine.getGigValue(P1)).toBe(1);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("does not open a target choice when a blue card is played with no friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailDelamainCab],
      deck: [welcomeToNightCityRetailCorpoSecurity],
      legendArea: [{ card: boxTopperRetailJackieWellesPourOneOutForMe, faceDown: false }],
      eddies: 4,
    });

    engine.playCard(welcomeToNightCityRetailDelamainCab, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).not.toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });
});
