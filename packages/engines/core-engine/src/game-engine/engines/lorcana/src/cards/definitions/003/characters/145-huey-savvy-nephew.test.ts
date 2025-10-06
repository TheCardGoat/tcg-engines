/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { hueySavvyNephew } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Huey - Savvy Nephew", () => {
  it.skip("**Support** _(Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)_**THREE NEPHEWS** Whenever this character quests, if you have characters named Dewey and Louie in play, you may draw 3 cards.", () => {
    const testStore = new TestStore({
      play: [hueySavvyNephew],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", hueySavvyNephew.id);
    expect(cardUnderTest.hasSupport).toBe(true);
  });
});
