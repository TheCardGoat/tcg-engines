import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { ursulaMadSeaWitch } from "./057-ursula-mad-sea-witch";

describe("Ursula - Mad Sea Witch", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new TestEngine({
      play: [ursulaMadSeaWitch],
    });
    const cardUnderTest = testEngine.getCardModel(ursulaMadSeaWitch);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
