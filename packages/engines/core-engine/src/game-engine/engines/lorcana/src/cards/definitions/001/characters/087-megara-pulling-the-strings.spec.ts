/**
 * @jest-environment node
 */
import { describe, expect, it } from "bun:test";
import {
  megaraPullingTheStrings,
  mickeyMouseTrueFriend,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Megara Pulling the Strings", () => {
  it("**WONDER BOY** When you play this character, chosen character gets +2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: megaraPullingTheStrings.cost,
      hand: [megaraPullingTheStrings],
      play: [mickeyMouseTrueFriend],
    });

    const cardUnderTest = testStore.getByZoneAndId(
      "hand",
      megaraPullingTheStrings.id,
    );
    const target = testStore.getByZoneAndId("play", mickeyMouseTrueFriend.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) + 2);
  });
});
