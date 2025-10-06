/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { rayaGuardianOfTheDragonGem } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Raya - Guardian of the Dragon Gem", () => {
  it.skip("**WE MUST JOIN FORCES** When you play this character, ready chosen character of yours at a location. They can’t quest for the rest of this turn.", () => {
    const testStore = new TestStore({
      inkwell: rayaGuardianOfTheDragonGem.cost,
      hand: [rayaGuardianOfTheDragonGem],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      rayaGuardianOfTheDragonGem.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
