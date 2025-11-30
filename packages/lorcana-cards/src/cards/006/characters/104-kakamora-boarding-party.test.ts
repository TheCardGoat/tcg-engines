import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { kakamoraBoardingParty } from "./104-kakamora-boarding-party";

describe("Kakamora - Boarding Party", () => {
  it("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [kakamoraBoardingParty],
    });
    const cardUnderTest = testEngine.getCardModel(kakamoraBoardingParty);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
