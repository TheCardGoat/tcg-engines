/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { elsasIcePalacePlaceOfSolitude } from "@lorcanito/lorcana-engine/cards/005/locations/locations";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Elsa's Ice Palace - Place of Solitude", () => {
  it.skip("**ETERNAL WINTER** When you play this location, choose an exerted character. While this location is in play, that character can't ready at the start of their turn.", () => {
    const testStore = new TestStore({
      inkwell: elsasIcePalacePlaceOfSolitude.cost,
      play: [elsasIcePalacePlaceOfSolitude],
    });

    const cardUnderTest = testStore.getCard(elsasIcePalacePlaceOfSolitude);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
