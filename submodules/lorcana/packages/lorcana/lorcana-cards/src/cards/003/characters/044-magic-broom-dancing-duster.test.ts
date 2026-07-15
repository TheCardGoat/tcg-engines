import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { magicBroomDancingDuster } from "./044-magic-broom-dancing-duster";
import { mickeyMouseWaywardSorcerer } from "../../001/characters/051-mickey-mouse-wayward-sorcerer";

const opponentCharacter = createMockCharacter({
  id: "broom-test-opp",
  name: "Opponent Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const nonSorcererCharacter = createMockCharacter({
  id: "broom-non-sorcerer",
  name: "Non-Sorcerer Character",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Magic Broom - Dancing Duster", () => {
  describe("POWER CLEAN - When you play this character, if you have a Sorcerer character in play, you may exert chosen opposing character. They can't ready at the start of their next turn.", () => {
    it("does not trigger when no Sorcerer character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [magicBroomDancingDuster],
          inkwell: magicBroomDancingDuster.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(magicBroomDancingDuster)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      // No Sorcerer in play — no effect applied
      expect(testEngine.isExerted(opponentCharacter)).toBe(false);
    });

    it("triggers when a Sorcerer character is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [magicBroomDancingDuster],
          inkwell: magicBroomDancingDuster.cost,
          play: [mickeyMouseWaywardSorcerer],
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(magicBroomDancingDuster)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThan(0);
    });

    it("exerts chosen opposing character and applies cant-ready restriction", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [magicBroomDancingDuster],
          inkwell: magicBroomDancingDuster.cost,
          play: [mickeyMouseWaywardSorcerer],
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: false }],
          deck: 2,
        },
      );

      expect(testEngine.isExerted(opponentCharacter)).toBe(false);

      expect(testEngine.asPlayerOne().playCard(magicBroomDancingDuster)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicBroomDancingDuster, {
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(true);
    });

    it("cant-ready restriction prevents readying at start of opponent's next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [magicBroomDancingDuster],
          inkwell: magicBroomDancingDuster.cost,
          play: [mickeyMouseWaywardSorcerer],
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: false }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(magicBroomDancingDuster)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicBroomDancingDuster, {
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opponentCharacter)).toBe(true);
    });

    it("cant-ready restriction is removed after opponent's turn starts", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [magicBroomDancingDuster],
          inkwell: magicBroomDancingDuster.cost,
          play: [mickeyMouseWaywardSorcerer],
          deck: 2,
        },
        {
          play: [{ card: opponentCharacter, exerted: false }],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(magicBroomDancingDuster)).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(magicBroomDancingDuster, {
          resolveOptional: true,
          targets: [opponentCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(false);
    });

    it("ability is optional - can decline to choose a character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [magicBroomDancingDuster],
          inkwell: magicBroomDancingDuster.cost,
          play: [mickeyMouseWaywardSorcerer],
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(magicBroomDancingDuster)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(magicBroomDancingDuster, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(opponentCharacter)).toBe(false);
      expect(testEngine.hasRestriction(opponentCharacter, "cant-ready")).toBe(false);
    });

    it("does not trigger with only non-Sorcerer characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [magicBroomDancingDuster],
          inkwell: magicBroomDancingDuster.cost,
          play: [nonSorcererCharacter],
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(magicBroomDancingDuster)).toBeSuccessfulCommand();

      // Board-state condition is checked at trigger time, ability is not queued when condition is false.
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      // No Sorcerer in play — no effect applied
      expect(testEngine.isExerted(opponentCharacter)).toBe(false);
    });
  });
});
