/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { amberChromiconItem } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Amber Chromicon - Item", () => {
  it.skip("**AMBER LIGHT** {E} – Remove up to 1 damage from each of your characters.", () => {
    const testStore = new TestStore({
      inkwell: amberChromiconItem.cost,
      play: [amberChromiconItem],
    });

    const cardUnderTest = testStore.getCard(amberChromiconItem);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
