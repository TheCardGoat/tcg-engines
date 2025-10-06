/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { criKeeLuckyCricket } from "~/game-engine/engines/lorcana/src/cards/definitions/004/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Cri-Kee - Lucky Cricket", () => {
  it.skip("**SPREADING GOOD FORTUNE** When you play this character, your other characters get +3 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: criKeeLuckyCricket.cost,
      hand: [criKeeLuckyCricket],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      criKeeLuckyCricket.id,
    );
    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
