/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { nightHowlerRage } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Night Howler Rage", () => {
  it.skip("Draw a card. Chosen character gains **Reckless** during their next turn._(They can’t quest and must challenge if able.)_", () => {
    const testStore = new TestStore({
      inkwell: nightHowlerRage.cost,
      hand: [nightHowlerRage],
    });

    const cardUnderTest = testStore.getCard(nightHowlerRage);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
