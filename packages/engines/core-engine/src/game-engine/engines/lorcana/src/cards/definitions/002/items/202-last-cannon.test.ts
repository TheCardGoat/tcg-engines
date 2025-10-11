import { describe, expect, it } from "bun:test";
import { arthurTrainedSwordsman } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { lastCannon } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
