import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { herculesTrueHero } from "./191-hercules-true-hero";

describe("Hercules - True Hero", () => {
  it.skip("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [herculesTrueHero],
    });

    const cardUnderTest = testEngine.getCardModel(herculesTrueHero);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
