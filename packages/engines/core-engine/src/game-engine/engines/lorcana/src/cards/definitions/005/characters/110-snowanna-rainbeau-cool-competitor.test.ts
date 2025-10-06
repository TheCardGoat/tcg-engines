/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { snowannaRainbeauCoolCompetitor } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Snowanna Rainbeau - Cool Competitor", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: snowannaRainbeauCoolCompetitor.cost,
      play: [snowannaRainbeauCoolCompetitor],
    });

    const cardUnderTest = testStore.getCard(snowannaRainbeauCoolCompetitor);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
