/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { rlsLegacysCannon } from "~/game-engine/engines/lorcana/src/cards/definitions/004/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("RLS Legacy's Cannon", () => {
  it.skip("**BA-BOOM!** {E}, 2 {I}, Discard a card - Deal 2 damage to chosen character or location.", () => {
    const testStore = new TestStore({
      inkwell: rlsLegacysCannon.cost,
      play: [rlsLegacysCannon],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", rlsLegacysCannon.id);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
