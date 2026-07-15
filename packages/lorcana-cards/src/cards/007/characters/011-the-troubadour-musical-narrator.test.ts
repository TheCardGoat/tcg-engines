import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { theTroubadourMusicalNarrator } from "./011-the-troubadour-musical-narrator";

describe("The Troubadour - Musical Narrator", () => {
  it("should have Resist 1 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [theTroubadourMusicalNarrator],
    });

    const cardUnderTest = testEngine.getCardModel(theTroubadourMusicalNarrator);
    expect(cardUnderTest.hasResist).toBe(true);
  });

  it("should have Singer 4 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [theTroubadourMusicalNarrator],
    });

    const cardUnderTest = testEngine.getCardModel(theTroubadourMusicalNarrator);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
