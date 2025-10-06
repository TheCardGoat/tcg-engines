/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { kakamoraMenacingSailor } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Kakamora - Menacing Sailor", () => {
  it.skip("**PLUNDER** When you play this character, each opponent loses 1 Lore.", () => {
    const testStore = new TestStore({
      inkwell: kakamoraMenacingSailor.cost,
      hand: [kakamoraMenacingSailor],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      kakamoraMenacingSailor.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
