/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { motherGothelWitheredAndWicked } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Mother Gothel - Withered and Wicked", () => {
  it("**WHAT HAVE YOU DONE?!** This character enters play with 3 damage.", () => {
    const testStore = new TestStore({
      inkwell: motherGothelWitheredAndWicked.cost,
      hand: [motherGothelWitheredAndWicked],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      motherGothelWitheredAndWicked.id,
    );

    cardUnderTest.playFromHand();

    expect(cardUnderTest.damage).toEqual(3);
  });
});
