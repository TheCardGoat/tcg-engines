/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { flotsamAndJetsamEntanglingEels } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Flotsam & Jetsam - Entangling Eels", () => {
  it.skip("**Shift: Discard 2 cards** _(You may discard 2 cards to play this on top of one of your characters named Flotsam or Jetsam.)__(This character counts as being named both Flotsam and Jetsam)_", () => {
    const testStore = new TestStore({
      inkwell: flotsamAndJetsamEntanglingEels.cost,
      play: [flotsamAndJetsamEntanglingEels],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      flotsamAndJetsamEntanglingEels.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
