import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { minnieMouseDazzlingDancer } from "./126-minnie-mouse-dazzling-dancer";
import { mickeyMouseTrueFriend } from "../../001/characters/012-mickey-mouse-true-friend";

const opponent = createMockCharacter({
  id: "minnie-dazzling-dancer-opponent",
  name: "Opponent Character",
  cost: 2,
  strength: 1,
  willpower: 10,
  lore: 1,
});

describe("Minnie Mouse - Dazzling Dancer", () => {
  describe("DANCE-OFF - Whenever this character or one of your characters named Mickey Mouse challenges another character, gain 1 lore.", () => {
    it("gains 1 lore when Minnie challenges another character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: minnieMouseDazzlingDancer, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: opponent, exerted: true }],
          deck: 1,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().challenge(minnieMouseDazzlingDancer, opponent),
      ).toBeSuccessfulCommand();

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(minnieMouseDazzlingDancer),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });

    it("gains 1 lore when one of your Mickey Mouse characters challenges another character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [minnieMouseDazzlingDancer, { card: mickeyMouseTrueFriend, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: opponent, exerted: true }],
          deck: 1,
        },
      );

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerOne().challenge(mickeyMouseTrueFriend, opponent),
      ).toBeSuccessfulCommand();

      if (testEngine.asPlayerOne().getBagCount() > 0) {
        expect(
          testEngine.asPlayerOne().resolvePendingByCard(minnieMouseDazzlingDancer),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore + 1);
    });

    it("does not gain lore when an opponent's character challenges", () => {
      const anotherOpponent = createMockCharacter({
        id: "minnie-dazzling-dancer-another-opponent",
        name: "Another Opponent",
        cost: 2,
        strength: 1,
        willpower: 10,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: minnieMouseDazzlingDancer, exerted: true }],
          deck: 1,
        },
        {
          play: [{ card: anotherOpponent, isDrying: false }],
          deck: 1,
        },
      );

      // Pass turn so player two gets priority
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      const loreBefore = testEngine.getLore(PLAYER_ONE);

      expect(
        testEngine.asPlayerTwo().challenge(anotherOpponent, minnieMouseDazzlingDancer),
      ).toBeSuccessfulCommand();

      if (testEngine.asPlayerTwo().getBagCount() > 0) {
        expect(
          testEngine.asPlayerTwo().resolvePendingByCard(minnieMouseDazzlingDancer),
        ).toBeSuccessfulCommand();
      }

      expect(testEngine.getLore(PLAYER_ONE)).toBe(loreBefore);
    });
  });
});
