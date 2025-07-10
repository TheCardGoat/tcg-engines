/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { mickeyMouseTrumpeter } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Mickey Mouse - Trumpeter", () => {
  it.skip("**BUGLE CALL** {E}, 2 {I} - Play a character for free.", () => {
    const testStore = new TestStore({
      inkwell: mickeyMouseTrumpeter.cost,
      play: [mickeyMouseTrumpeter],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      mickeyMouseTrumpeter.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
