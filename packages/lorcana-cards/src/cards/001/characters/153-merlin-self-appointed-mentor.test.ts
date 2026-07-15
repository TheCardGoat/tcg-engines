import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { merlinSelfappointedMentor } from "./153-merlin-self-appointed-mentor";

describe("Merlin - Self-Appointed Mentor", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [merlinSelfappointedMentor],
    });

    const cardUnderTest = testEngine.getCardModel(merlinSelfappointedMentor);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
