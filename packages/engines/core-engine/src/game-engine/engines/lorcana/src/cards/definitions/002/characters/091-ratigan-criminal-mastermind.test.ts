/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { ratiganCriminalMastermind } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

describe("Ratigan - Criminal Mastermind", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: ratiganCriminalMastermind.cost,
      play: [ratiganCriminalMastermind],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      ratiganCriminalMastermind.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});

    expect(false).toBe(true);
  });
});
