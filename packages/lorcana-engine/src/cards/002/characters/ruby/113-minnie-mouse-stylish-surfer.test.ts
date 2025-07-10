/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { minnieMouseStylishSurfer } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
