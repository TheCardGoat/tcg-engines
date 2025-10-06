/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { rayEasygoingFirefly } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ray - Easygoing Firefly", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: rayEasygoingFirefly.cost,

      play: [rayEasygoingFirefly],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      rayEasygoingFirefly.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
