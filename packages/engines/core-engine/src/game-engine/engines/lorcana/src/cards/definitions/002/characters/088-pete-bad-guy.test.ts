/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  nothingToHide,
  zeroToHero,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/actions";
import { peteBadGuy } from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pete - Bad Guy", () => {
  it("Ward", () => {
    const testStore = new TestStore({
      play: [peteBadGuy],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", peteBadGuy.id);
    expect(cardUnderTest.hasWard).toBe(true);
  });

  it("**TAKE THAT!** Whenever you play an action, this character gets +2 {S} this turn.", () => {
    const testStore = new TestStore({
      inkwell: nothingToHide.cost + zeroToHero.cost,
      hand: [nothingToHide, zeroToHero],
      play: [peteBadGuy],
    });

    const cardUnderTest = testStore.getByZoneAndId("play", peteBadGuy.id);

    const actionOne = testStore.getByZoneAndId("hand", nothingToHide.id);
    actionOne.playFromHand();
    expect(cardUnderTest.strength).toBe(peteBadGuy.strength + 2);

    const actionTwo = testStore.getByZoneAndId("hand", zeroToHero.id);
    actionTwo.playFromHand();
    expect(cardUnderTest.strength).toBe(peteBadGuy.strength + 4);

    // "**WHO'S NEXT** While this character has 7 {S} or more, he gets +2 {L}."
    expect(cardUnderTest.lore).toBe(peteBadGuy.lore + 2);
  });
});
