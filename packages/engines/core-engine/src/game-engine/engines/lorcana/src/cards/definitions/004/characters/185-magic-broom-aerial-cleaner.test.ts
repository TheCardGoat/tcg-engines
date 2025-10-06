/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { magicBroomAerialCleaner } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Magic Broom - Aerial Cleaner", () => {
  it.skip("**WINGED FOR A DAY** During your turn, this character gains **Evasive.** _(They can challenge characters with Evasive.)_", () => {
    const testStore = new TestStore({
      inkwell: magicBroomAerialCleaner.cost,
      play: [magicBroomAerialCleaner],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      magicBroomAerialCleaner.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
