/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { cogsworthGrandfatherClock } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import { morphSpaceGoo } from "~/game-engine/engines/lorcana/src/cards/definitions/003/characters/characters";

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
