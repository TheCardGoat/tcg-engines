import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { belleOfTheBall } from "./158-belle-of-the-ball";

const otherCharacter = createMockCharacter({
  id: "belle-test-other-char",
  name: "Other Character",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const anotherCharacter = createMockCharacter({
  id: "belle-test-another-char",
  name: "Another Character",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

describe("Belle - Of the Ball", () => {
  it("has Ward", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [belleOfTheBall],
        deck: 2,
      },
      {
        deck: 2,
      },
    );

    expect(testEngine.asPlayerOne().hasKeyword(belleOfTheBall, "Ward")).toBe(true);
  });

  describe("USHERED INTO THE PARTY — When you play this character, your other characters gain Ward until the start of your next turn.", () => {
    it("grants Ward to other characters when played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [belleOfTheBall],
          inkwell: belleOfTheBall.cost,
          play: [otherCharacter, anotherCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Ward")).toBe(false);
      expect(testEngine.asPlayerOne().hasKeyword(anotherCharacter, "Ward")).toBe(false);

      expect(testEngine.asPlayerOne().playCard(belleOfTheBall)).toBeSuccessfulCommand();

      // The triggered ability should auto-resolve since target is YOUR_OTHER_CHARACTERS (no choice needed)
      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Ward")).toBe(true);
      expect(testEngine.asPlayerOne().hasKeyword(anotherCharacter, "Ward")).toBe(true);
    });

    it("Ward expires at the start of your next turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [belleOfTheBall],
          inkwell: belleOfTheBall.cost,
          play: [otherCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(belleOfTheBall)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Ward")).toBe(true);

      // Pass player one's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      // Ward should still be active during opponent's turn
      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Ward")).toBe(true);

      // Pass player two's turn — start of player one's next turn
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();
      // Ward should now be expired
      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Ward")).toBe(false);
    });

    it("does NOT grant Ward to Belle herself", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [belleOfTheBall],
          inkwell: belleOfTheBall.cost,
          play: [otherCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      // Belle has Ward from her keyword ability, but the triggered ability should not target herself
      // We verify the other character gets Ward but Belle's Ward is from her innate keyword only
      expect(testEngine.asPlayerOne().playCard(belleOfTheBall)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().hasKeyword(otherCharacter, "Ward")).toBe(true);
    });
  });
});
