import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { jafarWickedSorcerer } from "./045-jafar-wicked-sorcerer";

describe("Jafar - Wicked Sorcerer", () => {
  it("should have Challenger 3 ability", () => {
    const testEngine = new TestEngine({
      play: [jafarWickedSorcerer],
    });
    const cardUnderTest = testEngine.getCardModel(jafarWickedSorcerer);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
