import { describe, it } from "bun:test";
import { imperialBow } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Imperial Bow", () => {
  it.skip("**WITHIN RANGE** {E}, 1 {I} − Chosen Hero character gains **Challenger** +2 and **Evasive** this turn. _(They get +2 {S} while challenging. They can challenge characters with Evasive.)_", () => {
    const testStore = new TestStore({
      inkwell: imperialBow.cost,
      play: [imperialBow],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", imperialBow.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
