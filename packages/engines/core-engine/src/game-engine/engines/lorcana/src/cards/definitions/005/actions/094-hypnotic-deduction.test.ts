import { describe, expect, it } from "bun:test";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  breakFree,
  evilComesPrepared,
  gatheringKnowledgeAndWisdom,
  hypnoticDeduction,
  youreWelcome,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/actions";

describe("Hypnotic Deduction", () => {
  it("Draw 3 cards, then put 2 cards from your hand on the top of your deck in any order.", () => {
    const testStore = new TestStore({
      inkwell: hypnoticDeduction.cost,
      hand: [hypnoticDeduction],
      deck: [
        gatheringKnowledgeAndWisdom,
        youreWelcome,
        evilComesPrepared,
        breakFree,
      ],
    });

    const cardUnderTest = testStore.getCard(hypnoticDeduction);

    cardUnderTest.playFromHand();

    expect(testStore.getZonesCardCount().hand).toBe(3);
    expect(testStore.getZonesCardCount().deck).toBe(1);
    expect(testStore.getZonesCardCount().discard).toBe(1);

    const secondCard = testStore.getCard(youreWelcome);
    const firstCard = testStore.getCard(breakFree);

    testStore.resolveTopOfStack({ targets: [secondCard] }, true);
    expect(secondCard.zone).toBe("deck");

    testStore.resolveTopOfStack({ targets: [firstCard] });
    expect(firstCard.zone).toBe("deck");

    expect(
      testStore.getZonesCards().deck.map((card) => card.lorcanitoCard.id),
    ).toEqual([gatheringKnowledgeAndWisdom.id, youreWelcome.id, breakFree.id]);
  });
});
