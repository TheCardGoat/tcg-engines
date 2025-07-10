/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { stitchTeamUnderdog } from "@lorcanito/lorcana-engine/cards/005/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Stitch - Team Underdog", () => {
  it.skip("**HEAVE HO!** When you play this character, you may deal 2 damage to chosen character.", () => {
    const testStore = new TestStore({
      inkwell: stitchTeamUnderdog.cost,
      hand: [stitchTeamUnderdog],
    });

    const cardUnderTest = testStore.getCard(stitchTeamUnderdog);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
