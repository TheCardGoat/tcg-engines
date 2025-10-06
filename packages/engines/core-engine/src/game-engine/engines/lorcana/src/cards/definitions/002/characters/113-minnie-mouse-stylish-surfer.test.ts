/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { minnieMouseStylishSurfer } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

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
