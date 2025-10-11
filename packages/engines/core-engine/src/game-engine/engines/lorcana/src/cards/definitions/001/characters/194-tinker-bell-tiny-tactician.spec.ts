/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { youHaveForgottenMe } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import {
  aladdinHeroicOutlaw,
  magicBroomBucketBrigade,
  simbaFutureKing,
  tinkerBellTinyTactician,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tinker Bell - Tiny Tactician", () => {
  it("**Battle plans** {E} - Draw a card, then choose and discard a card.", () => {
    const testStore = new TestStore({
      deck: [magicBroomBucketBrigade, youHaveForgottenMe],
      play: [tinkerBellTinyTactician],
      hand: [simbaFutureKing, aladdinHeroicOutlaw],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      tinkerBellTinyTactician.id,
    );

    const aCardToDiscard = testStore.getByZoneAndId(
      "hand",
      aladdinHeroicOutlaw.id,
    );

    cardUnderTest.activate();
    testStore.resolveTopOfStack({
      targets: [aCardToDiscard],
    });

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 2, deck: 1, play: 1, discard: 1 }),
    );
  });
});
