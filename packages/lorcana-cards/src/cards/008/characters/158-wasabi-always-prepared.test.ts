import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { wasabiAlwaysPrepared } from "./158-wasabi-always-prepared";

describe("Wasabi - Always Prepared", () => {
  it("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [wasabiAlwaysPrepared],
    });
    const cardUnderTest = testEngine.getCardModel(wasabiAlwaysPrepared);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
