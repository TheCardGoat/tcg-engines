/**
 * @jest-environment node
 */

import { describe, expect, it, test } from "@jest/globals";
import {
  allCardsById,
  type LorcanitoActionCard,
} from "@lorcanito/lorcana-engine";
import { actionCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/target";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { dealDamageEffect } from "@lorcanito/lorcana-engine/effects/effects";
import type { ModalEffect } from "@lorcanito/lorcana-engine/effects/effectTypes";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const modalEffect: ModalEffect = {
  type: "modal",
  // TODO: Get rid of target
  target: chosenCharacter,
  modes: [
    {
      id: "1",
      text: "Deal 1 damage to chosen character",
      effects: [dealDamageEffect(1, chosenCharacter)],
    },
    {
      id: "2",
      text: "Deal 2 damage to chosen character",
      effects: [dealDamageEffect(2, chosenCharacter)],
    },
    {
      id: "3",
      text: "Deal 3 damage to chosen character",
      effects: [dealDamageEffect(3, chosenCharacter)],
    },
  ],
};

const testCard: LorcanitoActionCard = {
  ...actionCardMock,
  id: "test_card_modal",
  abilities: [
    {
      type: "resolution",
      responder: "self",
      effects: [modalEffect],
    },
  ],
};

allCardsById[testCard.id] = testCard;

describe("Modal effect", () => {
  test.each(["1", "2", "3"])("Selecting mode %i.", (mode) => {
    const testStore = new TestStore(
      {
        inkwell: testCard.cost,
        hand: [testCard],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    const cardUnderTest = testStore.getCard(testCard);
    const target = testStore.getCard(goofyKnightForADay);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ mode: mode }, true);
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.damage).toEqual(Number(mode));
  });
});
