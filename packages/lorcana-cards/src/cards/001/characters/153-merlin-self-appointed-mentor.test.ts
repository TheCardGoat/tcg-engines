import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { merlinSelfappointedMentor } from "./153-merlin-self-appointed-mentor";

describe("Merlin - Self-Appointed Mentor", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [merlinSelfappointedMentor],
    });

    const cardUnderTest = testEngine.getCardModel(merlinSelfappointedMentor);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
