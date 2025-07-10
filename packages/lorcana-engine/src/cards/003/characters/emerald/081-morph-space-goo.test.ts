/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { cogsworthGrandfatherClock } from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { morphSpaceGoo } from "@lorcanito/lorcana-engine/cards/003/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Morph - Space Goo", () => {
  it("**MIMICRY** You may play any character with **Shift** on this character as if this character had any name.", () => {
    const testStore = new TestStore({
      inkwell: 3,
      play: [morphSpaceGoo],
      hand: [cogsworthGrandfatherClock],
    });

    const cardUnderTest = testStore.getCard(morphSpaceGoo);
    const shiftCard = testStore.getCard(cogsworthGrandfatherClock);

    shiftCard.shift(cardUnderTest);

    expect(shiftCard.zone).toBe("play");
    expect(cardUnderTest.zone).toBe("play");
    expect(cardUnderTest.meta?.shifter).toBe(shiftCard.instanceId);
    expect(shiftCard.meta?.shifted).toBe(cardUnderTest.instanceId);
  });
});
