/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  ransack,
  youHaveForgottenMe,
} from "@lorcanito/lorcana-engine/cards/001/actions/actions.ts";
import {
  aladdinHeroicOutlaw,
  magicBroomBucketBrigade,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Ransack", () => {
  it("draw 2 cards and discard 2 cards", () => {
    const testStore = new TestStore({
      inkwell: ransack.cost,
      deck: [magicBroomBucketBrigade, youHaveForgottenMe],
      hand: [ransack, aladdinHeroicOutlaw],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", ransack.id);

    const aCardToDiscard = testStore.getByZoneAndId(
      "hand",
      aladdinHeroicOutlaw.id,
    );
    // This card will be drawn, then discarded.
    const anotherCardToDiscard = testStore.getByZoneAndId(
      "deck",
      youHaveForgottenMe.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({
      targets: [aCardToDiscard, anotherCardToDiscard],
    });

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, deck: 0, play: 0, discard: 2 + 1 }),
    );
  });

  it("you should draw before discarding", () => {
    const testStore = new TestStore({
      inkwell: ransack.cost,
      deck: [magicBroomBucketBrigade, youHaveForgottenMe],
      hand: [ransack, aladdinHeroicOutlaw],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", ransack.id);

    const aCardToDiscard = testStore.getByZoneAndId(
      "hand",
      aladdinHeroicOutlaw.id,
    );

    const anotherCardToDiscard = testStore.getByZoneAndId(
      "deck",
      youHaveForgottenMe.id,
    );

    cardUnderTest.playFromHand();

    expect(testStore.store.stackLayerStore.layers).toHaveLength(1);

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 3, deck: 0, discard: 1 }),
    );
    testStore.resolveTopOfStack({
      targets: [aCardToDiscard, anotherCardToDiscard],
    });
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, deck: 0, discard: 3 }),
    );
    expect(testStore.store.stackLayerStore.layers).toHaveLength(0);
  });
});
