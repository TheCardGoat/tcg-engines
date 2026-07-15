import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { stitchNaughtyExperiment } from "./070-stitch-naughty-experiment";

const opposingCharacter = createMockCharacter({
  id: "stitch-naughty-opposing",
  name: "Stitch Naughty Opposing Character",
  cost: 2,
  strength: 2,
  willpower: 3,
});

describe("Stitch - Naughty Experiment", () => {
  describe("I DARE YOU! — {E} Chosen opposing character gains Reckless until the start of your next turn", () => {
    it("grants Reckless to chosen opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [stitchNaughtyExperiment] },
        { play: [opposingCharacter] },
      );

      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(stitchNaughtyExperiment, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(true);
    });

    it("exerts Stitch as the cost", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [stitchNaughtyExperiment] },
        { play: [opposingCharacter] },
      );

      expect(testEngine.isExerted(stitchNaughtyExperiment)).toBe(false);

      expect(
        testEngine.asPlayerOne().activateAbility(stitchNaughtyExperiment, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.isExerted(stitchNaughtyExperiment)).toBe(true);
    });

    it("target with Reckless cannot quest", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [stitchNaughtyExperiment], deck: 2 },
        { play: [opposingCharacter], deck: 2 },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(stitchNaughtyExperiment, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().quest(opposingCharacter)).not.toBeSuccessfulCommand();
    });

    it("Reckless expires at the start of the activating player's next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        { play: [stitchNaughtyExperiment], deck: 2 },
        { play: [opposingCharacter], deck: 2 },
      );

      expect(
        testEngine.asPlayerOne().activateAbility(stitchNaughtyExperiment, {
          targets: [opposingCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(true);

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Still active during player two's turn
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(true);

      // Opposing character must challenge Stitch (exerted from ability cost) due to Reckless
      expect(
        testEngine.asPlayerTwo().challenge(opposingCharacter, stitchNaughtyExperiment),
      ).toBeSuccessfulCommand();

      // Now P2 can pass turn since the Reckless obligation is satisfied
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // At the start of player one's next turn -- Reckless should be gone
      expect(testEngine.hasKeyword(opposingCharacter, "Reckless")).toBe(false);
    });
  });
});
