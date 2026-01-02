import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { benEccentricRobot } from "./137-ben-eccentric-robot";

describe("B.E.N. - Eccentric Robot", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [benEccentricRobot],
    });

    const cardUnderTest = testEngine.getCardModel(benEccentricRobot);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
