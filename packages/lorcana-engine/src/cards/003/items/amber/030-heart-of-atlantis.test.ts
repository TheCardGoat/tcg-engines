/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { heartOfAtlantis } from "@lorcanito/lorcana-engine/cards/003/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Heart of Atlantis", () => {
  it.skip("**LIFE GIVER** {E} – You pay 2 {I} less for the next character you play this turn.", () => {
    const testStore = new TestStore({
      inkwell: heartOfAtlantis.cost,
      play: [heartOfAtlantis],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", heartOfAtlantis.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
