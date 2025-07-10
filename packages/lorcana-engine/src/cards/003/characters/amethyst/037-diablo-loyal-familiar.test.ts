/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { diabloLoyalFamiliar } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Diablo - Loyal Familiar", () => {
  it.skip("**IN SEARCH OF AURORA** Whenever you play a character named Maleficent, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.", () => {
    const testStore = new TestStore({
      inkwell: diabloLoyalFamiliar.cost,
      play: [diabloLoyalFamiliar],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      diabloLoyalFamiliar.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
