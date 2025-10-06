/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  monstroWhaleOfAWhale,
  motherGothelConceitedManipulator,
} from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mother Gothel - Conceited Manipulator", () => {
  it("**MOTHER KNOWS BEST** When you play this character, you may pay 3 {I} to return chosen character to their player’s hand.", () => {
    const testStore = new TestStore({
      inkwell: motherGothelConceitedManipulator.cost + 3,
      hand: [motherGothelConceitedManipulator],
      play: [monstroWhaleOfAWhale],
    });

    const cardUnderTest = testStore.getCard(motherGothelConceitedManipulator);
    const target = testStore.getCard(monstroWhaleOfAWhale);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({ targets: [target] });
    expect(target.zone).toEqual("hand");
  });
});
