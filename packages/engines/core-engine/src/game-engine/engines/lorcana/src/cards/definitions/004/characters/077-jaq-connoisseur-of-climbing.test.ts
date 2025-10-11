import { describe, it } from "bun:test";
import { jaqConnoisseurOfClimbing } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
