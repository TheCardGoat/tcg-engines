/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { jafarRoyalVizier } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
