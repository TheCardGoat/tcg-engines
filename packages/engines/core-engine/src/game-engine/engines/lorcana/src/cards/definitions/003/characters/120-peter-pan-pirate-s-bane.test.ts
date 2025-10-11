import { describe, expect, it } from "bun:test";
import { peterPanPiratesBane } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Peter Pan - Pirate’s Bane", () => {
  it.skip("**Shift** 4 _(You may pay 4 ink to play this on top of one of your characters named Peter Pan.)_**Evasive** _(Only characters with Evasive can challenge this character.)_**YOU’RE NEXT!** Whenever he challenges a Pirate character, this character takes no damage from the challenge.", () => {
    const testStore = new TestStore({
      play: [peterPanPiratesBane],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      peterPanPiratesBane.id,
    );
    expect(cardUnderTest.hasShift).toBe(true);
  });
});
