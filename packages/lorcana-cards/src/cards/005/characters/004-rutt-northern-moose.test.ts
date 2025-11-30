import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { ruttNorthernMoose } from "./004-rutt-northern-moose";

describe("Rutt - Northern Moose", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [ruttNorthernMoose],
      },
    );

    const cardUnderTest = testEngine.getCardModel(ruttNorthernMoose);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
