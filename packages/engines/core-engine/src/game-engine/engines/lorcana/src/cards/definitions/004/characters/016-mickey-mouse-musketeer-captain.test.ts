import { describe, expect, it } from "bun:test";
import { mickeyMouseMusketeerCaptain } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mickey Mouse - Musketeer Captain", () => {
  it.skip("**Shift** 5 _You may pay 5 {I} to play this on top of one of your characters named Mickey Mouse.)_**Bodyguard**, **Support****MUSKETEERS UNITED** When you play this character, if you used **Shift** to play him, you may draw a chard for each character with **Bodyguard** you have in play.", () => {
    const testStore = new TestStore({
      play: [mickeyMouseMusketeerCaptain],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      mickeyMouseMusketeerCaptain.id,
    );
    expect(cardUnderTest.hasShift).toBe(true);
  });
});
