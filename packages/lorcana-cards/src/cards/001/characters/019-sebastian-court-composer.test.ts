import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { sebastianCourtComposer } from "./019-sebastian-court-composer";

describe("Sebastian - Court Composer", () => {
  it.skip("should have Singer 4 ability", () => {
    const testEngine = new TestEngine({
      play: [sebastianCourtComposer],
    });

    const cardUnderTest = testEngine.getCardModel(sebastianCourtComposer);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
