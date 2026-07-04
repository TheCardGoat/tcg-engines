import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorporateSurveillance,
  alphaCorpoSecurity,
  welcomeToNightCityRetailPlacideVoodooSentinel,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Placide - Voodoo Sentinel", () => {
  it("on play asks to discard a Program before moving a rival unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailPlacideVoodooSentinel, alphaCorporateSurveillance],
        eddies: 8,
      },
      {
        field: [alphaCorpoSecurity],
      },
    );

    engine.playCard(welcomeToNightCityRetailPlacideVoodooSentinel, { as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    // The discard-a-Program prompt is surfaced as a `chooseTarget` pending
    // choice (payload.type "discardFromHand"); `chooseCardToMove` is the
    // later move-rival-unit prompt, not the first discard prompt.
    expect(choice?.type).toBe("chooseTarget");
    expect(choice?.payload).toMatchObject({ type: "discardFromHand" });
  });

  it("has both play and attack timing triggers", () => {
    expect(
      welcomeToNightCityRetailPlacideVoodooSentinel.abilities.map((ability) => ability.trigger),
    ).toEqual([{ trigger: "play" }, { trigger: "attack" }]);
  });
});
