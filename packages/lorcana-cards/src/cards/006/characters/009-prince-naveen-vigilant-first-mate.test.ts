import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { princeNaveenVigilantFirstMate } from "./009-prince-naveen-vigilant-first-mate";

describe("Prince Naveen - Vigilant First Mate", () => {
  it("should have Shift ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [princeNaveenVigilantFirstMate],
    });

    const cardUnderTest = testEngine.getCardModel(
      princeNaveenVigilantFirstMate,
    );
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [princeNaveenVigilantFirstMate],
    });

    const cardUnderTest = testEngine.getCardModel(
      princeNaveenVigilantFirstMate,
    );
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
