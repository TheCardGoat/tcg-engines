/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { theFatesOnlyOneEye } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("The Fates - Only One Eye", () => {
  it.skip("**ALL WILL BE SEEN** When you play this character, look at the top card of each opponent's deck.", () => {
    const testStore = new TestStore({
      inkwell: theFatesOnlyOneEye.cost,
      hand: [theFatesOnlyOneEye],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      theFatesOnlyOneEye.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
