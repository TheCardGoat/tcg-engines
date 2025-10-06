/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { flounderCollectorsCompanion } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Flounder - Collector's Companion", () => {
  it.skip("**Support** _(Whenever this character quests, you mad add their {S} to another chosen character's {S} this turn.)_**I'M NOT A GUPPY** If you have a character named Ariel in play, you pay 1 {I} less to play this character.", () => {
    const testStore = new TestStore({
      play: [flounderCollectorsCompanion],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      flounderCollectorsCompanion.id,
    );
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
