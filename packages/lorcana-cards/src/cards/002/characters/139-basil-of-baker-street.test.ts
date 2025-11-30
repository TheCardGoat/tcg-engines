import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { basilOfBakerStreet } from "./139-basil-of-baker-street";

describe("Basil - Of Baker Street", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [basilOfBakerStreet],
    });

    const cardUnderTest = testEngine.getCardModel(basilOfBakerStreet);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
