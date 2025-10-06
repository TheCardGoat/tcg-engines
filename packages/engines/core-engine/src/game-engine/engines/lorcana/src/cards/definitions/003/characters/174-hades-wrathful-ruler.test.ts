/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { hadesWrathfulRuler } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Hades - Wrathful Ruler", () => {
  it.skip("**CALLING THE TITANS** {E} – Ready your Titan characters.", () => {
    const testStore = new TestStore({
      inkwell: hadesWrathfulRuler.cost,
      play: [hadesWrathfulRuler],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      hadesWrathfulRuler.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
