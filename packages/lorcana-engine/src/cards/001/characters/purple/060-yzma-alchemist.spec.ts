/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  arielSpectacularSinger,
  heiheiBoatSnack,
  yzmaAlchemist,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Yzma - Alchemist", () => {
  it("**YOU'RE EXCUSED** Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.", () => {
    const testStore = new TestStore({
      play: [yzmaAlchemist],
      deck: [heiheiBoatSnack, friendsOnTheOtherSide, arielSpectacularSinger],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", yzmaAlchemist.id);
    const first = testStore.getByZoneAndId("deck", arielSpectacularSinger.id);

    cardUnderTest.quest();

    testStore.resolveTopOfStack({ scry: { bottom: [first] } });

    const deck = testStore.store.tableStore.getPlayerZoneCards(
      "player_one",
      "deck",
    );

    expect(deck[0]).toEqual(first);
  });
});
