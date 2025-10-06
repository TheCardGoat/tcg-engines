/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  goofyDaredevil,
  goofyMusketeer,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/characters";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { dinnerBell } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/items";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Dinner Bell", () => {
  it("**YOU KNOW WHAT HAPPENS** {E}, 2 {I} − Draw cards equal to the damage on chosen character of yours, then banish them.", () => {
    const testStore = new TestStore({
      inkwell: 2,
      deck: 4,
      play: [dinnerBell, goofyKnightForADay, goofyMusketeer, goofyDaredevil],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", dinnerBell.id);
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);
    const target2 = testStore.getByZoneAndId("play", goofyMusketeer.id);
    const target3 = testStore.getByZoneAndId("play", goofyDaredevil.id);

    // First target won't have any damage
    [target, target2, target3].forEach((target, index) => {
      target.updateCardDamage(index);
    });

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targets: [target3] });

    expect(cardUnderTest.ready).toEqual(false);
    expect(target.zone).toEqual("play");
    expect(target2.zone).toEqual("play");
    expect(target3.zone).toEqual("discard");
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 2,
        discard: 1,
        deck: 2,
      }),
    );
  });
});
