/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { touchedMyHeart } from "@lorcanito/lorcana-engine/cards/003/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Has Set My Heaaaaaaart ...", () => {
  it.skip("Banish chosen item.", () => {
    const testStore = new TestStore({
      inkwell: touchedMyHeart.cost,
      hand: [touchedMyHeart],
    });

    const cardUnderTest = testStore.getCard(touchedMyHeart);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
