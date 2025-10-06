/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { olafTrustingCompanion } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Olaf - Trusting Companion", () => {
  it.skip("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_", () => {
    const testStore = new TestStore({
      play: [olafTrustingCompanion],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      olafTrustingCompanion.id,
    );
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
