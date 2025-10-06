/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { steelChromicon } from "~/game-engine/engines/lorcana/src/cards/definitions/005/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Steel Chromicon", () => {
  it.skip("**STEEL LIGHT** {E} – Deal 1 damage to chosen character.", () => {
    const testStore = new TestStore({
      inkwell: steelChromicon.cost,
      play: [steelChromicon],
    });

    const cardUnderTest = testStore.getCard(steelChromicon);

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
