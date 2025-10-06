/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import {
  grammaTalaKeeperOfAncientStories,
  mrSmeeBumblingMate,
} from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/index";
import { cleansingRainwater } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Gramma Tala - Keeper of Ancient Stories", () => {
  it("**THERE WAS ONLY OCEAN** When you play this character, look at the top 2 cards of your deck. You may add one into your hand. Put the rest on the bottom of your deck in any order.", () => {
    const testStore = new TestStore({
      inkwell: grammaTalaKeeperOfAncientStories.cost,
      hand: [grammaTalaKeeperOfAncientStories],
      deck: [mrSmeeBumblingMate, cleansingRainwater],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      grammaTalaKeeperOfAncientStories.id,
    );
    const target = testStore.getByZoneAndId("deck", mrSmeeBumblingMate.id);
    const bottom = testStore.getByZoneAndId("deck", cleansingRainwater.id);
    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ scry: { hand: [target], bottom: [bottom] } });
  });
});
