/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { improvise } from "@lorcanito/lorcana-engine/cards/002/actions/actions.ts";
import { cinderellaBallroomSensation } from "@lorcanito/lorcana-engine/cards/002/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Improvise", () => {
  it("Chosen character gets +1 {S} this turn. Draw a card.", () => {
    const testStore = new TestStore({
      inkwell: improvise.cost,
      hand: [improvise],
      play: [cinderellaBallroomSensation],
      deck: 2,
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", improvise.id);
    const target = testStore.getByZoneAndId(
      "play",
      cinderellaBallroomSensation.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.strength).toEqual(cinderellaBallroomSensation.strength + 1);
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 1,
      }),
    );
  });
});
