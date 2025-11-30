import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { sebastianCourtComposer } from "./019-sebastian-court-composer";

describe("Sebastian - Court Composer", () => {
  it("should have Singer 4 ability", () => {
    const testEngine = new TestEngine({
      play: [sebastianCourtComposer],
    });
    const cardUnderTest = testEngine.getCardModel(sebastianCourtComposer);
    expect(cardUnderTest.hasSinger).toBe(true);
  });
});
