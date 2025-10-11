/**
 * @jest-environment node
 */
import { describe, expect, it } from "bun:test";
import {
  auroraBriarRose,
  mickeyMouseTrueFriend,
} from "~/game-engine/engines/lorcana/src/cards/definitions/001/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Aurora Briar Rose!", () => {
  it("DISARMING BEAUTY effect - Chosen characters gets -2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: auroraBriarRose.cost,
      hand: [auroraBriarRose],
      play: [mickeyMouseTrueFriend],
    });

    const cardUnderTest = testStore.getByZoneAndId("hand", auroraBriarRose.id);
    const target = testStore.getByZoneAndId("play", mickeyMouseTrueFriend.id);

    cardUnderTest.playFromHand();
    testStore.resolveTopOfStack({ targetId: target.instanceId });

    expect(target.strength).toEqual((target.lorcanitoCard.strength || 0) - 2);
  });
});
