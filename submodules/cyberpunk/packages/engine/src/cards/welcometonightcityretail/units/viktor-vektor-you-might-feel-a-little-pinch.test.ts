import { describe, expect, it } from "vite-plus/test";
import {
  alphaRuthlessLowlife,
  welcomeToNightCityRetailMandibularUpgrade,
  welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Viktor Vektor - You Might Feel a Little Pinch", () => {
  it("equips a cheap Cyberware Gear from trash to another friendly Unit", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch],
      field: [alphaRuthlessLowlife],
      trash: [welcomeToNightCityRetailMandibularUpgrade],
      eddies: 3,
    });

    engine.playCard(welcomeToNightCityRetailViktorVektorYouMightFeelALittlePinch, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailMandibularUpgrade, { as: P1 });
    engine.resolveCardToPlay(welcomeToNightCityRetailMandibularUpgrade, { as: P1 });

    const host = engine.getCard(alphaRuthlessLowlife, "field", P1);
    expect(host.meta.attachedGearIds).toHaveLength(1);
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMandibularUpgrade.id,
    );
  });
});
