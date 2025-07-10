/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { marshmallowTerrifyingSnowman } from "@lorcanito/lorcana-engine/cards/004/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
