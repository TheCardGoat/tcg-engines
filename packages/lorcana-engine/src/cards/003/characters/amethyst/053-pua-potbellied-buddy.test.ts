/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { puaPotbelliedBuddy } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Pua - Potbellied Buddy", () => {
  it.skip("**ALWAYS THERE** When this character is banished, you may shuffle this card into your deck.", () => {
    const testStore = new TestStore({
      inkwell: puaPotbelliedBuddy.cost,
      play: [puaPotbelliedBuddy],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      puaPotbelliedBuddy.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
