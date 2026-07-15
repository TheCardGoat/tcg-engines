import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { brunoMadrigalOutOfTheShadows } from "./038-bruno-madrigal-out-of-the-shadows";

const chosenCharacter = createMockCharacter({
  id: "bruno-chosen-char",
  name: "Chosen Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

const opponentAttacker = createMockCharacter({
  id: "bruno-opp-attacker",
  name: "Opponent Attacker",
  cost: 3,
  strength: 5,
  willpower: 4,
  lore: 1,
});

describe("Bruno Madrigal - Out of the Shadows", () => {
  describe("IT WAS YOUR VISION - When you play this character, chosen character gains 'When this character is banished in a challenge, you may return this card to your hand' this turn.", () => {
    it("chosen character gains return-to-hand-when-banished ability on play", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: chosenCharacter, isDrying: false }],
          hand: [brunoMadrigalOutOfTheShadows],
          inkwell: brunoMadrigalOutOfTheShadows.cost,
          deck: 2,
        },
        {
          play: [{ card: opponentAttacker, exerted: false }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(brunoMadrigalOutOfTheShadows),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(brunoMadrigalOutOfTheShadows, {
          targets: [chosenCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasGrantedAbility(chosenCharacter, "return-to-hand-when-banished")).toBe(
        true,
      );
    });

    it("chosen character returns to hand when banished in a challenge this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: chosenCharacter, isDrying: false }],
          hand: [brunoMadrigalOutOfTheShadows],
          inkwell: brunoMadrigalOutOfTheShadows.cost,
          deck: 2,
        },
        {
          play: [{ card: opponentAttacker, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(brunoMadrigalOutOfTheShadows),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(brunoMadrigalOutOfTheShadows, {
          targets: [chosenCharacter],
        }),
      ).toBeSuccessfulCommand();

      // opponentAttacker: strength 5 vs chosenCharacter willpower 3 -> chosenCharacter banished
      expect(
        testEngine.asPlayerOne().challenge(chosenCharacter, opponentAttacker),
      ).toBeSuccessfulCommand();

      // chosenCharacter should return to hand instead of going to discard
      expect(testEngine.asPlayerOne().getCardZone(chosenCharacter)).toBe("hand");
    });

    it("return-to-hand ability expires after this turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: chosenCharacter, isDrying: false }],
          hand: [brunoMadrigalOutOfTheShadows],
          inkwell: brunoMadrigalOutOfTheShadows.cost,
          deck: 2,
        },
        {
          play: [{ card: opponentAttacker, exerted: false }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().playCard(brunoMadrigalOutOfTheShadows),
      ).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(brunoMadrigalOutOfTheShadows, {
          targets: [chosenCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.hasGrantedAbility(chosenCharacter, "return-to-hand-when-banished")).toBe(
        true,
      );

      testEngine.asPlayerOne().passTurn();
      testEngine.asPlayerTwo().passTurn();

      expect(testEngine.hasGrantedAbility(chosenCharacter, "return-to-hand-when-banished")).toBe(
        false,
      );
    });
  });
});
