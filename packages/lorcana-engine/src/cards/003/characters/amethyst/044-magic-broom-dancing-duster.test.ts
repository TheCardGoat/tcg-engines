/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { magicBroomDancingDuster } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Magic Broom - Dancing Duster", () => {
  it.skip("**ENERGETIC CLEANING** When you play this character, if you have a Sorcerer character in play, exert an opposing character. The chosen character doesn't ready at the start of their next turn.", () => {
    const testStore = new TestStore({
      inkwell: magicBroomDancingDuster.cost,
      hand: [magicBroomDancingDuster],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      magicBroomDancingDuster.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
