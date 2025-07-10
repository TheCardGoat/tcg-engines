/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { arielSpectacularSinger } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { friendsOnTheOtherSide } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { peteGamesReferee } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Player Restriction Effect", () => {
  describe("'play-action-cards' restriction'", () => {
    it("Doesn't tap singer if player is restricted to play action cards", () => {
      const testStore = new TestStore(
        {
          inkwell: peteGamesReferee.cost,
          hand: [peteGamesReferee],
          deck: 1,
        },
        {
          deck: 7,
          hand: [friendsOnTheOtherSide],
          play: [arielSpectacularSinger],
          inkwell: friendsOnTheOtherSide.cost,
        },
      );

      const cardUnderTest = testStore.getCard(peteGamesReferee);
      cardUnderTest.playFromHand();

      testStore.passTurn();

      const song = testStore.getCard(friendsOnTheOtherSide);
      const singer = testStore.getCard(arielSpectacularSinger);

      singer.sing(song);
      song.playFromHand();

      expect(song.zone).toEqual("hand");
      expect(singer.ready).toEqual(true);
    });
  });
});
