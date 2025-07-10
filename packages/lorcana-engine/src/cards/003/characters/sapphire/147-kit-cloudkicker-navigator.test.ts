/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { kitCloudkickerNavigator } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Kit Cloudkicker - Navigator", () => {
  it.skip("**Shift** 3 _(You may pay 3 {I} to play this on top of one of your characters named Kit Cloudkicker.)_**Ward** _(Opponents can't choose this character except to challenge.)_", () => {
    const testStore = new TestStore({
      play: [kitCloudkickerNavigator],
    });

    const cardUnderTest = testStore.getCard(kitCloudkickerNavigator);
    expect(cardUnderTest.hasShift).toBe(true);
  });
});
