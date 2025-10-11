import { describe, it } from "bun:test";
import { dukeWeaseltonSmallTimeCrook } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Duke Weaselton - Small-Time Crook", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: dukeWeaseltonSmallTimeCrook.cost,

      play: [dukeWeaseltonSmallTimeCrook],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      dukeWeaseltonSmallTimeCrook.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
