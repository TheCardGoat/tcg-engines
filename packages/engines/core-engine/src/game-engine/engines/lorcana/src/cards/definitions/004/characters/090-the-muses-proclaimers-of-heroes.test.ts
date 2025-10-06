/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { liloMakingAWish } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import {
  friendsOnTheOtherSide,
  grabYourSword,
  suddenChill,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/songs/songs";
import {
  goofyKnightForADay,
  princeJohnGreediestOfAll,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  aladdinResoluteSwordsman,
  auroraTranquilPrincess,
  faLiMulansMother,
  theMusesProclaimersOfHeroes,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Muses - Proclaimers of Heroes", () => {
  describe("**THE GOSPEL TRUTH** Whenever you play a song, you may return chosen character with 2 {S} or less to their player's hand.", () => {
    it("should return own character with 2 {S} or less to own hand when a song is played", () => {
      const testStore = new TestStore({
        inkwell: grabYourSword.cost,
        play: [
          theMusesProclaimersOfHeroes,
          princeJohnGreediestOfAll,
          auroraTranquilPrincess,
          faLiMulansMother,
        ],
        hand: [grabYourSword],
      });

      const notTargetOne = testStore.getCard(auroraTranquilPrincess);
      const notTargetTwo = testStore.getCard(faLiMulansMother);
      const notTargetThree = testStore.getCard(theMusesProclaimersOfHeroes);

      const target = testStore.getCard(princeJohnGreediestOfAll);
      const song = testStore.getByZoneAndId("hand", grabYourSword.id);
      song.playFromHand();

      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.zone).toBe("hand");

      [notTargetOne, notTargetTwo, notTargetThree].forEach((card) => {
        expect(card.zone).toBe("play");
      });
    });

    it("should return opponents character with 2 {S} or less to opponents hand when a song is played", () => {
      const testStore = new TestStore(
        {
          inkwell: grabYourSword.cost,
          play: [theMusesProclaimersOfHeroes],
          hand: [friendsOnTheOtherSide],
          deck: 3,
        },
        {
          play: [
            aladdinResoluteSwordsman,
            princeJohnGreediestOfAll,
            auroraTranquilPrincess,
            faLiMulansMother,
          ],
        },
      );
      const notTargetOne = testStore.getCard(auroraTranquilPrincess);
      const notTargetTwo = testStore.getCard(faLiMulansMother);
      const notTargetThree = testStore.getCard(princeJohnGreediestOfAll);

      const song = testStore.getByZoneAndId("hand", friendsOnTheOtherSide.id);
      const opponentCardToReturn = testStore.getByZoneAndId(
        "play",
        aladdinResoluteSwordsman.id,
        "player_two",
      );
      song.playFromHand();

      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [opponentCardToReturn] });

      expect(opponentCardToReturn.zone).toBe("hand");

      [notTargetOne, notTargetTwo, notTargetThree].forEach((card) => {
        expect(card.zone).toBe("play");
      });
    });
  });
});

describe("Regression", () => {
  it("Skipping muses effect during an song that requires response from opponent", () => {
    const testStore = new TestStore(
      {
        inkwell: suddenChill.cost,
        play: [theMusesProclaimersOfHeroes, liloMakingAWish],
        hand: [suddenChill],
      },
      {
        hand: [goofyKnightForADay],
      },
    );

    const target = testStore.getCard(liloMakingAWish);
    const song = testStore.getCard(suddenChill);

    const opponentsCard = testStore.getCard(goofyKnightForADay);

    song.playFromHand();
    expect(testStore.stackLayers).toHaveLength(2);
    console.log(JSON.stringify(testStore.stackLayers[0]));
    expect(testStore.store.priorityPlayer).toEqual("player_two");

    testStore.changePlayer("player_two");
    testStore.resolveTopOfStack({ targets: [opponentsCard] }, true);
    expect(testStore.stackLayers).toHaveLength(1);
    expect(opponentsCard.zone).toEqual("discard");

    testStore.changePlayer("player_one");
    testStore.skipOptionalAbility();
    expect(target.zone).toBe("play");
    expect(testStore.stackLayers).toHaveLength(0);
  });
});
