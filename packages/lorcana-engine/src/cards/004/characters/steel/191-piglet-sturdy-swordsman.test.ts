/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { ursulaDeceiverOfAll } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { pigletSturdySwordsman } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Piglet - Sturdy Swordsman", () => {
  it("**Resist +1** _(Damage dealt to this character is reduced by 1.)_**NOT SO SMALL ANYMORE** While you have no cards in your hand, this character can challenge ready characters.", () => {
    const testStore = new TestStore(
      {
        hand: [pigletSturdySwordsman],
        play: [pigletSturdySwordsman],
      },
      { play: [ursulaDeceiverOfAll] },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      pigletSturdySwordsman.id,
    );

    const defender = testStore.getByZoneAndId(
      "play",
      ursulaDeceiverOfAll.id,
      "player_two",
    );

    expect(cardUnderTest.canChallenge(defender)).toBeFalsy();

    const cardInHand = testStore.getByZoneAndId(
      "hand",
      pigletSturdySwordsman.id,
    );

    cardInHand.discard();

    expect(cardUnderTest.canChallenge(defender)).toBeTruthy();

    cardUnderTest.challenge(defender);
    expect(cardUnderTest.damage).toBe(1);
  });
});
