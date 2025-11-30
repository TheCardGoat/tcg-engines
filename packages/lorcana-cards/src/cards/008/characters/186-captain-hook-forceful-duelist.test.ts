import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import { captainHookForcefulDuelist } from "./186-captain-hook-forceful-duelist";

describe("Captain Hook - Forceful Duelist", () => {
  it("should have Challenger 2 ability", () => {
    const testEngine = new TestEngine({
      play: [captainHookForcefulDuelist],
    });
    const cardUnderTest = testEngine.getCardModel(captainHookForcefulDuelist);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
