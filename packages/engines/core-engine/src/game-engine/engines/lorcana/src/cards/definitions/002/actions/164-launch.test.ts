/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { launch } from "@lorcanito/lorcana-engine/cards/002/actions/actions.ts";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters.ts";
import { pawpsicle } from "@lorcanito/lorcana-engine/cards/002/items/items.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

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
