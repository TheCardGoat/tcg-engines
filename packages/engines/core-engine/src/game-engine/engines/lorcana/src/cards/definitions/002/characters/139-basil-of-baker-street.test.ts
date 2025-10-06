/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { basilOfBakerStreet } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Basil - Of Baker Street", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: basilOfBakerStreet.cost,

      play: [basilOfBakerStreet],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      basilOfBakerStreet.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
