import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { thomasOmalleyFelineCharmer } from "./088-thomas-omalley-feline-charmer";

describe("Thomas O'Malley - Feline Charmer", () => {
  it("should have Ward ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [thomasOmalleyFelineCharmer],
    });

    const cardUnderTest = testEngine.getCardModel(thomasOmalleyFelineCharmer);
    expect(cardUnderTest.hasWard()).toBe(true);
  });
});
