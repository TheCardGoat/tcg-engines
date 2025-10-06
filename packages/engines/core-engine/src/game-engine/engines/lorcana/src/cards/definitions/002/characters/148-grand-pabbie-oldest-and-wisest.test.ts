/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  goofyKnightForADay,
  grandPabbieOldestAndWisest,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Grand Pabbie - Oldest and Wisest", () => {
  it("**ANCIENT INSIGHT** Whenever you remove 1 or more damage from one of your characters, gain 2 lore.", () => {
    const testStore = new TestStore({
      play: [grandPabbieOldestAndWisest, goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      grandPabbieOldestAndWisest.id,
    );
    const anotherCharacter = testStore.getByZoneAndId(
      "play",
      goofyKnightForADay.id,
    );
    cardUnderTest.updateCardDamage(4);
    anotherCharacter.updateCardDamage(4);

    expect(testStore.getPlayerLore()).toEqual(0);

    cardUnderTest.updateCardDamage(2, "remove");
    expect(testStore.getPlayerLore()).toEqual(2);

    anotherCharacter.updateCardDamage(2, "remove");
    expect(testStore.getPlayerLore()).toEqual(4);
  });
});
