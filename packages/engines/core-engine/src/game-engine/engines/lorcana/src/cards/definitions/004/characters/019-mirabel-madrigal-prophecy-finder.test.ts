/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { mirabelMadrigalProphecyFinder } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Mirabel Madrigal - Prophecy Finder", () => {
  it.skip("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_", () => {
    const testStore = new TestStore({
      play: [mirabelMadrigalProphecyFinder],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      mirabelMadrigalProphecyFinder.id,
    );
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
