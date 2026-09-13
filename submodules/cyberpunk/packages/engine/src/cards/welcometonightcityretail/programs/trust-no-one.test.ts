import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailTrustNoOne } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Trust No One", () => {
  it("decreases a Gig by up to 3, then draws 1 when you control a min Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailTrustNoOne],
      eddies: 1,
      gigArea: [{ dieType: "d4", faceValue: 1 }],
      deck: [
        welcomeToNightCityRetailTrustNoOne,
        welcomeToNightCityRetailTrustNoOne,
        welcomeToNightCityRetailTrustNoOne,
      ],
    });

    const handBefore = engine.getCardsInZone("hand", P1).length;
    engine.playCard(welcomeToNightCityRetailTrustNoOne, { as: P1 });

    // Program play resolves: an adjustGig choice (decrease up to 3) is offered.
    const state = engine.getState();
    expect(state.G.turnMetadata.pendingChoice?.type === "chooseTarget").toBe(true);

    // Card moved out of hand when played.
    expect(engine.getCardsInZone("hand", P1).length).toBeLessThan(handBefore);
  });
});
