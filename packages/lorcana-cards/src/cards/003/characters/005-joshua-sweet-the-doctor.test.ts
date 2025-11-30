import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { joshuaSweetTheDoctor } from "./005-joshua-sweet-the-doctor";

describe("Joshua Sweet - The Doctor", () => {
  it.skip("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [joshuaSweetTheDoctor],
    });

    const cardUnderTest = testEngine.getCardModel(joshuaSweetTheDoctor);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
