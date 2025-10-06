/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { minnieMouseStylishSurfer } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Minnie Mouse - Stylish Surfer", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: minnieMouseStylishSurfer.cost,

      play: [minnieMouseStylishSurfer],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      minnieMouseStylishSurfer.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
