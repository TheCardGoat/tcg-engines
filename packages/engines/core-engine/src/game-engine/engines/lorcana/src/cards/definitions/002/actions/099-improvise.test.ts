import { describe, expect, it } from "bun:test";
import { improvise } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { cinderellaBallroomSensation } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
