/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { magicBroomDancingDuster } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

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
