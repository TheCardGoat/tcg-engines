import { describe, expect, it } from "bun:test";
import { cinderellaBallroomSensation } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { distract } from "~/game-engine/engines/lorcana/src/cards/definitions/003/actions";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Distract", () => {
  it("Chosen character gets -2 {S} this turn. Draw a card.", () => {
    const testStore = new TestStore({
      inkwell: distract.cost,
      hand: [distract],
      play: [cinderellaBallroomSensation],
      deck: 2,
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", distract.id);
    const target = testStore.getByZoneAndId(
      "play",
      cinderellaBallroomSensation.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.strength).toEqual(
      Math.max(0, cinderellaBallroomSensation.strength - 2),
    );
    expect(testStore.getZonesCardCount()).toEqual(
      expect.objectContaining({
        hand: 1,
        deck: 1,
      }),
    );
  });
});
