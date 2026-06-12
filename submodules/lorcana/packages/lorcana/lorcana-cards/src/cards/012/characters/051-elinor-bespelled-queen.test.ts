import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana-engine/testing";
import { elinorBespelledQueen } from "./051-elinor-bespelled-queen";

describe("Elinor - Bespelled Queen", () => {
  it("should have Challenger +2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [elinorBespelledQueen],
    });

    const cardUnderTest = testEngine.getCardModel(elinorBespelledQueen);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
