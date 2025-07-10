/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { scarVengefulLion } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Scar - Vengeful Lion", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: scarVengefulLion.cost,
      play: [scarVengefulLion],
    });

    const cardUnderTest = testStore.getCard(scarVengefulLion);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("**LIFE'S NOT FAIR, IS IT?** Whenever one of your characters challenges a damaged character, you may draw a card.", () => {
    const testStore = new TestStore({
      inkwell: scarVengefulLion.cost,
      play: [scarVengefulLion],
    });

    const cardUnderTest = testStore.getCard(scarVengefulLion);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
