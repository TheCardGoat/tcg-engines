import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { teKTheBurningOne } from "./126-te-k-the-burning-one";

describe("Te Kā - The Burning One", () => {
  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [teKTheBurningOne],
      },
    );

    const cardUnderTest = testEngine.getCardModel(teKTheBurningOne);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
