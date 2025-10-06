/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { heartOfAtlantis } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
