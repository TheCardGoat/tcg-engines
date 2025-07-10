/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  generalLiHeadOfTheImperialArmy,
  khanWarHorse,
  stoppedChaosInItsTracks,
} from "@lorcanito/lorcana-engine/cards/008";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";

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
