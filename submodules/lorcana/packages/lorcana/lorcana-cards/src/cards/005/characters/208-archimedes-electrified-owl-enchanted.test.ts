import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { archimedesElectrifiedOwlEnchanted } from "./208-archimedes-electrified-owl-enchanted";

describe("Archimedes - Electrified Owl (Enchanted)", () => {
  it("should have Shift ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [archimedesElectrifiedOwlEnchanted],
    });

    const cardUnderTest = testEngine.getCardModel(archimedesElectrifiedOwlEnchanted);
    expect(cardUnderTest.hasShift()).toBe(true);
  });

  it("should have Evasive ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [archimedesElectrifiedOwlEnchanted],
    });

    const cardUnderTest = testEngine.getCardModel(archimedesElectrifiedOwlEnchanted);
    expect(cardUnderTest.hasEvasive).toBe(true);
  });

  it("should have Challenger 3 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [archimedesElectrifiedOwlEnchanted],
    });

    const cardUnderTest = testEngine.getCardModel(archimedesElectrifiedOwlEnchanted);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
