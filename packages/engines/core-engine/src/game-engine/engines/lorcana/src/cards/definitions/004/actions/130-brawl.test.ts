/**
 * @jest-environment node
 */

import { describe, expect, it } from "bun:test";
import { brawl } from "@lorcanito/lorcana-engine/cards/004/actions/actions.ts";
import { daisyDuckLovelyLady } from "@lorcanito/lorcana-engine/cards/004/characters/characters.ts";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore.ts";

describe("Brawl", () => {
  it("Banish chosen character with 2 {S} or less.", () => {
    const testStore = new TestStore({
      inkwell: brawl.cost,
      hand: [brawl],
      play: [daisyDuckLovelyLady],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", brawl.id);
    const target = testStore.getByZoneAndId("play", daisyDuckLovelyLady.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targets: [target] });

    expect(target.zone).toEqual("discard");
    expect(cardUnderTest.zone).toEqual("discard");
  });
});
