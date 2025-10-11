import { describe, it } from "bun:test";
import { stitchTeamUnderdog } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
