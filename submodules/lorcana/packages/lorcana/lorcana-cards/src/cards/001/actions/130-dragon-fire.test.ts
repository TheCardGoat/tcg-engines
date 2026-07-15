import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { dragonFire } from "./130-dragon-fire";
import { auroraHoldingCourt } from "../../009";

describe("Dragon Fire", () => {
  it("Banish chosen character.", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [dragonFire],
      inkwell: dragonFire.cost,
      play: [auroraHoldingCourt],
    });

    expect(testEngine.asPlayerOne().getCardZone(auroraHoldingCourt)).toEqual("play");

    testEngine.asPlayerOne().playCard(dragonFire, {
      targets: [auroraHoldingCourt],
    });

    expect(testEngine.asPlayerOne().getCardZone(auroraHoldingCourt)).toEqual("discard");
  });
});
