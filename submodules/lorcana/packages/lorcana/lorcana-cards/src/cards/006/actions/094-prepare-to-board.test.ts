import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { prepareToBoard } from "./094-prepare-to-board";

const nonPirateCharacter = createMockCharacter({
  id: "ptb-non-pirate",
  name: "Non-Pirate Character",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const pirateCharacter = createMockCharacter({
  id: "ptb-pirate",
  name: "Pirate Character",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
  classifications: ["Storyborn", "Pirate"],
});

describe("Prepare to Board!", () => {
  describe("Chosen character gets +2 strength this turn. If a Pirate character is chosen, they get +3 strength instead.", () => {
    it("gives +2 strength this turn to a non-Pirate character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [prepareToBoard],
        inkwell: prepareToBoard.cost,
        play: [nonPirateCharacter],
        deck: 2,
      });

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(nonPirateCharacter);

      expect(
        testEngine.asPlayerOne().playCard(prepareToBoard, {
          targets: [nonPirateCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(nonPirateCharacter)).toBe(strengthBefore + 2);
    });

    it("gives +3 strength this turn to a Pirate character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [prepareToBoard],
        inkwell: prepareToBoard.cost,
        play: [pirateCharacter],
        deck: 2,
      });

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(pirateCharacter);

      expect(
        testEngine.asPlayerOne().playCard(prepareToBoard, {
          targets: [pirateCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Pirate gets +3 total (not +2 then +3, but +2 +1 = +3 total)
      expect(testEngine.asPlayerOne().getCardStrength(pirateCharacter)).toBe(strengthBefore + 3);
    });

    it("strength bonus for non-Pirate expires after the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [prepareToBoard],
          inkwell: prepareToBoard.cost,
          play: [nonPirateCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(nonPirateCharacter);

      expect(
        testEngine.asPlayerOne().playCard(prepareToBoard, {
          targets: [nonPirateCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(nonPirateCharacter)).toBe(strengthBefore + 2);

      // Pass the turn to let the buff expire
      testEngine.asServer().passTurn();

      expect(testEngine.asPlayerOne().getCardStrength(nonPirateCharacter)).toBe(strengthBefore);
    });

    it("strength bonus for Pirate expires after the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [prepareToBoard],
          inkwell: prepareToBoard.cost,
          play: [pirateCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      const strengthBefore = testEngine.asPlayerOne().getCardStrength(pirateCharacter);

      expect(
        testEngine.asPlayerOne().playCard(prepareToBoard, {
          targets: [pirateCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getCardStrength(pirateCharacter)).toBe(strengthBefore + 3);

      // Pass the turn to let the buff expire
      testEngine.asServer().passTurn();

      expect(testEngine.asPlayerOne().getCardStrength(pirateCharacter)).toBe(strengthBefore);
    });
  });
});
