/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";
import { controlYourTemper } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { mickeyMouseTrueFriend } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

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
