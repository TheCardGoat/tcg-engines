/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { belleUntrainedMystic } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Belle - Untrained Mystic", () => {
  it.skip("**HERE NOW, DON'T DO THAT** When you play this character, move up to 1 damage counter from chosen character to chosen opposing character.", () => {
    const testStore = new TestStore({
      inkwell: belleUntrainedMystic.cost,
      hand: [belleUntrainedMystic],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      belleUntrainedMystic.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
