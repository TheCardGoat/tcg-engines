/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { youCanFly } from "@lorcanito/lorcana-engine/cards/002/actions/actions.ts";
import { goofyKnightForADay } from "@lorcanito/lorcana-engine/cards/002/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("You Can Fly", () => {
  it("Chosen character gains **Evasive** until the start of your next turn.", () => {
    const testStore = new TestStore({
      inkwell: youCanFly.cost,
      hand: [youCanFly],
      play: [goofyKnightForADay],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", youCanFly.id);
    const target = testStore.getByZoneAndId("play", goofyKnightForADay.id);

    expect(target.hasEvasive).toBe(false);
    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });
    expect(target.hasEvasive).toBe(true);
  });
});
