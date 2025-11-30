import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { feliciaAlwaysHungry } from "./107-felicia-always-hungry";

describe("Felicia - Always Hungry", () => {
  it("should have Reckless ability", () => {
    const testEngine = new TestEngine({
      play: [feliciaAlwaysHungry],
    });
    const cardUnderTest = testEngine.getCardModel(feliciaAlwaysHungry);
    expect(cardUnderTest.hasReckless).toBe(true);
  });
});
