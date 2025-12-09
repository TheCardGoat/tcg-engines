import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { archimedesElectrifiedOwl } from "./047-archimedes-electrified-owl";

describe("Archimedes - Electrified Owl", () => {
  it("should have Shift ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [archimedesElectrifiedOwl],
    });

    const cardUnderTest = testEngine.getCardModel(archimedesElectrifiedOwl);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [archimedesElectrifiedOwl],
    });

    const cardUnderTest = testEngine.getCardModel(archimedesElectrifiedOwl);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("should have Challenger 3 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [archimedesElectrifiedOwl],
    });

    const cardUnderTest = testEngine.getCardModel(archimedesElectrifiedOwl);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
