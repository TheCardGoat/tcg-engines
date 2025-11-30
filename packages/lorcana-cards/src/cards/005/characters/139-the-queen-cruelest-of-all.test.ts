import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { theQueenCruelestOfAll } from "./139-the-queen-cruelest-of-all";

describe("The Queen - Cruelest of All", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [theQueenCruelestOfAll],
      },
    );

    const cardUnderTest = testEngine.getCardModel(theQueenCruelestOfAll);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
