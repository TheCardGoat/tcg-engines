import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { merlinselfAppointedMentor } from "./153-merlin-self-appointed-mentor";

describe("Merlin - Self-Appointed Mentor", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [merlinselfAppointedMentor],
    });

    const cardUnderTest = testEngine.getCardModel(merlinselfAppointedMentor);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
