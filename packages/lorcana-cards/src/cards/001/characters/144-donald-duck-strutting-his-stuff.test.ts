import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { DonaldDuckStruttingHisStuff } from "./144-donald-duck-strutting-his-stuff";

describe("Donald Duck - Strutting His Stuff", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [DonaldDuckStruttingHisStuff],
    });

    const cardUnderTest = testEngine.getCardModel(DonaldDuckStruttingHisStuff);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
