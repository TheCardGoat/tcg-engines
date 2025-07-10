/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { ratiganCriminalMastermind } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
