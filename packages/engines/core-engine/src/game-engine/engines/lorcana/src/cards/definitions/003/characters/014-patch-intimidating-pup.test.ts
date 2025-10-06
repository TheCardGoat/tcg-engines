/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { patchIntimidatingPup } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Patch - Little Menace", () => {
  it.skip("**BARK** {E} – Chosen character gets -2 {S} until the start of your next turn.", () => {
    const testStore = new TestStore({
      inkwell: patchIntimidatingPup.cost,
      play: [patchIntimidatingPup],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      patchIntimidatingPup.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
