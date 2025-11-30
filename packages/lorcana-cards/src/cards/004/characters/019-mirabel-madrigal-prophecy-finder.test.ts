import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { mirabelMadrigalProphecyFinder } from "./019-mirabel-madrigal-prophecy-finder";

describe("Mirabel Madrigal - Prophecy Finder", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [mirabelMadrigalProphecyFinder],
    });

    const cardUnderTest = testEngine.getCardModel(
      mirabelMadrigalProphecyFinder,
    );
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
