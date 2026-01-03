import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { JafarWickedSorcerer } from "./045-jafar-wicked-sorcerer";

describe("Jafar - Wicked Sorcerer", () => {
  it("should have Challenger 3 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [JafarWickedSorcerer],
    });

    const cardUnderTest = testEngine.getCardModel(JafarWickedSorcerer);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
