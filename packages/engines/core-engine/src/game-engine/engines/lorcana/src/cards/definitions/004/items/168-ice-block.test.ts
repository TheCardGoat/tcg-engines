import { describe, it } from "bun:test";
import { iceBlock } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ice Block", () => {
  it.skip("**CHILLY LABOR** {E} − Chosen character gets -1 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: iceBlock.cost,
      play: [iceBlock],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", iceBlock.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
