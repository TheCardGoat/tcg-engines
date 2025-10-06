/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import {
  plutoDeterminedDefender,
  plutoFriendlyPooch,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe.skip("Pluto - Friendly Pooch", () => {
  it("**GOOD DOG** {E} – You pay 1 {I} less for the next character you play this turn.", () => {
    const testStore = new TestStore({
      inkwell: plutoDeterminedDefender.cost - 1,
      hand: [plutoDeterminedDefender],
      play: [plutoFriendlyPooch],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      plutoFriendlyPooch.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
