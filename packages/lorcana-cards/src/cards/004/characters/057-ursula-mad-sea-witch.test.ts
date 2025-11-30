import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { ursulaMadSeaWitch } from "./057-ursula-mad-sea-witch";

describe("Ursula - Mad Sea Witch", () => {
  it.skip("should have Challenger 2 ability", () => {
    const testEngine = new TestEngine({
      play: [ursulaMadSeaWitch],
    });

    const cardUnderTest = testEngine.getCardModel(ursulaMadSeaWitch);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
