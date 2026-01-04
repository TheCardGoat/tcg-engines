import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { donaldDuckstruttingHisStuff } from "./144-donald-duck-strutting-his-stuff";

describe("Donald Duck - Strutting His Stuff", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [donaldDuckstruttingHisStuff],
    });

    const cardUnderTest = testEngine.getCardModel(donaldDuckstruttingHisStuff);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
