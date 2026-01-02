import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { sirHissAggravatingAsp } from "./086-sir-hiss-aggravating-asp";

describe("Sir Hiss - Aggravating Asp", () => {
  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [sirHissAggravatingAsp],
    });

    const cardUnderTest = testEngine.getCardModel(sirHissAggravatingAsp);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });
});
