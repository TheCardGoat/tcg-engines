import { describe, expect, it } from "bun:test";
import {
  generalLiHeadOfTheImperialArmy,
  khanWarHorse,
  stoppedChaosInItsTracks,
} from "~/game-engine/engines/lorcana/src/cards/definitions/008";
import { TestEngine } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Stopped Chaos In Its Tracks", () => {
  it("Return up to 2 chosen characters with 3 {S} or less each to their player's hand.", async () => {
    const targets = [generalLiHeadOfTheImperialArmy, khanWarHorse];
    const testEngine = new TestEngine(
      {
        inkwell: stoppedChaosInItsTracks.cost,
        hand: [stoppedChaosInItsTracks],
      },
      {
        play: targets,
      },
    );

    await testEngine.playCard(stoppedChaosInItsTracks, { targets });

    for (const target of targets) {
      expect(testEngine.getCardModel(target).zone).toBe("hand");
    }
  });
});
