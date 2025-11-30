import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { iagoStompinMad } from "./043-iago-stompin-mad";

describe("Iago - Stompin' Mad", () => {
  it("should have Challenger 5 ability", () => {
    const testEngine = new LorcanaTestEngine(
      {},
      {},
      {
        play: [iagoStompinMad],
      },
    );

    const cardUnderTest = testEngine.getCardModel(iagoStompinMad);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
