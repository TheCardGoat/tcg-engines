/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { kitCloudkickerNavigator } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

describe("Kit Cloudkicker - Navigator", () => {
  it.skip("**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Kit Cloudkicker.)_**Ward** _(Opponents can't choose this character except to challenge.)_", () => {
    const testStore = new TestStore({
      play: [kitCloudkickerNavigator],
    });

    const cardUnderTest = testStore.getCard(kitCloudkickerNavigator);
    expect(cardUnderTest.hasShift).toBe(true);
  });
});
