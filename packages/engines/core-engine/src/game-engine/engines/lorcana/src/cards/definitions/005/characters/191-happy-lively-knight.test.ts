/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { happyLivelyKnight } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Happy - Lively Knight", () => {
  it.skip("**BURST OF SPEED** During your turn, this character gains Evasive. _(They can challenge characters with Evasive.)_", () => {
    const testStore = new TestStore({
      inkwell: happyLivelyKnight.cost,
      play: [happyLivelyKnight],
    });

    const cardUnderTest = testStore.getCard(happyLivelyKnight);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
