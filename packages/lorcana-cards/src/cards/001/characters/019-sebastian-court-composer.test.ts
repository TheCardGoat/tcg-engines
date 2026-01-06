import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { sebastianCourtComposer } from "./019-sebastian-court-composer";

describe("Sebastian - Court Composer", () => {
  it("should have Singer 4 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [sebastianCourtComposer],
    });

    const cardUnderTest = testEngine.getCardModel(sebastianCourtComposer);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
