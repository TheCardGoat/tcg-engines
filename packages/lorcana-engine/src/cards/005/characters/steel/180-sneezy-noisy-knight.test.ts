/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { sneezyNoisyKnight } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Sneezy - Noisy Knight", () => {
  it.skip("**HEADWIND** When you play this character, chosen Knight character gains **Challenger** +2 this turn. _(They get +2 {S} while challenging.)_", () => {
    const testStore = new TestStore({
      inkwell: sneezyNoisyKnight.cost,
      hand: [sneezyNoisyKnight],
    });

    const cardUnderTest = testStore.getCard(sneezyNoisyKnight);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
