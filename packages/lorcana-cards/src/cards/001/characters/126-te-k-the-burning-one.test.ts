import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { TeKTheBurningOne } from "./126-te-k-the-burning-one";

describe("Te Kā - The Burning One", () => {
  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [TeKTheBurningOne],
    });

    const cardUnderTest = testEngine.getCardModel(TeKTheBurningOne);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });
});
