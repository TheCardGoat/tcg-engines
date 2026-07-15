import { describe, expect, it } from "bun:test";
import { bePrepared } from "./128-be-prepared";
import { LorcanaMultiplayerTestEngine } from "@tcg/lorcana-engine/testing";
import { auroraHoldingCourt } from "../../009";
import { jetsamUrsulasSpy } from "../characters/046-jetsam-ursulas-spy";

describe("Be Prepared", () => {
  it("banishes all characters", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [bePrepared],
        inkwell: bePrepared.cost,
        play: [jetsamUrsulasSpy],
      },
      {
        play: [auroraHoldingCourt],
      },
    );

    testEngine.asPlayerOne().playCard(bePrepared);

    expect(testEngine.asPlayerOne().getCardZone(jetsamUrsulasSpy)).toEqual("discard");
    expect(testEngine.asPlayerOne().getCardZone(bePrepared)).toEqual("discard");
    expect(testEngine.asPlayerTwo().getCardZone(auroraHoldingCourt)).toEqual("discard");

    expect(testEngine.asPlayerOne().getZonesCardCount()).toEqual(
      expect.objectContaining({
        play: 0,
        discard: 2,
      }),
    );

    expect(testEngine.asPlayerTwo().getZonesCardCount()).toEqual(
      expect.objectContaining({
        play: 0,
        discard: 1,
      }),
    );
  });
});
