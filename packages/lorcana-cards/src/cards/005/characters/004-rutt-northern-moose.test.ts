import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { ruttNorthernMoose } from "./004-rutt-northern-moose";

describe("Rutt - Northern Moose", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [ruttNorthernMoose],
    });
    const cardUnderTest = testEngine.getCardModel(ruttNorthernMoose);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
