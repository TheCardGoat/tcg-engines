/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { arthurTrainedSwordsman } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { lastCannon } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";

describe("Last Cannon", () => {
  it("**ARM YOURSELF** 1 {I}, Banish this item − Chosen character gains **Challenger** +3 this turn. _(They get +3 {S} while challenging.)_", () => {
    const testStore = new TestStore({
      play: [lastCannon, arthurTrainedSwordsman],
      inkwell: 1,
    });

    const cardUnderTest = testStore.getByZoneAndId("play", lastCannon.id);
    const target = testStore.getByZoneAndId("play", arthurTrainedSwordsman.id);

    expect(target.hasChallenger).toBeFalsy();

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.hasChallenger).toBeTruthy();
    expect(cardUnderTest.zone).toEqual("discard");
  });
});
