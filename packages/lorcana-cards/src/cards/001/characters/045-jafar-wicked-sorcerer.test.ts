import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { jafarwickedSorcerer } from "./045-jafar-wicked-sorcerer";

describe("Jafar - Wicked Sorcerer", () => {
  it("should have Challenger 3 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [jafarwickedSorcerer],
    });

    const cardUnderTest = testEngine.getCardModel(jafarwickedSorcerer);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
