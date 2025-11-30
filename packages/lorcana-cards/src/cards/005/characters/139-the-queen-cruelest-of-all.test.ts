import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { theQueenCruelestOfAll } from "./139-the-queen-cruelest-of-all";

describe("The Queen - Cruelest of All", () => {
  it.skip("should have Ward ability", () => {
    const testEngine = new TestEngine({
      play: [theQueenCruelestOfAll],
    });

    const cardUnderTest = testEngine.getCardModel(theQueenCruelestOfAll);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
