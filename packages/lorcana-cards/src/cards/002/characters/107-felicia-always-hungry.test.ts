import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { feliciaAlwaysHungry } from "./107-felicia-always-hungry";

describe("Felicia - Always Hungry", () => {
  it.skip("should have Reckless ability", () => {
    const testEngine = new TestEngine({
      play: [feliciaAlwaysHungry],
    });

    const cardUnderTest = testEngine.getCardModel(feliciaAlwaysHungry);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
