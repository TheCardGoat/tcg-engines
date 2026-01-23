import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { feliciaAlwaysHungry } from "./107-felicia-always-hungry";

describe("Felicia - Always Hungry", () => {
  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [feliciaAlwaysHungry],
    });

    const cardUnderTest = testEngine.getCardModel(feliciaAlwaysHungry);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
