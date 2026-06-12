import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { rabbitFedUp } from "./041-rabbit-fed-up";

describe("Rabbit - Fed Up", () => {
  it("should have Challenger 3 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [rabbitFedUp],
    });

    const cardUnderTest = testEngine.getCardModel(rabbitFedUp);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
