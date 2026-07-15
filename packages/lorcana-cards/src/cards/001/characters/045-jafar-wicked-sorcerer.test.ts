import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { jafarWickedSorcerer } from "./045-jafar-wicked-sorcerer";

describe("Jafar - Wicked Sorcerer", () => {
  it("should have Challenger 3 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [jafarWickedSorcerer],
    });

    const cardUnderTest = testEngine.getCardModel(jafarWickedSorcerer);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
