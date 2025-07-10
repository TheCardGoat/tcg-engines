/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { badanonVillainSupportCenter } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
