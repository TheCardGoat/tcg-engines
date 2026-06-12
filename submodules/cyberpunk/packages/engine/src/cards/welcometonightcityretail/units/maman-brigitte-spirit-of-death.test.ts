import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorporateSurveillance,
  alphaCorpoSecurity,
  alphaFloorIt,
  welcomeToNightCityRetailMamanBrigitteSpiritOfDeath,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Maman Brigitte", () => {
  it("requires discarding two Programs before bottom-decking an unequipped rival unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [
          welcomeToNightCityRetailMamanBrigitteSpiritOfDeath,
          alphaCorporateSurveillance,
          alphaFloorIt,
        ],
        eddies: 5,
      },
      {
        field: [alphaCorpoSecurity],
      },
    );

    engine.playCard(welcomeToNightCityRetailMamanBrigitteSpiritOfDeath, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    if (!choice || choice.type !== "chooseTarget") throw new Error("Expected chooseTarget choice.");
    expect(choice.payload.type).toBe("discardFromHand");
  });
});
