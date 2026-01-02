import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { thePrinceVigilantSuitor } from "./024-the-prince-vigilant-suitor";

describe("The Prince - Vigilant Suitor", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [thePrinceVigilantSuitor],
    });

    const cardUnderTest = testEngine.getCardModel(thePrinceVigilantSuitor);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
