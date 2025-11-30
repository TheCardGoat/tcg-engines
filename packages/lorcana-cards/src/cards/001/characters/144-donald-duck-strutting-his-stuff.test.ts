import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { donaldDuckStruttingHisStuff } from "./144-donald-duck-strutting-his-stuff";

describe("Donald Duck - Strutting His Stuff", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [donaldDuckStruttingHisStuff],
      },
    );

    const cardUnderTest = testEngine.getCardModel(donaldDuckStruttingHisStuff);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
