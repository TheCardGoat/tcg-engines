import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/core-engine/lorcana-testing";
import { iagoStompinMad } from "./043-iago-stompin-mad";

describe("Iago - Stompin' Mad", () => {
  it.skip("should have Challenger 5 ability", () => {
    const testEngine = new TestEngine({
      play: [iagoStompinMad],
    });

    const cardUnderTest = testEngine.getCardModel(iagoStompinMad);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
