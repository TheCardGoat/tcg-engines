import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { joshuaSweetTheDoctor } from "./005-joshua-sweet-the-doctor";

describe("Joshua Sweet - The Doctor", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [joshuaSweetTheDoctor],
    });

    const cardUnderTest = testEngine.getCardModel(joshuaSweetTheDoctor);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
