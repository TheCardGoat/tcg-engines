import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { heiheiBoatSnack } from "./007-heihei-boat-snack";

describe("HeiHei - Boat Snack", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [heiheiBoatSnack],
    });
    const cardUnderTest = testEngine.getCardModel(heiheiBoatSnack);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
