import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { captainHookUnderhanded } from "./071-captain-hook-underhanded";

const opposingPirate = createMockCharacter({
  id: "captain-hook-underhanded-opposing-pirate",
  name: "Opposing Pirate",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Pirate"],
});

const opposingNonPirate = createMockCharacter({
  id: "captain-hook-underhanded-opposing-non-pirate",
  name: "Opposing Non-Pirate",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
  classifications: ["Storyborn", "Ally"],
});

const attacker = createMockCharacter({
  id: "captain-hook-underhanded-attacker",
  name: "Attacker",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
});

describe("Captain Hook - Underhanded", () => {
  describe("INSPIRES DREAD - While this character is exerted, opposing Pirate characters can't quest.", () => {
    it("does not restrict opposing Pirates while Captain Hook is ready", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: opposingPirate, isDrying: false }],
          deck: [],
        },
        {
          play: [captainHookUnderhanded],
          deck: [],
        },
      );

      expect(testEngine.asPlayerOne().quest(opposingPirate)).toBeSuccessfulCommand();
    });

    it("restricts opposing Pirates while Captain Hook is exerted but not non-Pirates", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: opposingPirate, isDrying: false },
            { card: opposingNonPirate, isDrying: false },
          ],
          deck: [],
        },
        {
          play: [{ card: captainHookUnderhanded, exerted: true }],
          deck: [],
        },
      );

      expect(testEngine.asPlayerOne().quest(opposingPirate)).not.toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().quest(opposingNonPirate)).toBeSuccessfulCommand();
    });
  });

  describe("UPPER HAND - Whenever this character is challenged, draw a card.", () => {
    it("draws a card when Captain Hook is challenged", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: attacker, isDrying: false }],
          deck: [],
        },
        {
          play: [{ card: captainHookUnderhanded, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(attacker, captainHookUnderhanded),
      ).toBeSuccessfulCommand();
      const [hookBag] = testEngine.asPlayerTwo().getBagEffects();
      expect(hookBag).toBeDefined();
      expect(
        testEngine.asPlayerTwo().resolvePendingByCard(captainHookUnderhanded),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getZonesCardCount(PLAYER_TWO).hand).toBe(1);
    });
  });
});
