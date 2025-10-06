/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { ratigansMarvelousTrap } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Ratigan's Marvelous Trap", () => {
  it("**SNAP! BOOM! TWANG!** Banish this item − Each opponent loses 2 lore.", () => {
    const initialLore = 3;

    const testStore = new TestStore(
      {
        play: [ratigansMarvelousTrap],
      },
      {
        lore: initialLore,
      },
    );

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      ratigansMarvelousTrap.id,
    );

    cardUnderTest.activate();

    expect(cardUnderTest.zone).toEqual("discard");
    expect(testStore.getPlayerLore("player_two")).toEqual(initialLore - 2);
  });
});
