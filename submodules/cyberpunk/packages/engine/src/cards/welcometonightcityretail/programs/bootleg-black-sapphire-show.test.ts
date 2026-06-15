import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorpoSecurity,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  welcomeToNightCityRetailBootlegBlackSapphireShow,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Bootleg Black Sapphire Show", () => {
  it("sells the top card of the deck and draws 2 with even and odd friendly Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailBootlegBlackSapphireShow],
      deck: [alphaCorpoSecurity, alphaRuthlessLowlife, alphaSwordwiseHuscle],
      eddies: 5,
      gigArea: [
        { dieType: "d4", faceValue: 2 },
        { dieType: "d6", faceValue: 3 },
      ],
    });
    const soldCard = engine.findDeckCard(alphaCorpoSecurity);
    const firstDraw = engine.findDeckCard(alphaRuthlessLowlife);
    const secondDraw = engine.findDeckCard(alphaSwordwiseHuscle);
    engine.judgeStackDeck([soldCard, firstDraw, secondDraw], { as: P1 });

    engine.playCard(welcomeToNightCityRetailBootlegBlackSapphireShow, { as: P1 });

    expect(engine.getCardsInZone("eddieArea", P1).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toEqual([
      alphaRuthlessLowlife.id,
      alphaSwordwiseHuscle.id,
    ]);
    expect(engine.getEddies(P1)).toBe(1);
  });

  it("still sells the top card but does not draw without both even and odd friendly Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailBootlegBlackSapphireShow],
      deck: [alphaCorpoSecurity, alphaRuthlessLowlife, alphaSwordwiseHuscle],
      eddies: 5,
      gigArea: [
        { dieType: "d4", faceValue: 2 },
        { dieType: "d6", faceValue: 4 },
      ],
    });
    const soldCard = engine.findDeckCard(alphaCorpoSecurity);
    engine.judgeStackDeck([soldCard], { as: P1 });
    const deckCountBefore = engine.getCardsInZone("deck", P1).length;

    engine.playCard(welcomeToNightCityRetailBootlegBlackSapphireShow, { as: P1 });

    expect(engine.getCardsInZone("eddieArea", P1).map((card) => card.definitionId)).toContain(
      alphaCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(0);
    expect(engine.getCardsInZone("deck", P1)).toHaveLength(deckCountBefore - 1);
  });
});
