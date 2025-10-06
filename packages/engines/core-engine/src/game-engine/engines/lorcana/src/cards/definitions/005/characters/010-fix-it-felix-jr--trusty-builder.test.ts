/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { fixitFelixJrTrustyBuilder } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Fix‐It Felix, Jr. - Trusty Builder", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: fixitFelixJrTrustyBuilder.cost,
      play: [fixitFelixJrTrustyBuilder],
    });

    const cardUnderTest = testStore.getCard(fixitFelixJrTrustyBuilder);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
