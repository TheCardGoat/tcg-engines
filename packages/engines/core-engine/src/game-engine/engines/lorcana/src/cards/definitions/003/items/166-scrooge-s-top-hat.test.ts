/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { scroogesTopHat } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/items";

describe("Scrooge's Top Hat", () => {
  it.skip("**BUSINESS EXPERTISE** {E} – You pay 1 {I} less for the next item you play this turn.", () => {
    const testStore = new TestStore({
      inkwell: scroogesTopHat.cost,
      play: [scroogesTopHat],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", scroogesTopHat.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
