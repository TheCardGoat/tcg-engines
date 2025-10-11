import { describe, it } from "bun:test";
import { diabloLoyalFamiliar } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Diablo - Loyal Familiar", () => {
  it.skip("**IN SEARCH OF AURORA** Whenever you play a character named Maleficent, you may look at the top card of your deck. Put it on either the top or the bottom of your deck.", () => {
    const testStore = new TestStore({
      inkwell: diabloLoyalFamiliar.cost,
      play: [diabloLoyalFamiliar],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      diabloLoyalFamiliar.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
