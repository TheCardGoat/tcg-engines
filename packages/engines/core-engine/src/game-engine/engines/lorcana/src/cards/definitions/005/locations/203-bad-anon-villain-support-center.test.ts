/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { badanonVillainSupportCenter } from "~/game-engine/engines/lorcana/src/cards/definitions/005/locations/locations";

describe("Bad-Anon - Villain Support Center", () => {
  it.skip("**THERE'S NO ONE I'D RATHER BE THAN ME** Villain {E}, 3 {I} - Play a character with the same name as this character for free' while here.", () => {
    const testStore = new TestStore({
      inkwell: badanonVillainSupportCenter.cost,
      play: [badanonVillainSupportCenter],
    });

    const cardUnderTest = testStore.getCard(badanonVillainSupportCenter);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
