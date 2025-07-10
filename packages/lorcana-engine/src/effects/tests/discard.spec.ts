/**
 * @jest-environment node
 */

import { expect, it } from "@jest/globals";
import {
  allCardsById,
  type CardEffectTarget,
  type DiscardEffect,
  type DynamicAmount,
  type LorcanitoCharacterCard,
  ResolutionAbility,
} from "@lorcanito/lorcana-engine";
import { characterCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import {
  mickeyBraveLittleTailor,
  mickeyMouseDetective,
  mickeyMouseTrueFriend,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { hakunaMatata } from "@lorcanito/lorcana-engine/cards/001/songs/songs";
import { mickeyMouseFriendlyFace } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const amount: DynamicAmount = {
  dynamic: true,
  difference: 3,
  filters: [
    { filter: "owner", value: "self" },
    { filter: "zone", value: "hand" },
  ],
};

const target: CardEffectTarget = {
  type: "card",
  value: amount,
  filters: [
    { filter: "zone", value: "hand" },
    { filter: "owner", value: "self" },
  ],
};
const effect: DiscardEffect = {
  type: "discard",
  amount: {
    dynamic: true,
    difference: 3,
    filters: [
      { filter: "owner", value: "self" },
      { filter: "zone", value: "hand" },
    ],
  },
  target,
};

const testCard: LorcanitoCharacterCard = {
  ...characterCardMock,
  abilities: [
    {
      type: "resolution",
      name: "A FEELING OF POWER",
      text: "At the end of each opponent’s turn, if they have more than 3 cards in their hand, they discard until they have 3 cards in their hand.",
      effects: [effect],
    },
  ],
};

allCardsById[testCard.id] = testCard;

it("Discard until you have 3 cards", () => {
  const testStore = new TestStore({
    inkwell: testCard.cost,
    hand: [
      testCard,
      hakunaMatata,
      mickeyMouseTrueFriend,
      mickeyBraveLittleTailor,
      mickeyMouseDetective,
      mickeyMouseFriendlyFace,
    ],
    deck: 1,
  });

  const cardUnderTest = testStore.getCard(testCard);
  cardUnderTest.playFromHand();

  const cardToDiscard = testStore.getCard(mickeyMouseFriendlyFace);
  const anotherCardToDiscard = testStore.getCard(mickeyMouseDetective);

  testStore.resolveTopOfStack({
    targets: [cardToDiscard, anotherCardToDiscard],
  });

  expect(testStore.stackLayers).toHaveLength(0);
  expect(cardToDiscard.zone).toEqual("discard");
  expect(anotherCardToDiscard.zone).toEqual("discard");
});
