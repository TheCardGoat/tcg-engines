import { describe, expect, it } from "bun:test";
import { mirabelMadrigalProphecyFinder } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mirabel Madrigal - Prophecy Finder", () => {
  it.skip("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_", () => {
    const testStore = new TestStore({
      play: [mirabelMadrigalProphecyFinder],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      mirabelMadrigalProphecyFinder.id,
    );
    expect(cardUnderTest.hasSupport()).toBe(true);
  });
});
