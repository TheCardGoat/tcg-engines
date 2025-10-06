/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { tukTukWreckingBall } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Tuk Tuk - Wrecking Ball", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: tukTukWreckingBall.cost,

      play: [tukTukWreckingBall],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      tukTukWreckingBall.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
