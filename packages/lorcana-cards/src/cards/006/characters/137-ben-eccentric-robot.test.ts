import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { benEccentricRobot } from "./137-ben-eccentric-robot";

describe("B.E.N. - Eccentric Robot", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [benEccentricRobot],
    });

    const cardUnderTest = testEngine.getCardModel(benEccentricRobot);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
