import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { montereyJackDefiantProtector } from "./188-monterey-jack-defiant-protector";

describe("Monterey Jack - Defiant Protector", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [montereyJackDefiantProtector],
    });
    const cardUnderTest = testEngine.getCardModel(montereyJackDefiantProtector);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
