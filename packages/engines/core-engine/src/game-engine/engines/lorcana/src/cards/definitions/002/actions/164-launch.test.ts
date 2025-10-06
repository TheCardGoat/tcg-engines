import { describe, expect, it } from "bun:test";
import { launch } from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { goofyKnightForADay } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters";
import { pawpsicle } from "~/game-engine/engines/lorcana/src/cards/definitions/002/items";
import { TestStore } from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Launch", () => {
  it("Banish chosen item of yours to deal 5 damage to chosen character.", () => {
    const testStore = new TestStore(
      {
        inkwell: launch.cost,
        hand: [launch],
        play: [pawpsicle],
      },
      {
        play: [goofyKnightForADay],
      },
    );

    const cardUnderTest = testStore.getByZoneAndId("hand", launch.id);
    const item = testStore.getByZoneAndId("play", pawpsicle.id);
    const target = testStore.getByZoneAndId(
      "play",
      goofyKnightForADay.id,
      "player_two",
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [item] }, true);
    testStore.resolveTopOfStack({
      targets: [target],
    });

    expect(cardUnderTest.zone).toBe("discard");
    expect(item.zone).toBe("discard");
    expect(target.meta.damage).toBe(5);
  });
});
