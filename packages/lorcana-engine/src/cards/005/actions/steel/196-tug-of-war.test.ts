/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { tugofwar } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Tug-of-War", () => {
  it.skip("Choose one:", () => {
    const testStore = new TestStore({
      inkwell: tugofwar.cost,
      hand: [tugofwar],
    });

    const cardUnderTest = testStore.getCard(tugofwar);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("• Deal 1 damage to each opposing character without **Evasive**.", () => {
    const testStore = new TestStore({
      inkwell: tugofwar.cost,
      hand: [tugofwar],
    });

    const cardUnderTest = testStore.getCard(tugofwar);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });

  it.skip("• Deal 3 damage to each opposing character with **Evasive**.", () => {
    const testStore = new TestStore({
      inkwell: tugofwar.cost,
      hand: [tugofwar],
    });

    const cardUnderTest = testStore.getCard(tugofwar);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
