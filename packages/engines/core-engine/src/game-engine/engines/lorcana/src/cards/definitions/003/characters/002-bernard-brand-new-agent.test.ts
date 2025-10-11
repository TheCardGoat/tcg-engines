import { describe, it } from "bun:test";
import { bernardBrandNewAgent } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Bernard - Brand-New Agent", () => {
  it.skip("**I’LL CHECK IT OUT** At the end of your turn, if this character is exerted, you may ready another chosen character of yours.", () => {
    const testStore = new TestStore({
      inkwell: bernardBrandNewAgent.cost,
      play: [bernardBrandNewAgent],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      bernardBrandNewAgent.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
