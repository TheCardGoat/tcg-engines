/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { sleepySluggishKnight } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sleepy - Sluggish Knight", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: sleepySluggishKnight.cost,
      play: [sleepySluggishKnight],
    });

    const cardUnderTest = testStore.getCard(sleepySluggishKnight);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
