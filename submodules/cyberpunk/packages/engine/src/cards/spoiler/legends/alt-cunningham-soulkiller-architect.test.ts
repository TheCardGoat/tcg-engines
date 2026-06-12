import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
  welcomeToNightCityRetailCyberpsychosis,
  spoilerAltCunninghamSoulkillerArchitect,
  spoilerPeaceOffering,
  alphaSwordwiseHuscle,
  alphaKiroshiOptics,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Alt Cunningham - Soulkiller Architect", () => {
  it("can go solo from the legend area", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      legendArea: [{ card: spoilerAltCunninghamSoulkillerArchitect, faceDown: false }],
      eddies: 6,
    });

    const legendId = engine.findCardId(spoilerAltCunninghamSoulkillerArchitect, "legendArea", P1);
    expect(
      engine.executeMove("goSolo", { args: { cardId: legendId as string } }, P1),
    ).toMatchObject({
      success: true,
    });
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      spoilerAltCunninghamSoulkillerArchitect.id,
    );
  });

  it("removes itself to play a Program from trash after stealing a Gig", () => {
    const ability = spoilerAltCunninghamSoulkillerArchitect.abilities[1]!;
    expect(ability.trigger).toMatchObject({ trigger: "event", event: { event: "gigStolen" } });
    expect(ability.effects[0]).toMatchObject({ effect: "ifYouDo" });
    expect(JSON.stringify(ability.effects)).toContain(spoilerPeaceOffering.type);
  });

  it("retail activated ability discounts the next Program this turn for each friendly min Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [welcomeToNightCityRetailCyberpsychosis],
      field: [{ card: alphaSwordwiseHuscle, attachedGears: [alphaKiroshiOptics] }],
      legendArea: [
        { card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, faceDown: false },
      ],
      gigArea: [
        { dieType: "d4", faceValue: 1 },
        { dieType: "d6", faceValue: 1 },
      ],
      eddies: 1,
    });

    expect(
      engine.activateAbility(welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, 0, {
        as: P1,
      }),
    ).toMatchObject({ success: true });
    expect(engine.playCard(welcomeToNightCityRetailCyberpsychosis, { as: P1 })).toMatchObject({
      success: true,
    });

    expect(engine.getEddies(P1)).toBe(0);
  });
});
