/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { iagoFakeFlamingo } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Iago - Fake Flamingo", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: iagoFakeFlamingo.cost,
      play: [iagoFakeFlamingo],
    });

    const cardUnderTest = testStore.getCard(iagoFakeFlamingo);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
