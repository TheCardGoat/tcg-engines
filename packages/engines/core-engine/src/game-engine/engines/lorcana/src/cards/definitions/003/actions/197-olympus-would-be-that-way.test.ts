/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { mickeyBraveLittleTailor } from "@lorcanito/lorcana-engine/cards/001/characters/characters.ts";
import { olympusWouldBeThatWay } from "@lorcanito/lorcana-engine/cards/003/actions/actions.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Olympus Would Be That Way", () => {
  it("Your characters get +3 {S} this turn while challenging a location.", () => {
    const testStore = new TestStore({
      inkwell: olympusWouldBeThatWay.cost,
      hand: [olympusWouldBeThatWay],
      play: [mickeyBraveLittleTailor],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      olympusWouldBeThatWay.id,
    );

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({});

    expect(testStore.getZonesCardCount().discard).toBe(1); // Olympus Would Be That Way goes to discard
  });
});
