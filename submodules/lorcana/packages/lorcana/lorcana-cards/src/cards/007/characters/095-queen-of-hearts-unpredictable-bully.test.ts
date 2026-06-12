import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { queenOfHeartsUnpredictableBully } from "./095-queen-of-hearts-unpredictable-bully";

const characterA = createMockCharacter({
  id: "queen-bully-char-a",
  name: "Character A",
  cost: 3,
  strength: 2,
  willpower: 3,
});

const characterB = createMockCharacter({
  id: "queen-bully-char-b",
  name: "Character B",
  cost: 2,
  strength: 1,
  willpower: 2,
});

describe("Queen of Hearts - Unpredictable Bully", () => {
  it("has Shift 3 keyword", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
      play: [queenOfHeartsUnpredictableBully],
      deck: 1,
    });
    expect(testEngine.asPlayerOne().hasKeyword(queenOfHeartsUnpredictableBully, "Shift")).toBe(
      true,
    );
  });

  describe("IF I LOSE MY TEMPER… - Whenever another character is played, put a damage counter on them.", () => {
    it("puts 1 damage on a character when it is played while Queen is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [queenOfHeartsUnpredictableBully],
        hand: [characterA],
        inkwell: characterA.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().getDamage(queenOfHeartsUnpredictableBully)).toBe(0);

      expect(testEngine.asPlayerOne().playCard(characterA)).toBeSuccessfulCommand();

      // characterA should have 1 damage counter put on it
      expect(testEngine.asPlayerOne().getDamage(characterA)).toBe(1);
      // Queen herself should not be damaged
      expect(testEngine.asPlayerOne().getDamage(queenOfHeartsUnpredictableBully)).toBe(0);
    });

    it("does NOT trigger when Queen of Hearts herself is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [queenOfHeartsUnpredictableBully],
        inkwell: queenOfHeartsUnpredictableBully.cost,
        deck: 2,
      });

      expect(
        testEngine.asPlayerOne().playCard(queenOfHeartsUnpredictableBully),
      ).toBeSuccessfulCommand();

      // Queen herself should have no damage (she is excluded as she is the trigger source ability holder)
      expect(testEngine.asPlayerOne().getDamage(queenOfHeartsUnpredictableBully)).toBe(0);
    });

    it("triggers for each character played while Queen is in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [queenOfHeartsUnpredictableBully],
        hand: [characterA, characterB],
        inkwell: characterA.cost + characterB.cost,
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(characterA)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(characterA)).toBe(1);
      expect(testEngine.asPlayerOne().getDamage(queenOfHeartsUnpredictableBully)).toBe(0);

      expect(testEngine.asPlayerOne().playCard(characterB)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getDamage(characterB)).toBe(1);
      // characterA doesn't get more damage
      expect(testEngine.asPlayerOne().getDamage(characterA)).toBe(1);
      expect(testEngine.asPlayerOne().getDamage(queenOfHeartsUnpredictableBully)).toBe(0);
    });

    it("triggers when opponent plays a character (requires bag resolution by Queen's controller)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [queenOfHeartsUnpredictableBully],
          deck: 2,
        },
        {
          hand: [characterA],
          inkwell: characterA.cost,
          deck: 2,
        },
      );

      // Pass to opponent's turn
      testEngine.asPlayerOne().passTurn();

      expect(testEngine.asPlayerTwo().playCard(characterA)).toBeSuccessfulCommand();

      // The triggered ability is in Player 1's bag (cross-player trigger does not auto-resolve)
      expect(testEngine.asPlayerOne().getBagCount()).toBeGreaterThanOrEqual(1);
      // Resolve the bag effect explicitly as Player 1
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(queenOfHeartsUnpredictableBully, {}),
      ).toBeSuccessfulCommand();

      // characterA (played by opponent) should have 1 damage counter
      expect(testEngine.asPlayerTwo().getDamage(characterA)).toBe(1);
      expect(testEngine.asPlayerOne().getDamage(queenOfHeartsUnpredictableBully)).toBe(0);
    });
  });
});
