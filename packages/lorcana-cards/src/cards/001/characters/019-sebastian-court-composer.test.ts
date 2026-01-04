import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { sebastiancourtComposer } from "./019-sebastian-court-composer";

describe("Sebastian - Court Composer", () => {
  it("should have Singer 4 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [sebastiancourtComposer],
    });

    const cardUnderTest = testEngine.getCardModel(sebastiancourtComposer);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
