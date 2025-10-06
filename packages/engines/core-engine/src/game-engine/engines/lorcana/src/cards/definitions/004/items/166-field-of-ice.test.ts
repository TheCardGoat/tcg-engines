/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { fieldOfIce } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Field of Ice", () => {
  it.skip("**ICY DEFENSE** Whenever you play a character, they gain **Resist** +1 until the start of your next turn. _(Damage dealt to them is reduced by 1.)_", () => {
    const testStore = new TestStore({
      inkwell: fieldOfIce.cost,
      play: [fieldOfIce],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", fieldOfIce.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
