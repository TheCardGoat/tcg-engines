/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { daisyDuckMusketeerSpy } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Daisy Duck - Musketeer Spy", () => {
  it.skip("**INFILTRATION** When you play this character, each opponent chooses and discards a card.", () => {
    const testStore = new TestStore({
      inkwell: daisyDuckMusketeerSpy.cost,
      hand: [daisyDuckMusketeerSpy],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      daisyDuckMusketeerSpy.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
