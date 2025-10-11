import { describe, expect, it } from "bun:test";
import {
  nothingToHide,
  zeroToHero,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { donaldDuckSleepwalker } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Donald Duck - Sleepwalker", () => {
  it("**STARTLED AWAKE** Whenever you play an action, this character gets +2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: nothingToHide.cost + zeroToHero.cost,
      hand: [nothingToHide, zeroToHero],
      play: [donaldDuckSleepwalker],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      donaldDuckSleepwalker.id,
    );

    const actionOne = testStore.getByZoneAndId("hand", nothingToHide.id);
    actionOne.playFromHand();
    expect(cardUnderTest.strength).toBe(donaldDuckSleepwalker.strength + 2);

    const actionTwo = testStore.getByZoneAndId("hand", zeroToHero.id);
    actionTwo.playFromHand();
    expect(cardUnderTest.strength).toBe(donaldDuckSleepwalker.strength + 4);
  });
});
