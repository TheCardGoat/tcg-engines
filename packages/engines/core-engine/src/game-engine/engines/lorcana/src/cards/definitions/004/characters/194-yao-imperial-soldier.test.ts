/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { yaoImperialSoldier } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

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
