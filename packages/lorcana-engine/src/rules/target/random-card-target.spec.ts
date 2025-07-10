/**
 * @jest-environment node
 */

import { describe, expect, it, test } from "@jest/globals";
import {
  allCardsById,
  type LorcanitoActionCard,
} from "@lorcanito/lorcana-engine";
import { actionCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import { weDontTalkAboutBruno } from "@lorcanito/lorcana-engine/cards/004/actions/actions";
import { opponentDiscardsARandomCard } from "@lorcanito/lorcana-engine/effects/effects";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const testCard: LorcanitoActionCard = {
  ...actionCardMock,
  abilities: [
    {
      type: "resolution",
      effects: [opponentDiscardsARandomCard],
    },
  ],
};

allCardsById[testCard.id] = testCard;

describe("Random Card Target", () => {
  it("Only one card to target", () => {
    const testStore = new TestStore(
      {
        inkwell: testCard.cost,
        hand: [testCard],
      },
      {
        hand: [weDontTalkAboutBruno],
      },
    );

    const cardUnderTest = testStore.getCard(testCard);
    const target = testStore.getCard(weDontTalkAboutBruno);

    cardUnderTest.playFromHand();
    // Ability with random target should resolve automatically
    expect(testStore.stackLayers.length).toBe(0);

    expect(testStore.getZonesCardCount("player_two").hand).toBe(0);
    expect(testStore.getZonesCardCount("player_two").discard).toBe(1);
    expect(target.zone).toBe("discard");
  });

  it("Two card to target", () => {
    const testStore = new TestStore(
      {
        inkwell: testCard.cost,
        hand: [testCard],
      },
      {
        hand: [weDontTalkAboutBruno, weDontTalkAboutBruno],
      },
    );

    const cardUnderTest = testStore.getCard(testCard);

    cardUnderTest.playFromHand();
    // Ability with random target should resolve automatically
    expect(testStore.stackLayers.length).toBe(0);

    expect(testStore.getZonesCardCount("player_two").hand).toBe(1);
    expect(testStore.getZonesCardCount("player_two").discard).toBe(1);
  });
});
