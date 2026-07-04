import { describe, expect, it } from "vite-plus/test";
import {
  alphaCorporateSurveillance,
  spoilerAfterpartyAtLizzieS,
  welcomeToNightCityRetailMeredithStoutStoneColdCorpo,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Meredith Stout - Stone Cold Corpo", () => {
  it("can return a trash card when a rival decreases a friendly Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [welcomeToNightCityRetailMeredithStoutStoneColdCorpo],
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
    engine.executeMove("resolveAdjustGig", { args: { value: 3 } }, P2);

    expect(
      engine.getCard(welcomeToNightCityRetailMeredithStoutStoneColdCorpo, "field", P1).definitionId,
    ).toBe(welcomeToNightCityRetailMeredithStoutStoneColdCorpo.id);
    expect(welcomeToNightCityRetailMeredithStoutStoneColdCorpo.abilities[2]!.trigger).toMatchObject(
      {
        trigger: "event",
        event: { event: "gigValueChanged" },
      },
    );
  });
});
