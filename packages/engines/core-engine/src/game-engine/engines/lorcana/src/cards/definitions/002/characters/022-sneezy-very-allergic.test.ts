/**
 * @jest-environment node
 */

import { describe, expect, it } from "@jest/globals";
import {
  fairyGodmotherHereToHelp,
  happyGoodNatured,
  sneezyVeryAllergic,
} from "~/game-engine/engines/lorcana/src/cards/definitions/002/characters/characters";
import {
  TestEngine,
  TestStore,
} from "~/game-engine/engines/lorcana/src/testing/lorcana-test-engine";

describe("Sneezy - Very Allergic", () => {
  describe("**AH-CHOO!** Whenever you play this character or another Seven Dwarfs character, you may give chosen character -1 {S} this turn.", () => {
    it("playing Sneezy", () => {
      const testStore = new TestStore({
        inkwell: sneezyVeryAllergic.cost,
        hand: [sneezyVeryAllergic],
        play: [fairyGodmotherHereToHelp],
      });

      const cardUnderTest = testStore.getByZoneAndId(
        "hand",
        sneezyVeryAllergic.id,
      );
      const target = testStore.getByZoneAndId(
        "play",
        fairyGodmotherHereToHelp.id,
      );

      cardUnderTest.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.strength).toBe(fairyGodmotherHereToHelp.strength - 1);
    });

    it("playing another Seven Dwarfs character", () => {
      const testStore = new TestStore({
        inkwell: happyGoodNatured.cost,
        hand: [happyGoodNatured],
        play: [fairyGodmotherHereToHelp, sneezyVeryAllergic],
      });

      const dwarf = testStore.getByZoneAndId("hand", happyGoodNatured.id);
      const target = testStore.getByZoneAndId(
        "play",
        fairyGodmotherHereToHelp.id,
      );

      dwarf.playFromHand();
      testStore.resolveOptionalAbility();
      testStore.resolveTopOfStack({ targets: [target] });

      expect(target.strength).toBe(fairyGodmotherHereToHelp.strength - 1);
    });

    it("playing another character, Not a seven dwarfs char", () => {
      const testStore = new TestStore({
        inkwell: fairyGodmotherHereToHelp.cost,
        hand: [fairyGodmotherHereToHelp],
        play: [sneezyVeryAllergic],
      });

      const nonDwarf = testStore.getByZoneAndId(
        "hand",
        fairyGodmotherHereToHelp.id,
      );

      nonDwarf.playFromHand();
      expect(testStore.stackLayers).toHaveLength(0);
    });

    it("opponent playing a seven dwarfs char", () => {
      const testStore = new TestStore(
        {
          inkwell: happyGoodNatured.cost,
          hand: [happyGoodNatured],
        },
        { play: [sneezyVeryAllergic] },
      );

      const dwarf = testStore.getByZoneAndId("hand", happyGoodNatured.id);

      dwarf.playFromHand();
      expect(testStore.stackLayers).toHaveLength(0);
    });
  });
});
