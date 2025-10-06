/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { rapunzelsTowerSecludedPrison } from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Rapunzel's Tower - Secluded Prison", () => {
  it.skip("**SAFE AND SOUND** Characters get +3 {W}️ while here.", () => {
    const testStore = new TestStore({
      inkwell: rapunzelsTowerSecludedPrison.cost,
      play: [rapunzelsTowerSecludedPrison],
    });

    const cardUnderTest = testStore.getCard(rapunzelsTowerSecludedPrison);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
