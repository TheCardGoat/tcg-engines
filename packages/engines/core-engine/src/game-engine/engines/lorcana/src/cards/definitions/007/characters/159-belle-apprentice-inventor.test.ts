import { describe, expect, it } from "bun:test";
import {
  belleApprenticeInventor,
  spaghettiDinner,
} from "~/game-engine/engines/lorcana/src/cards/definitions/007";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Belle - Apprentice Inventor", () => {
  it("WHAT A MESS During your turn, you may banish chosen item of yours to play this character for free.", async () => {
    const testEngine = new TestEngine({
      inkwell: 0,
      play: [spaghettiDinner],
      hand: [belleApprenticeInventor],
    });

    await testEngine.playCard(belleApprenticeInventor, {
      alternativeCosts: [spaghettiDinner],
    });

    expect(testEngine.getCardModel(spaghettiDinner).zone).toBe("discard");
    expect(testEngine.getCardModel(belleApprenticeInventor).zone).toBe("play");
  });
});
