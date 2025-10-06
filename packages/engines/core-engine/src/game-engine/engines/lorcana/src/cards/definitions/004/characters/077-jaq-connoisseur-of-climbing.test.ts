/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { jaqConnoisseurOfClimbing } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

describe("Jaq - Connoisseur of Climbing", () => {
  it.skip("**SNEAKY IDEA** When you play this character, chosen opposing character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_", () => {
    const testStore = new TestStore({
      inkwell: jaqConnoisseurOfClimbing.cost,
      hand: [jaqConnoisseurOfClimbing],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      jaqConnoisseurOfClimbing.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
