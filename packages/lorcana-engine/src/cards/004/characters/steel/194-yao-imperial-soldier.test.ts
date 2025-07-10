/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { yaoImperialSoldier } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Yao - Imperial Soldier", () => {
  it.skip("**Challenger +2** _(While challenging, this character gets +2 {S}.)_", () => {
    const testStore = new TestStore({
      inkwell: yaoImperialSoldier.cost,
      play: [yaoImperialSoldier],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      yaoImperialSoldier.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
