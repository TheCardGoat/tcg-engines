import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { ratiganVeryLargeMouse } from "./121-ratigan-very-large-mouse";

const weakOpponent = createMockCharacter({
  id: "ratigan-weak-opp",
  name: "Weak Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const strongOpponent = createMockCharacter({
  id: "ratigan-strong-opp",
  name: "Strong Opponent",
  cost: 4,
  strength: 5,
  willpower: 4,
  lore: 1,
});

const allyToReady = createMockCharacter({
  id: "ratigan-ally",
  name: "Ally To Ready",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Ratigan - Very Large Mouse", () => {
  describe("THIS IS MY KINGDOM — When you play this character, exert chosen opposing character with 3 {S} or less. Choose one of your characters and ready them. They can't quest for the rest of this turn.", () => {
    it("exerts opposing character with 3 strength or less and readies your character with quest restriction", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: ratiganVeryLargeMouse.cost,
          hand: [ratiganVeryLargeMouse],
          play: [{ card: allyToReady, exerted: true }],
          deck: 2,
        },
        {
          play: [weakOpponent],
          deck: 2,
        },
      );

      expect(testEngine.isExerted(weakOpponent)).toBe(false);
      expect(testEngine.isExerted(allyToReady)).toBe(true);

      expect(testEngine.asPlayerOne().playCard(ratiganVeryLargeMouse)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(ratiganVeryLargeMouse, { targets: [weakOpponent, allyToReady] }),
      ).toBeSuccessfulCommand();

      // Opposing character should be exerted
      expect(testEngine.isExerted(weakOpponent)).toBe(true);
      // Your character should be readied
      expect(testEngine.isExerted(allyToReady)).toBe(false);
      // Your readied character should have quest restriction
      expect(testEngine.hasRestriction(allyToReady, "cant-quest")).toBe(true);
    });

    it("quest restriction expires after the turn ends", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: ratiganVeryLargeMouse.cost,
          hand: [ratiganVeryLargeMouse],
          play: [{ card: allyToReady, exerted: true }],
          deck: 2,
        },
        {
          play: [weakOpponent],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(ratiganVeryLargeMouse)).toBeSuccessfulCommand();

      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(ratiganVeryLargeMouse, { targets: [weakOpponent, allyToReady] }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(allyToReady, "cant-quest")).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.hasRestriction(allyToReady, "cant-quest")).toBe(false);
    });
  });

  describe("Regression", () => {
    it("does not block the game when no valid targets exist", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        inkwell: ratiganVeryLargeMouse.cost,
        hand: [ratiganVeryLargeMouse],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(ratiganVeryLargeMouse)).toBeSuccessfulCommand();

      // The sequence has no valid targets for any step, but a bag entry is still created.
      // Resolving it with no targets should auto-skip all steps.
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(ratiganVeryLargeMouse, { targets: [] }),
        ).toBeSuccessfulCommand();
      }
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not block the game when no valid targets on opponent side (only strong opponents)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          inkwell: ratiganVeryLargeMouse.cost,
          hand: [ratiganVeryLargeMouse],
          deck: 2,
        },
        {
          play: [strongOpponent],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(ratiganVeryLargeMouse)).toBeSuccessfulCommand();

      // No opposing target with strength <= 3, so the exert part has no valid targets.
      // Resolving with no targets should auto-skip all steps.
      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(ratiganVeryLargeMouse, { targets: [] }),
        ).toBeSuccessfulCommand();
      }
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
