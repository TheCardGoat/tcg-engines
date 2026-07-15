import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailIndustrialAssembly,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Industrial Assembly", () => {
  it("increases a Gig by up to 4 and draws when friendly value reaches 8+", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailIndustrialAssembly],
        deck: [welcomeToNightCityRetailCorpoSecurity],
        eddies: 1,
        gigArea: [{ dieType: "d8", faceValue: 7 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    engine.playCard(welcomeToNightCityRetailIndustrialAssembly, { as: P1 });
    engine.resolveEffectTargetIds([engine.findGigIdByType(P1, "d8")], {
      as: P1,
      allowPendingChoice: true,
      reason: "Industrial Assembly still needs the selected Gig's new face value",
    });
    engine.resolveAdjustGig(8, { as: P1 });

    expect(engine.getGigDice(P1).find((die) => die.dieType === "d8")?.faceValue).toBe(8);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });
});
