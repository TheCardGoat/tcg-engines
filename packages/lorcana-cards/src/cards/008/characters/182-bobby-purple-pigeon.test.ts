import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { bobbyPurplePigeon } from "./182-bobby-purple-pigeon";

describe("Bobby - Purple Pigeon", () => {
  it.skip("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [bobbyPurplePigeon],
    });

    const cardUnderTest = testEngine.getCardModel(bobbyPurplePigeon);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
