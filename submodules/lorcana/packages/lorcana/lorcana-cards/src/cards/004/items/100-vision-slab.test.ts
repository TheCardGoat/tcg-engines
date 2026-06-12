import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  PLAYER_ONE,
} from "@tcg/lorcana-engine/testing";
import { restoringTheHeart } from "../../007/actions/039-restoring-the-heart";
import { visionSlab } from "./100-vision-slab";

const damagedCharacter = createMockCharacter({
  id: "vision-slab-damaged",
  name: "Damaged Character",
  cost: 2,
  willpower: 5,
});

describe("Vision Slab", () => {
  describe("DANGER REVEALED — At the start of your turn, if an opposing character has damage, gain 1 lore.", () => {
    it("gains 1 lore at the start of your turn if an opposing character has damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [visionSlab],
          deck: 2,
        },
        {
          play: [damagedCharacter],
          deck: 2,
        },
      );

      testEngine.asServer().manualSetDamage(damagedCharacter, 2);

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
      expect(testEngine.asPlayerOne().resolvePendingByCard(visionSlab)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(1);
    });

    it("does not gain lore if no opposing character has damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [visionSlab],
          deck: 2,
        },
        {
          play: [damagedCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getLore(PLAYER_ONE)).toBe(0);
    });
  });

  describe("TRAPPED! — Damage counters can't be removed.", () => {
    it("prevents damage from being removed by a heal effect", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [visionSlab, damagedCharacter],
        hand: [restoringTheHeart],
        inkwell: restoringTheHeart.cost,
      });

      testEngine.asServer().manualSetDamage(damagedCharacter, 3);
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(3);

      expect(
        testEngine.asPlayerOne().playCard(restoringTheHeart, {
          targets: [damagedCharacter],
        }),
      ).toBeSuccessfulCommand();

      // TRAPPED! replaces remove-damage with amount 0, so damage is unchanged
      expect(testEngine.asPlayerOne().getDamage(damagedCharacter)).toBe(3);
    });
  });
});
