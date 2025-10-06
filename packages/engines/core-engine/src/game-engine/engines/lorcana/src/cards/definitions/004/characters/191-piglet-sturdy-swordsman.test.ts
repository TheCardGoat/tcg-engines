/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { ursulaDeceiverOfAll } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { pigletSturdySwordsman } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
