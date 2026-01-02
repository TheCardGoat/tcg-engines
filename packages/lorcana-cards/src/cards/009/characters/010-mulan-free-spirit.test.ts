import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { mulanFreeSpirit } from "./010-mulan-free-spirit";

describe("Mulan - Free Spirit", () => {
  it("should have Support ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [mulanFreeSpirit],
    });

    const cardUnderTest = testEngine.getCardModel(mulanFreeSpirit);
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
