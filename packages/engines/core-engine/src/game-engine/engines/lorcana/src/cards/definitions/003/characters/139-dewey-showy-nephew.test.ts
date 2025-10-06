/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { deweyShowyNephew } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dewey - Showy Nephew", () => {
  it.skip("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_", () => {
    const testStore = new TestStore({
      play: [deweyShowyNephew],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", deweyShowyNephew.id);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
