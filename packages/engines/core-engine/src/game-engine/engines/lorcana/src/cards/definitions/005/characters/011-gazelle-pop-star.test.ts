/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { gazellePopStar } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gazelle - Pop Star", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: gazellePopStar.cost,
      play: [gazellePopStar],
    });

    const cardUnderTest = testStore.getCard(gazellePopStar);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
