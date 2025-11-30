import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { joshuaSweetTheDoctor } from "./005-joshua-sweet-the-doctor";

describe("Joshua Sweet - The Doctor", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [joshuaSweetTheDoctor],
    });
    const cardUnderTest = testEngine.getCardModel(joshuaSweetTheDoctor);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
