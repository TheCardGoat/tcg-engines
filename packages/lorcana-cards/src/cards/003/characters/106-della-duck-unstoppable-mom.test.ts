import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { dellaDuckUnstoppableMom } from "./106-della-duck-unstoppable-mom";

describe("Della Duck - Unstoppable Mom", () => {
  it.skip("should have Reckless ability", () => {
    const testEngine = new TestEngine({
      play: [dellaDuckUnstoppableMom],
    });

    const cardUnderTest = testEngine.getCardModel(dellaDuckUnstoppableMom);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
