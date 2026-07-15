import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { simbaRightfulKing } from "./193-simba-rightful-king";

const weakDefender = createMockCharacter({
  id: "simba-rk-weak-defender",
  name: "Weak Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const targetCharacter = createMockCharacter({
  id: "simba-rk-target-character",
  name: "Target Character",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
});

const anotherOpponent = createMockCharacter({
  id: "simba-rk-another-opponent",
  name: "Another Opponent",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Simba - Rightful King", () => {
  describe("TRIUMPHANT STANCE - During your turn, whenever this character banishes another character in a challenge, chosen opposing character can't challenge during their next turn.", () => {
    it("triggers when Simba banishes an opposing character in a challenge and applies cant-challenge to chosen opposing character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: simbaRightfulKing, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: weakDefender, exerted: true }, targetCharacter],
          deck: 5,
        },
      );

      // Simba (strength 4) challenges weakDefender (willpower 1) — defender dies
      expect(
        testEngine.asPlayerOne().challenge(simbaRightfulKing, weakDefender),
      ).toBeSuccessfulCommand();

      // Weak defender should be banished
      expect(testEngine.asPlayerOne().getCardZone(weakDefender)).toBe("discard");

      // Triggered ability should be in the bag
      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      // Resolve ability by choosing target character as the restricted opponent
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(simbaRightfulKing, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);

      // Pass turn to player two
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Target character should have cant-challenge restriction during player two's turn
      expect(testEngine.hasRestriction(targetCharacter, "cant-challenge")).toBe(true);
    });

    it("does not trigger when Simba is not the attacker (i.e., when Simba is banished in a challenge)", () => {
      const strongAttacker = createMockCharacter({
        id: "simba-rk-strong-attacker",
        name: "Strong Attacker",
        cost: 5,
        strength: 10,
        willpower: 6,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: simbaRightfulKing, exerted: true }],
          deck: 5,
        },
        {
          play: [{ card: strongAttacker, isDrying: false }],
          deck: 5,
        },
      );

      // Pass player one's turn so player two can act
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent's strong attacker challenges Simba (willpower 6) — Simba dies with 10 strength
      expect(
        testEngine.asPlayerTwo().challenge(strongAttacker, simbaRightfulKing),
      ).toBeSuccessfulCommand();

      // Simba should be banished
      expect(testEngine.asPlayerOne().getCardZone(simbaRightfulKing)).toBe("discard");

      // No ability should trigger since Simba was the one banished (not the attacker)
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does not trigger when the defender survives the challenge", () => {
      const toughDefender = createMockCharacter({
        id: "simba-rk-tough-defender",
        name: "Tough Defender",
        cost: 4,
        strength: 3,
        willpower: 8,
        lore: 1,
      });

      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: simbaRightfulKing, isDrying: false }],
          deck: 5,
        },
        {
          play: [{ card: toughDefender, exerted: true }],
          deck: 5,
        },
      );

      // Simba (strength 4) challenges toughDefender (willpower 8) — defender survives
      expect(
        testEngine.asPlayerOne().challenge(simbaRightfulKing, toughDefender),
      ).toBeSuccessfulCommand();

      // Tough defender survives
      expect(testEngine.asPlayerOne().getCardZone(toughDefender)).toBe("play");

      // No ability should trigger (defender wasn't banished)
      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("restriction persists until the target's next turn and is cleared afterwards", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: simbaRightfulKing, isDrying: false }],
          deck: 5,
        },
        {
          play: [
            { card: weakDefender, exerted: true },
            { card: targetCharacter, isDrying: false },
          ],
          deck: 5,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(simbaRightfulKing, weakDefender),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

      expect(
        testEngine.asPlayerOne().resolvePendingByCard(simbaRightfulKing, {
          targets: [targetCharacter],
        }),
      ).toBeSuccessfulCommand();

      // Pass to player two's turn
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // targetCharacter has cant-challenge during player two's turn
      expect(testEngine.hasRestriction(targetCharacter, "cant-challenge")).toBe(true);

      // Pass back to player one's turn (completing player two's turn)
      expect(testEngine.asPlayerTwo().passTurn()).toBeSuccessfulCommand();

      // After player two's turn ends, restriction should be lifted
      expect(testEngine.hasRestriction(targetCharacter, "cant-challenge")).toBe(false);
    });
  });
});
