import { describe, expect, it } from "bun:test";
import { controlYourTemper } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { mickeyMouseTrueFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Control Your Temper!", () => {
  it("Chosen characters gets -2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: controlYourTemper.cost,
      hand: [controlYourTemper],
      play: [mickeyMouseTrueFriend],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      controlYourTemper.id,
    );
    const target = testStore.getByZoneAndId("play", mickeyMouseTrueFriend.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) - 2);
  });
});
