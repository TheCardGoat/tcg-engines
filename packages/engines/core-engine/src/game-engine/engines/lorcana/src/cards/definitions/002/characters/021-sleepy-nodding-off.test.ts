import { describe, expect, it } from "bun:test";
import { sleepyNoddingOff } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

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
