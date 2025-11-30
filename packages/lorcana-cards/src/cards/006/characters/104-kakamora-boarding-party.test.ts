import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { kakamoraBoardingParty } from "./104-kakamora-boarding-party";

describe("Kakamora - Boarding Party", () => {
  it.skip("should have Rush ability", () => {
    const testEngine = new TestEngine({
      play: [kakamoraBoardingParty],
    });

    const cardUnderTest = testEngine.getCardModel(kakamoraBoardingParty);
    expect(cardUnderTest.hasRush).toBe(true);
  });
});
