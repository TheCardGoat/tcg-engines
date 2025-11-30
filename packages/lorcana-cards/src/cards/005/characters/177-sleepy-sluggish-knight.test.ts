import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { sleepySluggishKnight } from "./177-sleepy-sluggish-knight";

describe("Sleepy - Sluggish Knight", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [sleepySluggishKnight],
    });
    const cardUnderTest = testEngine.getCardModel(sleepySluggishKnight);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
