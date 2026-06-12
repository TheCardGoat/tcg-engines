import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorporateSurveillance,
  alphaCorpoSecurity,
  alphaFloorIt,
  spoilerMamanBrigitte,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Maman Brigitte", () => {
  it("requires discarding two Programs before bottom-decking an unequipped rival unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [spoilerMamanBrigitte, alphaCorporateSurveillance, alphaFloorIt],
        eddies: 5,
      },
      {
        field: [alphaCorpoSecurity],
      },
    );

    engine.playCard(spoilerMamanBrigitte, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (!choice || choice.type !== "chooseTarget") {
      throw new Error("Expected discard target choice.");
    }
    expect(choice.payload.type).toBe("discardFromHand");
  });
});
