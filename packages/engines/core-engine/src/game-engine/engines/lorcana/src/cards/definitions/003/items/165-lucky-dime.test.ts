import { describe, expect, it } from "bun:test";
import { nalaFierceFriend } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters";
import { luckyDime } from "~/game-engine/engines/lorcana/src/cards/definitions/003/items/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Lucky Dime", () => {
  it("**NUMBER ONE** {E}, 2 {I} − Choose a character of yours and gain lore equal to their {L}.", () => {
    const testStore = new TestStore({
      inkwell: 2,
      play: [luckyDime, nalaFierceFriend],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", luckyDime.id);
    const target = testStore.getByZoneAndId("play", nalaFierceFriend.id);

    cardUnderTest.activate();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(cardUnderTest.meta.exerted).toBe(true);
    expect(testStore.getPlayerLore()).toBe(target.lore);
  });
});
