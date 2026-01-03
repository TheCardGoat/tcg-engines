import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { fixitFelixJrTrustyBuilder } from "./010-fix-it-felix-jr-trusty-builder";

describe("Fix-It Felix, Jr. - Trusty Builder", () => {
  it("should have Bodyguard ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [fixitFelixJrTrustyBuilder],
    });

    const cardUnderTest = testEngine.getCardModel(fixitFelixJrTrustyBuilder);
    expect(cardUnderTest.hasBodyguard()).toBe(true);
  });
});
