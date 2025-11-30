import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { rayEasygoingFirefly } from "./092-ray-easygoing-firefly";

describe("Ray - Easygoing Firefly", () => {
  it.skip("should have Evasive ability", () => {
    const testEngine = new TestEngine({
      play: [rayEasygoingFirefly],
    });

    const cardUnderTest = testEngine.getCardModel(rayEasygoingFirefly);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
