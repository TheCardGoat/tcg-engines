import { describe, expect, it } from "bun:test";
import { captainHookForcefulDuelist } from "~/game-engine/engines/lorcana/src/cards/definitions/008/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Captain Hook - Forceful Duelist", () => {
  it("Challenger +2 (While challenging, this character gets +2 {S}.)", async () => {
    const testEngine = new TestEngine({
      play: [captainHookForcefulDuelist],
    });

    const cardUnderTest = testEngine.getCardModel(captainHookForcefulDuelist);
    expect(cardUnderTest.hasChallenger).toBe(true);
  });
});
