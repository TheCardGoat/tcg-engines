import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { wasabiAlwaysPrepared } from "./158-wasabi-always-prepared";

describe("Wasabi - Always Prepared", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [wasabiAlwaysPrepared],
    });

    const cardUnderTest = testEngine.getCardModel(wasabiAlwaysPrepared);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
