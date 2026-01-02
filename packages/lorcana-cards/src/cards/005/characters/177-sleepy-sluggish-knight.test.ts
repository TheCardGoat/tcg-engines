import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { sleepySluggishKnight } from "./177-sleepy-sluggish-knight";

describe("Sleepy - Sluggish Knight", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [sleepySluggishKnight],
    });

    const cardUnderTest = testEngine.getCardModel(sleepySluggishKnight);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
