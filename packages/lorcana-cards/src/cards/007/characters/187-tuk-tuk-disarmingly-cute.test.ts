import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { tukTukDisarminglyCute } from "./187-tuk-tuk-disarmingly-cute";

describe("Tuk Tuk - Disarmingly Cute", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [tukTukDisarminglyCute],
    });

    const cardUnderTest = testEngine.getCardModel(tukTukDisarminglyCute);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });

  it("should have Resist 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [tukTukDisarminglyCute],
    });

    const cardUnderTest = testEngine.getCardModel(tukTukDisarminglyCute);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
