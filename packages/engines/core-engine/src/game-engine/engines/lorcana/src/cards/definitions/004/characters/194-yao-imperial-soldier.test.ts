/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { yaoImperialSoldier } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
