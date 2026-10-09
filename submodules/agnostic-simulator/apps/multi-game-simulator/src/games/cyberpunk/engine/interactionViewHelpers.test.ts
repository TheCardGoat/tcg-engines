import { describe, expect, it } from "vitest";
import { buildCyberpunkInteractionView } from "@tcg/cyberpunk-server-adapter/interaction-protocol";
import {
  welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
  welcomeToNightCityRetailFloorIt,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "@tcg/cyberpunk-engine";
import {
  interactionViewAbilityIndexForCard,
  interactionViewAbilityIndexesForCard,
} from "./interactionViewHelpers";

describe("Cyberpunk ability selection helpers", () => {
  it("does not auto-select Alt Cunningham's first ability when both are legal", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [
        {
          card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
          faceDown: false,
          spent: false,
        },
      ],
      trash: [welcomeToNightCityRetailFloorIt],
      eddies: 3,
    });
    const altId = engine.findCardId(
      welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
      "legendArea",
      P1,
    );
    const state = engine.getState();
    const view = buildCyberpunkInteractionView({
      actorId: P1,
      stateVersion: state.ctx.stateID,
      prompt: engine.getPrompt(P1),
      state,
    });

    expect(interactionViewAbilityIndexesForCard(view, altId)).toEqual([0, 1]);
    expect(interactionViewAbilityIndexForCard(view, altId)).toBeNull();
  });
});
