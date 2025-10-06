/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { heiheiProtectiveRooster } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("HeiHei - Protective Rooster", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: heiheiProtectiveRooster.cost,
      play: [heiheiProtectiveRooster],
    });

    const cardUnderTest = testStore.getCard(heiheiProtectiveRooster);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
