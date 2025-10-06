/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  captainHookUnderhanded,
  donaldDuckFirstMate,
} from "~/game-engine/engines/lorcana/src/cards/definitions/006/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Donald Duck - First Mate", () => {
  it("CAPTAIN ON DECK While you have a Captain character in play, this character gets +2 {L}.", async () => {
    // Test with no Captain in play
    const testEngine = new TestEngine({
      inkwell: donaldDuckFirstMate.cost,
      hand: [donaldDuckFirstMate],
    });

    await testEngine.playCard(donaldDuckFirstMate);

    const donaldCard = testEngine.getCardModel(donaldDuckFirstMate);
    expect(donaldCard.lore).toEqual(donaldDuckFirstMate.lore);

    // Test with a Captain in play
    const testEngineWithCaptain = new TestEngine({
      inkwell: donaldDuckFirstMate.cost + captainHookUnderhanded.cost,
      play: [captainHookUnderhanded],
      hand: [donaldDuckFirstMate],
    });

    await testEngineWithCaptain.playCard(donaldDuckFirstMate);

    const donaldCardWithCaptain =
      testEngineWithCaptain.getCardModel(donaldDuckFirstMate);
    expect(donaldCardWithCaptain.lore).toEqual(donaldDuckFirstMate.lore + 2);
  });
});
