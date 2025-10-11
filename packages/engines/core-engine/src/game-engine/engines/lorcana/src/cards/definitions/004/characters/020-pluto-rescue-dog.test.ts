import { describe, it } from "bun:test";
import { plutoRescueDog } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pluto - Rescue Dog", () => {
  it.skip("**TO THE RESCUE** When you play this character, you may remove up to 3 damage from chosen character.", () => {
    const testStore = new TestStore({
      inkwell: plutoRescueDog.cost,
      hand: [plutoRescueDog],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", plutoRescueDog.id);
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
