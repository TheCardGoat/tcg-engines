import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { jafarWickedSorcerer } from "./045-jafar-wicked-sorcerer";

describe("Jafar - Wicked Sorcerer", () => {
  it.skip("should have Challenger 3 ability", () => {
    const testEngine = new TestEngine({
      play: [jafarWickedSorcerer],
    });

    const cardUnderTest = testEngine.getCardModel(jafarWickedSorcerer);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
