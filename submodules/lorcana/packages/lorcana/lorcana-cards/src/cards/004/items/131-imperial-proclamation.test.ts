import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { imperialProclamation } from "./131-imperial-proclamation";

const attacker = createMockCharacter({
  id: "imperial-proclamation-attacker",
  name: "Attacker",
  cost: 3,
  strength: 4,
  willpower: 4,
});

const defender = createMockCharacter({
  id: "imperial-proclamation-defender",
  name: "Defender",
  cost: 2,
  strength: 2,
  willpower: 3,
});

const cheapCharacter = createMockCharacter({
  id: "imperial-proclamation-cheap",
  name: "Cheap Character",
  cost: 3,
});

describe("Imperial Proclamation", () => {
  describe("CALL TO THE FRONT — Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.", () => {
    it("reduces cost of the next character played by 1 after a challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [cheapCharacter],
          inkwell: cheapCharacter.cost - 1,
          play: [imperialProclamation, { card: attacker, isDrying: false }],
        },
        {
          play: [{ card: defender, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().canPlayCard(cheapCharacter)).toBe(false);

      expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().canPlayCard(cheapCharacter)).toBe(true);
      expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();
    });

    it("does not reduce the cost of a second character played", () => {
      const secondCharacter = createMockCharacter({
        id: "imperial-proclamation-second",
        name: "Second Character",
        cost: 3,
      });

      // Inkwell = (cheapCharacter.cost - 1) + (secondCharacter.cost - 1)
      // After playing cheapCharacter with the 1-ink discount, remaining ink = secondCharacter.cost - 1,
      // which is one short of secondCharacter's full cost — so the second play is only affordable
      // if the discount incorrectly fires a second time.
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [cheapCharacter, secondCharacter],
          inkwell: cheapCharacter.cost - 1 + secondCharacter.cost - 1,
          play: [imperialProclamation, { card: attacker, isDrying: false }],
        },
        {
          play: [{ card: defender, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().playCard(cheapCharacter)).toBeSuccessfulCommand();

      // Discount is consumed — second character requires full ink (one more than we have)
      expect(testEngine.asPlayerOne().canPlayCard(secondCharacter)).toBe(false);
    });

    it("does not trigger on opponent's challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [cheapCharacter],
          inkwell: cheapCharacter.cost - 1,
          play: [imperialProclamation, { card: defender, exerted: true }],
        },
        {
          play: [{ card: attacker, isDrying: false }],
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().challenge(attacker, defender)).toBeSuccessfulCommand();

      // Trick - now it's P1's turn again
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // P1 has cheapCharacter.cost - 1 ink and cheapCharacter costs cheapCharacter.cost
      expect(testEngine.asPlayerOne().canPlayCard(cheapCharacter)).toBe(false);
    });
  });
});
