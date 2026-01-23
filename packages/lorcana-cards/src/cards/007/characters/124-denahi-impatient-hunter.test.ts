import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { denahiImpatientHunter } from "./124-denahi-impatient-hunter";

describe("Denahi - Impatient Hunter", () => {
  it("should have Reckless ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [denahiImpatientHunter],
    });

    const cardUnderTest = testEngine.getCardModel(denahiImpatientHunter);
    expect(cardUnderTest.hasReckless()).toBe(true);
  });

  it("should have Resist 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [denahiImpatientHunter],
    });

    const cardUnderTest = testEngine.getCardModel(denahiImpatientHunter);
    expect(cardUnderTest.hasResist).toBe(true);
  });
});
