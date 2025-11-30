import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { gazellePopStar } from "./011-gazelle-pop-star";

describe("Gazelle - Pop Star", () => {
  it.skip("should have Singer 5 ability", () => {
    const testEngine = new TestEngine({
      play: [gazellePopStar],
    });

    const cardUnderTest = testEngine.getCardModel(gazellePopStar);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
