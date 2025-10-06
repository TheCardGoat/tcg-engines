/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { mrsPottsEnchantedTeapot } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Mrs. Potts - Enchanted Teapot", () => {
  it.skip("**IT'LL TURN OUT ALL RIGHT** When you play this characters, if you have a character named Lumiere or Cogsworth in play, you may draw a card.", () => {
    const testStore = new TestStore({
      inkwell: mrsPottsEnchantedTeapot.cost,
      hand: [mrsPottsEnchantedTeapot],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      mrsPottsEnchantedTeapot.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
