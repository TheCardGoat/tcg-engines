import { describe, expect, it } from "bun:test";
import { TestEngine } from "@lorcanito/lorcana-engine/rules/testEngine";
import {
  liloMakingAWish,
  mauiDemiGod,
  stichtNewDog,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { friendLikeMe } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { jimHawkinsSpaceTraveler } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import {
  cinderellaMelodyWeaver,
  rayaFierceProtector,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
