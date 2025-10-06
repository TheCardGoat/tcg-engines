/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  painUnderworldImp,
  panicUnderworldImp,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/index";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Pain - Underworld Imp", () => {
  it("**COMING, YOUR MOST LUGUBRIOUSNESS** While this character has 5 {S} or more, he gets + 2 {L}.", () => {
    const testStore = new TestStore({
      inkwell: panicUnderworldImp.cost,
      hand: [panicUnderworldImp],
      play: [painUnderworldImp],
    });

    const buff = testStore.getByZoneAndId("hand", panicUnderworldImp.id);
    const cardUnderTest = testStore.getByZoneAndId(
      "play",
      painUnderworldImp.id,
    );

    buff.playFromHand();
    testStore.resolveTopOfStack({ targets: [cardUnderTest] });

    expect(cardUnderTest.strength).toBe(painUnderworldImp.strength + 4);
    expect(cardUnderTest.lore).toBe(painUnderworldImp.lore + 2);
  });
});
