import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { jimDearBelovedHusband } from "./012-jim-dear-beloved-husband";

describe("Jim Dear - Beloved Husband", () => {
  it.skip("should have Bodyguard ability", () => {
    const testEngine = new TestEngine({
      play: [jimDearBelovedHusband],
    });

    const cardUnderTest = testEngine.getCardModel(jimDearBelovedHusband);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
