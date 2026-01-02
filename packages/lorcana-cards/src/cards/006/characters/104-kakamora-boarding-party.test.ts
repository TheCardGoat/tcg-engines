import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-types/testing";
import { kakamoraBoardingParty } from "./104-kakamora-boarding-party";

describe("Kakamora - Boarding Party", () => {
  it("should have Rush ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [kakamoraBoardingParty],
    });

    const cardUnderTest = testEngine.getCardModel(kakamoraBoardingParty);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
