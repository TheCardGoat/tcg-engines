/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { theBayouMysteriousSwamp } from "~/game-engine/engines/lorcana/src/cards/definitions/003/locations/locations";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Bayou - Mysterious Swamp", () => {
  it.skip("**SHOW ME THE WAY** Whenever a character quests while here, you may draw a card, then choose and discard a card.", () => {
    const testStore = new TestStore({
      inkwell: theBayouMysteriousSwamp.cost,
      play: [theBayouMysteriousSwamp],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      theBayouMysteriousSwamp.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
