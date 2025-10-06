/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { jafarRoyalVizier } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

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
