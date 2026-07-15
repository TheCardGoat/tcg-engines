import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { weeDingwallScrappyLad } from "./176-wee-dingwall-scrappy-lad";

describe("Wee Dingwall - Scrappy Lad", () => {
  it("should have Challenger +2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [weeDingwallScrappyLad],
    });

    const cardUnderTest = testEngine.getCardModel(weeDingwallScrappyLad);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
