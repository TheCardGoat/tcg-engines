import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { mirabelMadrigalProphecyFinder } from "./019-mirabel-madrigal-prophecy-finder";

describe("Mirabel Madrigal - Prophecy Finder", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [mirabelMadrigalProphecyFinder],
    });
    const cardUnderTest = testEngine.getCardModel(
      mirabelMadrigalProphecyFinder,
    );
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
