import { describe, it } from "bun:test";
import { snowWhiteUnexpectedHouseGuest } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Snow White - Unexpected Houseguest", () => {
  it.skip("How Do You Do?", () => {
    const testStore = new TestStore({
      inkwell: snowWhiteUnexpectedHouseGuest.cost,
      play: [snowWhiteUnexpectedHouseGuest],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      snowWhiteUnexpectedHouseGuest.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
