/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  liloGalacticHero,
  rapunzelGiftedWithHealing,
  stichtNewDog,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { bindingContract } from "@lorcanito/lorcana-engine/cards/002/items/items";
import { theQueenDiviner } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { greatStoneDragon } from "@lorcanito/lorcana-engine/cards/004/items/items";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("The Queen - Diviner", () => {
  describe("**CONSULT THE GRIMOIRE** {E} – Look at the top 4 cards of your deck. You may reveal an item card and put it into your hand. If that item card costs 3 or less, you may play that item for free and it enters play exerted. Put the rest on the bottom of your deck in any order.", () => {
    it("should allow the player to play an item card for free if it costs 3 or less", () => {
      const testStore = new TestStore({
        play: [theQueenDiviner],
        deck: [
          liloGalacticHero,
          greatStoneDragon,
          goofyKnightForADay,
          stichtNewDog,
        ],
      });

      const cardUnderTest = testStore.getCard(theQueenDiviner);
      const target = testStore.getCard(greatStoneDragon);
      const otherCards = [
        testStore.getCard(liloGalacticHero),
        testStore.getCard(goofyKnightForADay),
        testStore.getCard(stichtNewDog),
      ];

      cardUnderTest.activate();
      testStore.resolveTopOfStack(
        {
          scry: {
            bottom: otherCards,
            play: [target],
          },
        },
        true,
      );

      otherCards.forEach((card) => {
        expect(card.zone).toBe("deck");
      });
      expect(target.zone).toBe("play");
    });

    it("should allow the player to put in hand an item card if it costs 3 or more", () => {
      const testStore = new TestStore({
        play: [theQueenDiviner],
        deck: [
          liloGalacticHero,
          bindingContract,
          goofyKnightForADay,
          stichtNewDog,
        ],
      });

      const cardUnderTest = testStore.getCard(theQueenDiviner);
      const target = testStore.getCard(bindingContract);
      const otherCards = [
        testStore.getCard(liloGalacticHero),
        testStore.getCard(goofyKnightForADay),
        testStore.getCard(stichtNewDog),
      ];

      cardUnderTest.activate();
      testStore.resolveTopOfStack(
        {
          scry: {
            bottom: otherCards,
            play: [target],
          },
        },
        true,
      );

      otherCards.forEach((card) => {
        expect(card.zone).toBe("deck");
      });
      expect(target.zone).toBe("hand");
    });

    it("should put the rest of the cards to the bottom", () => {
      const testStore = new TestStore({
        play: [theQueenDiviner],
        deck: [
          bindingContract,
          liloGalacticHero,
          rapunzelGiftedWithHealing,
          goofyKnightForADay,
          stichtNewDog,
        ],
      });

      const cardUnderTest = testStore.getCard(theQueenDiviner);
      const remainingCardOnDeck = testStore.getCard(bindingContract);
      const bottomCards = [
        testStore.getCard(rapunzelGiftedWithHealing),
        testStore.getCard(liloGalacticHero),
        testStore.getCard(goofyKnightForADay),
        testStore.getCard(stichtNewDog),
      ];

      cardUnderTest.activate();
      testStore.resolveTopOfStack(
        {
          scry: {
            bottom: bottomCards,
          },
        },
        true,
      );

      expect(remainingCardOnDeck.zone).toBe("deck");
      testStore.store.drawCard("player_one");
      expect(remainingCardOnDeck.zone).toBe("hand");
    });
  });
});
