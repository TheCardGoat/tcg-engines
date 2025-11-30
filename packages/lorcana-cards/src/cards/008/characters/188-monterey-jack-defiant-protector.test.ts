import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { montereyJackDefiantProtector } from "./188-monterey-jack-defiant-protector";

describe("Monterey Jack - Defiant Protector", () => {
  it.skip("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [montereyJackDefiantProtector],
    });

    const cardUnderTest = testEngine.getCardModel(montereyJackDefiantProtector);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
