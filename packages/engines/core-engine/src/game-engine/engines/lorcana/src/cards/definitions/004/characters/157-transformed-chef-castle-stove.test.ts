import { describe, it } from "bun:test";
import { transformedChefCastleStove } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Transformed Chef - Castle Stove", () => {
  it.skip("**SMOOTH SMALL DISHES** When you play this character, remove up to 2 damage from chosen character.", () => {
    const testStore = new TestStore({
      inkwell: transformedChefCastleStove.cost,
      hand: [transformedChefCastleStove],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      transformedChefCastleStove.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
