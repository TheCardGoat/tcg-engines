/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import {
  liloMakingAWish,
  mauiDemiGod,
  stichtNewDog,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { friendLikeMe } from "@lorcanito/lorcana-engine/cards/003/actions/actions.ts";
import { jimHawkinsSpaceTraveler } from "@lorcanito/lorcana-engine/cards/003/characters/characters.ts";
import {
  cinderellaMelodyWeaver,
  rayaFierceProtector,
} from "@lorcanito/lorcana-engine/cards/004/characters/characters.ts";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Friend Like Me", () => {
  it("_(A character with cost 5 or more can exert to sing this song for free.)_Each player puts the top 3 cards of their deck into their inkwell facedown and exerted.", async () => {
    const testEngine = new TestEngine(
      {
        inkwell: friendLikeMe.cost,
        hand: [friendLikeMe],
        deck: [
          cinderellaMelodyWeaver,
          rayaFierceProtector,
          jimHawkinsSpaceTraveler,
        ],
      },
      {
        deck: [liloMakingAWish, stichtNewDog, mauiDemiGod],
      },
    );

    const cardUnderTest = testEngine.getCardModel(friendLikeMe);
    const selfTopDeckCards = [
      testEngine.getCardModel(cinderellaMelodyWeaver),
      testEngine.getCardModel(rayaFierceProtector),
      testEngine.getCardModel(jimHawkinsSpaceTraveler),
    ];

    const opponentTopDeckCards = [
      testEngine.getCardModel(liloMakingAWish),
      testEngine.getCardModel(stichtNewDog),
      testEngine.getCardModel(mauiDemiGod),
    ];

    await testEngine.playCard(cardUnderTest);
    selfTopDeckCards.forEach((card) => {
      expect(card.zone).toEqual("inkwell");
      expect(card.ready).toEqual(false);
    });
    opponentTopDeckCards.forEach((card) => {
      expect(card.zone).toEqual("inkwell");
      expect(card.ready).toEqual(false);
    });
  });
});
