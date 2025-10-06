/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { ruttNorthernMoose } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Rutt - Northern Moose", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: ruttNorthernMoose.cost,
      play: [ruttNorthernMoose],
    });

    const cardUnderTest = testStore.getCard(ruttNorthernMoose);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
