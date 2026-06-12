import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { yzmaUnjustlyTreated } from "./184-yzma-unjustly-treated";

// Strong attacker that will banish the defender
const attacker = createMockCharacter({
  id: "yzma-unjustly-treated-attacker",
  name: "Test Attacker",
  cost: 3,
  strength: 5,
  willpower: 5,
});

// Weak defender that will be banished in the challenge
const defender = createMockCharacter({
  id: "yzma-unjustly-treated-defender",
  name: "Test Defender",
  cost: 1,
  strength: 1,
  willpower: 2,
});

// An extra character to be targeted by optional damage
const extraTarget = createMockCharacter({
  id: "yzma-unjustly-treated-extra-target",
  name: "Extra Target",
  cost: 2,
  strength: 2,
  willpower: 5,
});

describe("Yzma - Unjustly Treated", () => {
  describe("I'M WARNING YOU! - During your turn, whenever one of your characters banishes a character in a challenge, you may deal 1 damage to chosen character.", () => {
    it("triggers optional 1 damage when your character banishes an opponent in a challenge during your turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [yzmaUnjustlyTreated, attacker],
          deck: 2,
        },
        {
          play: [{ card: defender, exerted: true }, extraTarget],
          deck: 2,
        },
      );

      // Attacker challenges exerted defender — defender is banished (str 5 > wp 2)
      expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerTwo().getCardZone(defender)).toBe("discard");

      // I'M WARNING YOU! triggers as optional
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(yzmaUnjustlyTreated, {
          resolveOptional: true,
          targets: [extraTarget],
        }),
      ).toBeSuccessfulCommand();

      // extraTarget receives 1 damage
      expect(testEngine.asPlayerTwo().getDamage(extraTarget)).toBe(1);
    });

    it("can decline the optional — no damage is dealt", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [yzmaUnjustlyTreated, attacker],
          deck: 2,
        },
        {
          play: [{ card: defender, exerted: true }, extraTarget],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().challenge(attacker, defender)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Decline
      expect(
        testEngine
          .asPlayerOne()
          .resolvePendingByCard(yzmaUnjustlyTreated, { resolveOptional: false }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(extraTarget)).toBe(0);
    });

    it("does NOT trigger during the opponent's turn", () => {
      const strongOpponent = createMockCharacter({
        id: "yzma-unjustly-treated-strong-opp",
        name: "Strong Opponent",
        cost: 5,
        strength: 10,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [yzmaUnjustlyTreated, { card: attacker, exerted: true }],
          deck: 2,
        },
        {
          play: [strongOpponent],
          deck: 2,
        },
      );

      // Pass to opponent's turn
      testEngine.asPlayerOne().passTurn();

      // Opponent challenges and banishes attacker
      expect(testEngine.asPlayerTwo().challenge(strongOpponent, attacker)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(attacker)).toBe("discard");

      // I'M WARNING YOU! should NOT trigger during opponent's turn
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });

    it("does NOT trigger when an opponent's character banishes your character", () => {
      const strongOpponent = createMockCharacter({
        id: "yzma-unjustly-treated-opp-strong",
        name: "Strong Opponent",
        cost: 5,
        strength: 10,
        willpower: 5,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [yzmaUnjustlyTreated, { card: attacker, exerted: true }],
          deck: 2,
        },
        {
          play: [strongOpponent],
          deck: 2,
        },
      );

      // Pass to opponent's turn — opponent banishes attacker
      testEngine.asPlayerOne().passTurn();

      expect(testEngine.asPlayerTwo().challenge(strongOpponent, attacker)).toBeSuccessfulCommand();
      expect(testEngine.asPlayerOne().getCardZone(attacker)).toBe("discard");

      // Should NOT trigger (opponent's turn + opponent's character banished ours)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });
  });
});
