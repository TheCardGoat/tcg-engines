import { describe, it } from "bun:test";
import { marshmallowTerrifyingSnowman } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Marshmallow - Terrifying Snowman", () => {
  it.skip("**BEHEMOTH** This character gets +1 {S} for each card in your hand.", () => {
    const testStore = new TestStore({
      inkwell: marshmallowTerrifyingSnowman.cost,
      play: [marshmallowTerrifyingSnowman],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      marshmallowTerrifyingSnowman.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
