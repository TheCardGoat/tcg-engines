/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { queenOfHeartsImpulsiveRuler } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Queen of Hearts - Impulsive Ruler", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: queenOfHeartsImpulsiveRuler.cost,
      play: [queenOfHeartsImpulsiveRuler],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      queenOfHeartsImpulsiveRuler.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
