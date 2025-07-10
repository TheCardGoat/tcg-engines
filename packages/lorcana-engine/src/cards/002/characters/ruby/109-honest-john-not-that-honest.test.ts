/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  herculesDivineHero,
  honestJohnNotThatHonest,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Honest John - Not That Honest", () => {
  it("**EASY STREET** Whenever you play a Floodborn character, each opponent loses 1 lore.", () => {
    const testStore = new TestStore(
      {
        inkwell: herculesDivineHero.cost,
        hand: [herculesDivineHero],
        play: [honestJohnNotThatHonest],
      },
      {
        lore: 3,
      },
    );

    const floodbornChar = testStore.getByZoneAndId(
      "hand",
      herculesDivineHero.id,
    );

    expect(testStore.getPlayerLore("player_two")).toEqual(3);
    floodbornChar.playFromHand();
    expect(testStore.getPlayerLore("player_two")).toEqual(2);
  });
});
