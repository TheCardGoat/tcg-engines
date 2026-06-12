import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorporateSurveillance,
  alphaCorpoSecurity,
  spoilerPlacideVoodooSentinel,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Placide - Voodoo Sentinel", () => {
  it("on play asks to discard a Program before moving a rival unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [spoilerPlacideVoodooSentinel, alphaCorporateSurveillance],
        eddies: 8,
      },
      {
        field: [alphaCorpoSecurity],
      },
    );

    engine.playCard(spoilerPlacideVoodooSentinel, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseCardToMove");
  });

  it("has both play and attack timing triggers", () => {
    expect(spoilerPlacideVoodooSentinel.abilities.map((ability) => ability.trigger)).toEqual([
      { trigger: "play" },
      { trigger: "attack" },
    ]);
  });
});
