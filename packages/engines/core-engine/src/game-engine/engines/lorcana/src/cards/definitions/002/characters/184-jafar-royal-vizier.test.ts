import { describe, it } from "bun:test";
import { jafarRoyalVizier } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Jafar- Royal Vizier", () => {
  it.skip("I don't trust him, sire", () => {
    const testStore = new TestStore({
      inkwell: jafarRoyalVizier.cost,

      hand: [jafarRoyalVizier],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", jafarRoyalVizier.id);

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({});
  });
});
