import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { ruttNorthernMoose } from "./004-rutt-northern-moose";

describe("Rutt - Northern Moose", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [ruttNorthernMoose],
    });

    const cardUnderTest = testEngine.getCardModel(ruttNorthernMoose);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
