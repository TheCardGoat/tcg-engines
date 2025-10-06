/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { puaPotbelliedBuddy } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
