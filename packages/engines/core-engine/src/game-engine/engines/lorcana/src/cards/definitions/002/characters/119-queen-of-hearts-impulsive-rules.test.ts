/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { queenOfHeartsImpulsiveRuler } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Queen of Hearts - Impulsive Rules", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: queenOfHeartsImpulsiveRuler.cost,

      play: [queenOfHeartsImpulsiveRuler],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      queenOfHeartsImpulsiveRuler.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
