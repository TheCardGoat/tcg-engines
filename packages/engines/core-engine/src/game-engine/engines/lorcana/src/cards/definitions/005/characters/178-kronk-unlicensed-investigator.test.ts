/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { kronkUnlicensedInvestigator } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/characters";

describe("Kronk - Unlicensed Investigator", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: kronkUnlicensedInvestigator.cost,
      play: [kronkUnlicensedInvestigator],
    });

    const cardUnderTest = testStore.getCard(kronkUnlicensedInvestigator);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
