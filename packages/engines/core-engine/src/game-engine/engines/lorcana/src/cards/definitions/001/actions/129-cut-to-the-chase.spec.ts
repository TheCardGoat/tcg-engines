import { describe, expect, it } from "bun:test";
import { cutToTheChase } from "~/game-engine/engines/lorcana/src/cards/definitions/001/actions";
import { moanaOfMotunui } from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Cut to the Chase", () => {
  it("Chosen character gains **Rush** this turn.", () => {
    const testStore = new TestStore({
      inkwell: cutToTheChase.cost,
      hand: [cutToTheChase],
      play: [moanaOfMotunui],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", cutToTheChase.id);
    const target = testStore.getByZoneAndId("play", moanaOfMotunui.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.hasRush).toEqual(true);
  });
});
