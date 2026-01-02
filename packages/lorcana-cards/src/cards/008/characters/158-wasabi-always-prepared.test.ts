import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { wasabiAlwaysPrepared } from "./158-wasabi-always-prepared";

describe("Wasabi - Always Prepared", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [wasabiAlwaysPrepared],
    });

    const cardUnderTest = testEngine.getCardModel(wasabiAlwaysPrepared);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
