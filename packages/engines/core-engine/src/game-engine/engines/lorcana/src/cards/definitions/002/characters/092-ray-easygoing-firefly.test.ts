/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { rayEasygoingFirefly } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

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
