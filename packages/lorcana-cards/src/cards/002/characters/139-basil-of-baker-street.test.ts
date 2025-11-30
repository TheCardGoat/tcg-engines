import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { basilOfBakerStreet } from "./139-basil-of-baker-street";

describe("Basil - Of Baker Street", () => {
  it.skip("should have Support ability", () => {
    const testEngine = new TestEngine({
      play: [basilOfBakerStreet],
    });

    const cardUnderTest = testEngine.getCardModel(basilOfBakerStreet);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
