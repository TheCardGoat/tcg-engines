/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { marshmallowTerrifyingSnowman } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/characters";

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
