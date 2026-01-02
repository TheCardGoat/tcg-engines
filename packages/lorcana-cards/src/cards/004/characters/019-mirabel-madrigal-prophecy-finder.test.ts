import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { mirabelMadrigalProphecyFinder } from "./019-mirabel-madrigal-prophecy-finder";

describe("Mirabel Madrigal - Prophecy Finder", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mirabelMadrigalProphecyFinder],
    });

    const cardUnderTest = testEngine.getCardModel(
      mirabelMadrigalProphecyFinder,
    );
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
