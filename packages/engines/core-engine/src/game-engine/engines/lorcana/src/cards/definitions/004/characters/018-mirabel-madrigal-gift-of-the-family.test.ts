/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mirabelMadrigalGiftOfTheFamily } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mirabel Madrigal - Gift of the Family", () => {
  it.skip("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_", () => {
    const testStore = new TestStore({
      play: [mirabelMadrigalGiftOfTheFamily],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      mirabelMadrigalGiftOfTheFamily.id,
    );
    expect(cardUnderTest.hasSupport).toBe(true);
  });

  it.skip("**SAVING THE MIRACLE** Whenever this character quests, your other Madrigal characters get +1 {L} this turn.", () => {
    const testStore = new TestStore({
      inkwell: mirabelMadrigalGiftOfTheFamily.cost,
      play: [mirabelMadrigalGiftOfTheFamily],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      mirabelMadrigalGiftOfTheFamily.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
