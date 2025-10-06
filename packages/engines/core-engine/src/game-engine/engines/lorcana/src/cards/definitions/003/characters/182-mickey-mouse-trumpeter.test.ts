/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { mickeyMouseTrumpeter } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

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
