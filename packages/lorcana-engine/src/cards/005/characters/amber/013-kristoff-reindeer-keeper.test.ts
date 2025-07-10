/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  aWholeNewWorld,
  suddenChill,
} from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { aladdinResoluteSwordsman } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import {
  kristoffReindeerKeeper,
  peteGamesReferee,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Kristoff - Reindeer Keeper", () => {
  describe("**SONG OF THE HERD** For each song card in your discard, you pay 1 {I} less to play this character.", () => {
    it("Should pay 'N' less 'n' being the number os songs on discard", () => {
      const testStore = new TestStore({
        inkwell: kristoffReindeerKeeper.cost,
        hand: [kristoffReindeerKeeper],
        discard: [aWholeNewWorld, aWholeNewWorld, aWholeNewWorld],
      });

      const cardUnderTest = testStore.getCard(kristoffReindeerKeeper);

      cardUnderTest.playFromHand({ bodyguard: false });
      expect(cardUnderTest.zone).toEqual("play");
      expect(testStore.getAvailableInkwellCardCount()).toEqual(
        kristoffReindeerKeeper.cost -
          (kristoffReindeerKeeper.cost - testStore.getZonesCardCount().discard),
      );
    });

    it("Should pay full cost if no song is on the discard", () => {
      const testStore = new TestStore({
        inkwell: kristoffReindeerKeeper.cost,
        hand: [kristoffReindeerKeeper],
        discard: [
          aladdinResoluteSwordsman,
          aladdinResoluteSwordsman,
          aladdinResoluteSwordsman,
        ],
      });

      const cardUnderTest = testStore.getCard(kristoffReindeerKeeper);

      cardUnderTest.playFromHand({ bodyguard: false });
      expect(cardUnderTest.zone).toEqual("play");
      expect(testStore.getAvailableInkwellCardCount()).toEqual(0);
    });
  });
});

describe("Regression tests", () => {
  it("Does NOT reduce cost of the next card played", () => {
    const testStore = new TestStore({
      inkwell: kristoffReindeerKeeper.cost - 3 + peteGamesReferee.cost,
      hand: [kristoffReindeerKeeper, peteGamesReferee],
      discard: [aWholeNewWorld, aWholeNewWorld, aWholeNewWorld],
    });

    const cardUnderTest = testStore.getCard(kristoffReindeerKeeper);
    const anotherCardUnderTest = testStore.getCard(peteGamesReferee);

    cardUnderTest.playFromHand({ bodyguard: false });
    expect(cardUnderTest.zone).toEqual("play");

    anotherCardUnderTest.playFromHand();
    expect(anotherCardUnderTest.zone).toEqual("play");

    expect(testStore.getAvailableInkwellCardCount()).toEqual(0);
  });
});
