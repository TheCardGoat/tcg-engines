/**
 * @jest-environment node
 */

import { describe, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { dukeWeaseltonSmallTimeCrook } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

describe("Duke Weaselton - Small-Time Crook", () => {
  it.skip("", () => {
    const testStore = new TestStore({
      inkwell: dukeWeaseltonSmallTimeCrook.cost,

      play: [dukeWeaseltonSmallTimeCrook],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      dukeWeaseltonSmallTimeCrook.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveOptionalAbility();
    testStore.resolveTopOfStack({});
  });
});
