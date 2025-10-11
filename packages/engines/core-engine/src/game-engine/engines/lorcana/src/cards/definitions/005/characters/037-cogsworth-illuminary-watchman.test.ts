import { describe, it } from "bun:test";
import { cogsworthIlluminaryWatchman } from "~/game-engine/engines/lorcana/src/cards/definitions/005/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Cogsworth - Illuminary Watchman", () => {
  it.skip("**TIME TO MOVE IT!** When you play this character, chosen character gains **Rush** this turn. _(They can challenge the turn they’re played.)_", () => {
    const testStore = new TestStore({
      inkwell: cogsworthIlluminaryWatchman.cost,
      hand: [cogsworthIlluminaryWatchman],
    });

    const cardUnderTest = testStore.getCard(cogsworthIlluminaryWatchman);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
