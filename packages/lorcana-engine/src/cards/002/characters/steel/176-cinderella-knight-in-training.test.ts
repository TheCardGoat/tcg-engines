/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { magicBroomBucketBrigade } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { cinderellaKnightInTraining } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Cinderella- Knight in Training", () => {
  it("**HAVE COURAGE** When you play this character, you may draw a card, then choose and discard a card.", () => {
    const testStore = new TestStore({
      inkwell: cinderellaKnightInTraining.cost,
      deck: [magicBroomBucketBrigade],
      hand: [cinderellaKnightInTraining],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      cinderellaKnightInTraining.id,
    );

    cardUnderTest.playFromHand();

    expect(testStore.stackLayers).toHaveLength(1);
    testStore.resolveOptionalAbility();

    expect(testStore.stackLayers).toHaveLength(1);

    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 1, deck: 0, play: 1, discard: 0 }),
    );

    const aCardToDiscard = testStore.getByZoneAndId(
      "hand",
      magicBroomBucketBrigade.id,
    );
    testStore.resolveTopOfStack({
      targets: [aCardToDiscard],
    });
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({ hand: 0, deck: 0, play: 1, discard: 1 }),
    );
  });
});
