/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  liloMakingAWish,
  stichtNewDog,
} from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  aladdinBraveRescuer,
  almaMadrigalFamilyMatriarch,
} from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { luisaMadrigalEntertainingMuscle } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Alma Madrigal - Family Matriarch", () => {
  it("**ALL AT THE TABLE** When you play this character, look at your deck. You may reveal a Madrigal character card. Shuffle your deck and put that card on top of your deck.", () => {
    const testStore = new TestStore({
      inkwell: almaMadrigalFamilyMatriarch.cost,
      hand: [almaMadrigalFamilyMatriarch],
      deck: [
        liloMakingAWish,
        stichtNewDog,
        luisaMadrigalEntertainingMuscle,
        aladdinBraveRescuer,
      ],
    });

    const cardUnderTest = testStore.getCard(almaMadrigalFamilyMatriarch);
    const target = testStore.getCard(luisaMadrigalEntertainingMuscle);
    cardUnderTest.playFromHand();

    testStore.resolveTopOfStack({ targets: [target] });

    testStore.passTurn();
    testStore.passTurn();

    expect(target.zone).toEqual("hand");
  });
});
