import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { kidaRoyalWarrior } from "./177-kida-royal-warrior";

describe("Kida - Royal Warrior", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [kidaRoyalWarrior],
    });

    const cardUnderTest = testEngine.getCardModel(kidaRoyalWarrior);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
