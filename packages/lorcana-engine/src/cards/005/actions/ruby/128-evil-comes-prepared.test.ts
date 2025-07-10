/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { evilComesPrepared } from "@lorcanito/lorcana-engine/cards/005/actions/actions";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Evil Comes Prepared", () => {
  it.skip("Ready chosen character of yours. They can’t quest for the rest of this turn. If a Villain character is chosen, gain 1 lore.", () => {
    const testStore = new TestStore({
      inkwell: evilComesPrepared.cost,
      hand: [evilComesPrepared],
    });

    const cardUnderTest = testStore.getCard(evilComesPrepared);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
