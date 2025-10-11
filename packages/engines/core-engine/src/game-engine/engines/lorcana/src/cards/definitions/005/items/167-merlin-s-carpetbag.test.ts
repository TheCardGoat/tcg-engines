import { describe, it } from "bun:test";
import { merlinsCarpetbag } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Merlin's Carpetbag", () => {
  it.skip("**Hockety Pockety**{E}, 1 {I} – Return an item card from your discard to your hand.", () => {
    const testStore = new TestStore({
      inkwell: merlinsCarpetbag.cost,
      play: [merlinsCarpetbag],
    });

    const cardUnderTest = testStore.getCard(merlinsCarpetbag);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
