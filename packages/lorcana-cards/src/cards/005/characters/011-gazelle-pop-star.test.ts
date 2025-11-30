import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { gazellePopStar } from "./011-gazelle-pop-star";

describe("Gazelle - Pop Star", () => {
  it("should have Singer 5 ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [gazellePopStar],
      },
    );

    const cardUnderTest = testEngine.getCardModel(gazellePopStar);
    expect(cardUnderTest.hasSinger()).toBe(true);
  });
});
