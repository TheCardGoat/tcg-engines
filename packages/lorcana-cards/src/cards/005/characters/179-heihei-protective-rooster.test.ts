import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { heiheiProtectiveRooster } from "./179-heihei-protective-rooster";

describe("HeiHei - Protective Rooster", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [heiheiProtectiveRooster],
    });
    const cardUnderTest = testEngine.getCardModel(heiheiProtectiveRooster);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
