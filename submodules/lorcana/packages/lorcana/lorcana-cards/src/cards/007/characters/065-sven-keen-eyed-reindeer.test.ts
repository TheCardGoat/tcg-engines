import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { svenKeeneyedReindeer } from "./065-sven-keen-eyed-reindeer";

const opponentCharacter = createMockCharacter({
  id: "sven-test-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 5,
  willpower: 4,
});

const allyCharacter = createMockCharacter({
  id: "sven-test-ally",
  name: "Ally Character",
  cost: 2,
  strength: 3,
  willpower: 4,
});

describe("Sven - Keen-Eyed Reindeer", () => {
  describe("Rush", () => {
    it("has the Rush keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [svenKeeneyedReindeer],
        deck: 1,
      });

      expect(testEngine.asPlayerOne().hasKeyword(svenKeeneyedReindeer, "Rush")).toBe(true);
    });
  });

  describe("FORMIDABLE GLARE - When you play this character, chosen character gets -3 {S} this turn.", () => {
    it("gives chosen opposing character -3 strength this turn when Sven is played", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [svenKeeneyedReindeer],
          inkwell: svenKeeneyedReindeer.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(svenKeeneyedReindeer)).toBeSuccessfulCommand();

      // Triggered ability should create a bag entry
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(svenKeeneyedReindeer),
      ).toBeSuccessfulCommand();

      // Choose the opposing character to receive -3 strength
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // The opposing character should have -3 strength this turn
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(
        opponentCharacter.strength - 3,
      );
    });

    it("can target own characters as well as opponent characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [svenKeeneyedReindeer],
        inkwell: svenKeeneyedReindeer.cost,
        play: [allyCharacter],
        deck: 2,
      });

      expect(testEngine.asPlayerOne().playCard(svenKeeneyedReindeer)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(svenKeeneyedReindeer),
      ).toBeSuccessfulCommand();

      // Target own character
      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [allyCharacter] }),
      ).toBeSuccessfulCommand();

      // Own character should have -3 strength
      expect(testEngine.asPlayerOne().getCardStrength(allyCharacter)).toBe(
        allyCharacter.strength - 3,
      );
    });

    it("the -3 strength expires at the end of the turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [svenKeeneyedReindeer],
          inkwell: svenKeeneyedReindeer.cost,
          deck: 2,
        },
        {
          play: [opponentCharacter],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().playCard(svenKeeneyedReindeer)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(svenKeeneyedReindeer),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolveNextPending({ targets: [opponentCharacter] }),
      ).toBeSuccessfulCommand();

      // Verify -3 strength is applied
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(
        opponentCharacter.strength - 3,
      );

      // Pass player one's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // After the turn ends, the effect should expire
      expect(testEngine.asPlayerTwo().getCardStrength(opponentCharacter)).toBe(
        opponentCharacter.strength,
      );
    });
  });
});
