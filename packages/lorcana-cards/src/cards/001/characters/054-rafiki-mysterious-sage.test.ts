import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { rafikiMysteriousSage } from "./054-rafiki-mysterious-sage";

describe("Rafiki - Mysterious Sage", () => {
  it.skip("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [rafikiMysteriousSage],
    });

    const cardUnderTest = testEngine.getCardModel(rafikiMysteriousSage);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
