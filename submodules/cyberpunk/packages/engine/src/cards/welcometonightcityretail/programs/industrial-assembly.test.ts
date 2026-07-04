import { describe, expect, it } from "vite-plus/test";
import {
  alphaRuthlessLowlife,
  welcomeToNightCityRetailIndustrialAssembly,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Industrial Assembly", () => {
  it("increases a Gig by up to 4 and draws when friendly value reaches 8+", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailIndustrialAssembly],
        deck: [alphaRuthlessLowlife],
        eddies: 1,
        gigArea: [{ dieType: "d8", faceValue: 7 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailIndustrialAssembly, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d8")], { as: P1 });
    engine.resolveAdjustGig(8, { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d8")?.faceValue).toBe(8);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      alphaRuthlessLowlife.id,
    );
  });
});
