/**
 * @jest-environment node
 */

import { describe, expect, it, test } from "@jest/globals";
import {
  allCardsById,
  type LorcanitoActionCard,
  type PlayEffect,
} from "@lorcanito/lorcana-engine";
import { actionCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import { tangle } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { weDontTalkAboutBruno } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import {
  elsaTheFifthSpirit,
  gazellePopStar,
} from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const playEffect: PlayEffect = {
  type: "play",
  forFree: true,
  target: {
    type: "card",
    value: 1,
    filters: [
      { filter: "zone", value: "hand" },
      { filter: "characteristics", value: ["action"] },
    ],
  },
};

const testCard: LorcanitoActionCard = {
  ...actionCardMock,
  abilities: [
    {
      type: "resolution",
      effects: [playEffect],
    },
  ],
};

const anotherTestCard: LorcanitoActionCard = {
  ...actionCardMock,
  id: "anotherTestCard",
  abilities: [
    {
      type: "resolution",
      effects: [{ ...playEffect, bottomCardAfterPlaying: true }],
    },
  ],
};

allCardsById[testCard.id] = testCard;
allCardsById[anotherTestCard.id] = anotherTestCard;

describe("Play card for free effect", () => {
  it("Should create resolution effects", () => {
    const testStore = new TestStore(
      {
        inkwell: testCard.cost,
        hand: [testCard, tangle],
      },
      {
        hand: [weDontTalkAboutBruno],
      },
    );

    testStore.store.tableStore.getTable("player_two").lore = 5;

    const cardUnderTest = testStore.getCard(testCard);
    const target = testStore.getCard(tangle);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(testStore.store.tableStore.getTable("player_two").lore).toBe(4);
  });

  it("Bottoms card after playing", () => {
    const initialDeck = [
      gazellePopStar,
      testCard,
      elsaTheFifthSpirit,
      weDontTalkAboutBruno,
    ];
    const testStore = new TestStore({
      inkwell: anotherTestCard.cost,
      hand: [anotherTestCard, tangle],
      deck: initialDeck,
    });

    const cardUnderTest = testStore.getCard(anotherTestCard);
    const target = testStore.getCard(tangle);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toBe("deck");
    expect(testStore.getZonesCardCount().deck).toBe(initialDeck.length + 1);
  });
});
