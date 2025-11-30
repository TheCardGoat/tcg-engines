import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { rajahDevotedProtector } from "./006-rajah-devoted-protector";

describe("Rajah - Devoted Protector", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [rajahDevotedProtector],
    });
    const cardUnderTest = testEngine.getCardModel(rajahDevotedProtector);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
