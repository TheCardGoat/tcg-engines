/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import { aladdinCorneredSwordman } from "@lorcanito/lorcana-engine/cards/001/characters/characters";
import {
  painUnderworldImp,
  panicUnderworldImp,
} from "@lorcanito/lorcana-engine/cards/002/characters/characters";
import { TestStore } from "@lorcanito/lorcana-engine/rules/testStore";

describe("Panic - Underworld Imp", () => {
  describe("**I CAN HANDLE IT** When you play this character, chosen character gets +2 {S} this turn. If the chosen character is named Pain, he gets +4 {S} instead.", () => {
    it("Targets Pain", () => {
      const testStore = new TestStore({
        inkwell: panicUnderworldImp.cost,
        hand: [panicUnderworldImp],
        play: [painUnderworldImp],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        panicUnderworldImp.id,
      );
      const target = testStore.getByZoneAndId("play", painUnderworldImp.id);

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.strength).toBe(painUnderworldImp.strength + 4);
    });

    it("NOT Targeting Pain", () => {
      const testStore = new TestStore({
        inkwell: panicUnderworldImp.cost,
        hand: [panicUnderworldImp],
        play: [aladdinCorneredSwordman],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        panicUnderworldImp.id,
      );
      const target = testStore.getByZoneAndId(
        "play",
        aladdinCorneredSwordman.id,
      );

      cardUnderTest.playFromHand();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.strength).toBe(aladdinCorneredSwordman.strength + 2);
    });
  });
});
