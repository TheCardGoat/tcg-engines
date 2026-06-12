import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorporateSurveillance,
  alphaRuthlessLowlife,
  spoilerAfterpartyAtLizzieS,
  spoilerMeredithStoutStoneColdCorpo,
  welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
  welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";
import { getEffectivePower } from "../../../active-effects/index.ts";

describe("Meredith Stout - Stone Cold Corpo", () => {
  it("can return a trash card when a rival decreases a friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [spoilerMeredithStoutStoneColdCorpo],
        trash: [alphaCorporateSurveillance],
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      },
      {
        hand: [spoilerAfterpartyAtLizzieS],
        eddies: 2,
      },
      { activePlayerId: P2 },
    );

    engine.playCard(spoilerAfterpartyAtLizzieS, { as: P2 });
    engine.resolve(spoilerAfterpartyAtLizzieS, { rivalGig: "d8" }, { as: P2 });
    expect(engine.executeMove("resolveAdjustGig", { args: { value: 3 } }, P2)).toMatchObject({
      success: true,
    });

    expect(engine.getCard(spoilerMeredithStoutStoneColdCorpo, "field", P1).definitionId).toBe(
      spoilerMeredithStoutStoneColdCorpo.id,
    );
    expect(spoilerMeredithStoutStoneColdCorpo.abilities[0]!.trigger).toMatchObject({
      trigger: "event",
      event: { event: "gigValueChanged" },
    });
  });

  it("retail version gets +2 only while fighting a Legend", () => {
    const nonLegendFight = CyberpunkTestEngine.createWithFixture(
      {
        field: [welcomeToNightCityRetailMeredithStoutStoneColdCorpo],
      },
      {
        field: [{ card: alphaRuthlessLowlife, spent: true }],
      },
    );
    const nonLegendMeredithId = nonLegendFight.findCardId(
      welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
      "field",
      P1,
    );

    nonLegendFight.attackUnit(
      welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
      alphaRuthlessLowlife,
      {
        as: P1,
      },
    );
    expect(getEffectivePower(nonLegendFight.getState(), nonLegendMeredithId as string)).toBe(
      welcomeToNightCityRetailMeredithStoutStoneColdCorpo.power,
    );

    const legendFight = CyberpunkTestEngine.createWithFixture(
      {
        field: [welcomeToNightCityRetailMeredithStoutStoneColdCorpo],
      },
      {
        field: [{ card: welcomeToNightCityRetailAltCunninghamSoulkillerArchitect, spent: true }],
      },
    );
    const legendMeredithId = legendFight.findCardId(
      welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
      "field",
      P1,
    );
    legendFight.attackUnit(
      welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
      welcomeToNightCityRetailAltCunninghamSoulkillerArchitect,
      { as: P1 },
    );
    expect(getEffectivePower(legendFight.getState(), legendMeredithId as string)).toBe(
      welcomeToNightCityRetailMeredithStoutStoneColdCorpo.power + 2,
    );
  });
});
