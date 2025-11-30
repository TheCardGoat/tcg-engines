import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { bobbyPurplePigeon } from "./182-bobby-purple-pigeon";

describe("Bobby - Purple Pigeon", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [bobbyPurplePigeon],
    });
    const cardUnderTest = testEngine.getCardModel(bobbyPurplePigeon);
    expect(cardUnderTest.hasBodyguard).toBe(true);
  });
});
