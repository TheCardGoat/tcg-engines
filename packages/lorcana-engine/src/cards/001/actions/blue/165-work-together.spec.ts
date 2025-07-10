/**
 * @jest-environment node
 */
import { describe, expect, it } from "@jest/globals";
import { workTogether } from "@lorcanito/lorcana-engine/cards/001/actions/actions";
import { moanaOfMotunui } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Work Together", () => {
  it("Chosen character gains **Support** this turn.", () => {
    const testStore = new TestStore({
      inkwell: workTogether.cost,
      hand: [workTogether],
      play: [moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", workTogether.id);
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.hasSupport).toEqual(true);
  });
});
