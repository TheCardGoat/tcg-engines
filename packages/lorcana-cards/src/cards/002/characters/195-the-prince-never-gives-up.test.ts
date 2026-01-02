import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { thePrinceNeverGivesUp } from "./195-the-prince-never-gives-up";

describe("The Prince - Never Gives Up", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [thePrinceNeverGivesUp],
    });

    const cardUnderTest = testEngine.getCardModel(thePrinceNeverGivesUp);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it("should have Resist 1 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [thePrinceNeverGivesUp],
    });

    const cardUnderTest = testEngine.getCardModel(thePrinceNeverGivesUp);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
