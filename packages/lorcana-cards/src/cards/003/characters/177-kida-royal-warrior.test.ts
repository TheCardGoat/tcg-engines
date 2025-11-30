import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { kidaRoyalWarrior } from "./177-kida-royal-warrior";

describe("Kida - Royal Warrior", () => {
  it.skip("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [kidaRoyalWarrior],
    });

    const cardUnderTest = testEngine.getCardModel(kidaRoyalWarrior);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
