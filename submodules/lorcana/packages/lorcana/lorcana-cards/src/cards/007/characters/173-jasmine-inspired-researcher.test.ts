import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { jasmineInspiredResearcher } from "./173-jasmine-inspired-researcher";

const allyCharacterOne = createMockCharacter({
  id: "jasmine-test-ally-one",
  name: "Ally One",
  cost: 2,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Ally"],
});

const allyCharacterTwo = createMockCharacter({
  id: "jasmine-test-ally-two",
  name: "Ally Two",
  cost: 2,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Ally"],
});

const nonAllyCharacter = createMockCharacter({
  id: "jasmine-test-non-ally",
  name: "Non-Ally",
  cost: 2,
  strength: 2,
  willpower: 2,
  classifications: ["Storyborn", "Hero"],
});

describe("Jasmine - Inspired Researcher", () => {
  describe("EXTRA ASSISTANCE - Whenever this character quests, if you have no cards in your hand, draw a card for each Ally character you have in play.", () => {
    it("draws a card for each Ally in play when hand is empty", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: jasmineInspiredResearcher, isDrying: false },
            allyCharacterOne,
            allyCharacterTwo,
          ],
          deck: 10,
        },
        {
          play: [nonAllyCharacter],
        },
      );

      // Hand starts empty, two ally characters in play
      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(0);

      expect(testEngine.asPlayerOne().quest(jasmineInspiredResearcher)).toBeSuccessfulCommand();

      // Should draw 2 cards (one per Ally character in play)
      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(2);
    });

    it("draws 1 card for each Ally — only the Ally in play counts", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: jasmineInspiredResearcher, isDrying: false }, allyCharacterOne],
        deck: 10,
      });

      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(0);

      expect(testEngine.asPlayerOne().quest(jasmineInspiredResearcher)).toBeSuccessfulCommand();

      // Should draw 1 card (one Ally in play)
      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(1);
    });

    it("does not draw when hand is not empty", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: jasmineInspiredResearcher, isDrying: false }, allyCharacterOne],
        hand: [nonAllyCharacter],
        deck: 10,
      });

      // Hand starts with 1 card — condition (empty hand) not met
      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(1);

      expect(testEngine.asPlayerOne().quest(jasmineInspiredResearcher)).toBeSuccessfulCommand();

      // Hand count unchanged (no draw triggered)
      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(1);
    });

    it("does not draw for non-Ally characters in play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [{ card: jasmineInspiredResearcher, isDrying: false }, nonAllyCharacter],
        deck: 10,
      });

      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(0);

      expect(testEngine.asPlayerOne().quest(jasmineInspiredResearcher)).toBeSuccessfulCommand();

      // No Ally characters in play — draw nothing
      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(0);
    });

    it("does not count opponent's Ally characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: jasmineInspiredResearcher, isDrying: false }],
          deck: 10,
        },
        {
          play: [allyCharacterOne, allyCharacterTwo],
        },
      );

      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(0);

      expect(testEngine.asPlayerOne().quest(jasmineInspiredResearcher)).toBeSuccessfulCommand();

      // Opponent has 2 Allies but controller has none — draw nothing
      expect(testEngine.asPlayerOne().getCardsInZone("hand", "player_one").count).toBe(0);
    });
  });
});
