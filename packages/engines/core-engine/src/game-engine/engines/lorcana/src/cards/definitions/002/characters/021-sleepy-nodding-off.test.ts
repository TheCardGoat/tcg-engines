/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";
import { sleepyNoddingOff } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";

describe("Sleepy - Nodding Off", () => {
  it("**YAWN!** This character enters play exerted.", () => {
    const testStore = new TestStore({
      inkwell: sleepyNoddingOff.cost,
      hand: [sleepyNoddingOff],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", sleepyNoddingOff.id);

    cardUnderTest.playFromHand();
    expect(cardUnderTest.ready).toEqual(false);
  });
});
