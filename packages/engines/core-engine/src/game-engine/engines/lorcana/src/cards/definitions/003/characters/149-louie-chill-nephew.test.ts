/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { louieChillNephew } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Louie - Chill Nephew", () => {
  it.skip("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_", () => {
    const testStore = new TestStore({
      play: [louieChillNephew],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", louieChillNephew.id);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
