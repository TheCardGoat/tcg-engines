import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { heiheiBoatSnack } from "./007-heihei-boat-snack";

describe("HeiHei - Boat Snack", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [heiheiBoatSnack],
    });

    const cardUnderTest = testEngine.getCardModel(heiheiBoatSnack);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
