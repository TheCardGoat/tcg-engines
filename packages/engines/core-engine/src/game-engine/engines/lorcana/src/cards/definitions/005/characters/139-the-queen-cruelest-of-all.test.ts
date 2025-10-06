/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { theQueenCruelestOfAll } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("The Queen - Cruelest of All", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: theQueenCruelestOfAll.cost,
      play: [theQueenCruelestOfAll],
    });

    const cardUnderTest = testStore.getCard(theQueenCruelestOfAll);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
