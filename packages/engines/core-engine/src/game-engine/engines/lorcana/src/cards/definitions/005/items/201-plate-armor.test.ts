/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { plateArmor } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Plate Armor", () => {
  it.skip("**WELL CRAFTED** {E} – Chosen character gains **Resist** +2 until the start of your next turn. _(Damage dealt to them is reduced by 2.)_", () => {
    const testStore = new TestStore({
      inkwell: plateArmor.cost,
      play: [plateArmor],
    });

    const cardUnderTest = testStore.getCard(plateArmor);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
