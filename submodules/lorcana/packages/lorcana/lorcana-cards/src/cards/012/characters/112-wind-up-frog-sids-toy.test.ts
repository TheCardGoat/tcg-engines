import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { windupFrogSidsToy } from "./112-wind-up-frog-sids-toy";

const toyCharacter = createMockCharacter({
  id: "wind-up-frog-toy",
  name: "Test Toy",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  classifications: ["Storyborn", "Ally", "Toy"],
});

const nonToyCharacter = createMockCharacter({
  id: "wind-up-frog-non-toy",
  name: "Test Hero",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 1,
  classifications: ["Storyborn", "Hero"],
});

const heavyAttacker = createMockCharacter({
  id: "wind-up-frog-heavy-attacker",
  name: "Heavy Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
  lore: 1,
});

describe("Wind-Up Frog - Sid's Toy", () => {
  describe("Added Traction - If one of your Toy characters was banished this turn, you pay 2 {I} less to play this character.", () => {
    it("reduces cost by 2 when one of your Toy characters was banished this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [windupFrogSidsToy],
          inkwell: windupFrogSidsToy.cost - 2,
          play: [{ card: toyCharacter, damage: 4 }],
        },
        {
          play: [{ card: heavyAttacker, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().canPlayCard(windupFrogSidsToy)).toBe(false);

      // Challenge to banish the Toy character (player one's character dies).
      expect(
        testEngine.asPlayerOne().challenge(toyCharacter, heavyAttacker),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(toyCharacter)).toBe("discard");

      // Now we can play Wind-Up Frog with 2 less ink.
      expect(testEngine.asPlayerOne().canPlayCard(windupFrogSidsToy)).toBe(true);
      expect(testEngine.asPlayerOne().playCard(windupFrogSidsToy)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(windupFrogSidsToy)).toBe("play");
    });

    it("does not reduce cost when the banished character is not a Toy", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [windupFrogSidsToy],
          inkwell: windupFrogSidsToy.cost - 2,
          play: [{ card: nonToyCharacter, damage: 4 }],
        },
        {
          play: [{ card: heavyAttacker, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(nonToyCharacter, heavyAttacker),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(nonToyCharacter)).toBe("discard");

      expect(testEngine.asPlayerOne().canPlayCard(windupFrogSidsToy)).toBe(false);
    });

    it("does not reduce cost when the banished Toy character belonged to the opponent", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [windupFrogSidsToy],
          inkwell: windupFrogSidsToy.cost - 2,
          play: [heavyAttacker],
        },
        {
          play: [{ card: toyCharacter, exerted: true }],
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(heavyAttacker, toyCharacter),
      ).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(toyCharacter)).toBe("discard");

      expect(testEngine.asPlayerOne().canPlayCard(windupFrogSidsToy)).toBe(false);
    });
  });
});
