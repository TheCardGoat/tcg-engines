/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  liloMakingAWish,
  stichtNewDog,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import {
  aladdinBraveRescuer,
  almaMadrigalFamilyMatriarch,
} from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import { luisaMadrigalEntertainingMuscle } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
