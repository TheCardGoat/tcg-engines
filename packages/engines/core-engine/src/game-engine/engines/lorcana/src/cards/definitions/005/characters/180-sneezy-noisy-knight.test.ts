/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { sneezyNoisyKnight } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
