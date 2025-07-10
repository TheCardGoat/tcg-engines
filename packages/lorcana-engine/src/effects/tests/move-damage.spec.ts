/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  allCardsById,
  type LorcanitoCharacterCard,
} from "@lorcanito/lorcana-engine";
import { characterCardMock } from "@lorcanito/lorcana-engine/__mocks__/mockCards";
import { moveDamageAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

const testCard: LorcanitoCharacterCard = {
  ...characterCardMock,
  abilities: [
    // move damage ability is not using the effect you created
    moveDamageAbility({
      amount: 1,
      from: chosenCharacter,
      to: chosenCharacter,
    }),
  ],
};

allCardsById[testCard.id] = testCard;

describe("Moving damage from one character to another", () => {
  it("Should let the player pick two targets", () => {
    const testStore = new TestStore({
      inkwell: testCard.cost,
      hand: [testCard],
      play: [goofyKnightForADay],
    });

    const cardUnderTest = testStore.getCard(testCard);

    const target = testStore.getCard(goofyKnightForADay);
    target.updateCardDamage(2, "add");
    expect(target.meta.damage).toBe(2);

    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({ targets: [target] }, true);
    testStore.resolveTopOfStack({ targets: [cardUnderTest] }, true);

    expect(target.meta.damage).toBe(1);
    expect(cardUnderTest.meta.damage).toBe(1);
  });
});
