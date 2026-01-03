import { describe, expect, it } from "bun:test";
import { LorcanaTestEngine } from "@tcg/lorcana/testing";
import { captainHookForcefulDuelist } from "./186-captain-hook-forceful-duelist";

describe("Captain Hook - Forceful Duelist", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new LorcanaTestEngine({
      play: [captainHookForcefulDuelist],
    });

    const cardUnderTest = testEngine.getCardModel(captainHookForcefulDuelist);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
