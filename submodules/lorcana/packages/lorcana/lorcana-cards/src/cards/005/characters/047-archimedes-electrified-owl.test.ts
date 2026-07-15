import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { archimedesElectrifiedOwl } from "./047-archimedes-electrified-owl";

// Archimedes - Electrified Owl: 5 cost, 1 strength, 4 willpower, 2 lore
// Keywords: Shift 3, Evasive, Challenger +3

const nonEvasiveDefender = createMockCharacter({
  id: "archimedes-test-non-evasive",
  name: "Non-Evasive Defender",
  cost: 2,
  strength: 2,
  willpower: 5,
});

const evasiveAttacker = createMockCharacter({
  id: "archimedes-test-evasive-attacker",
  name: "Evasive Attacker",
  cost: 3,
  strength: 3,
  willpower: 5,
  abilities: [
    {
      id: "evasive-test",
      keyword: "Evasive",
      type: "keyword",
      text: "Evasive",
    },
  ],
});

const fourWillpowerDefender = createMockCharacter({
  id: "archimedes-test-4wp-defender",
  name: "Four Willpower Defender",
  cost: 2,
  strength: 1,
  willpower: 4,
});

const fiveWillpowerDefender = createMockCharacter({
  id: "archimedes-test-5wp-defender",
  name: "Five Willpower Defender",
  cost: 3,
  strength: 1,
  willpower: 5,
});

describe("Archimedes - Electrified Owl", () => {
  describe("Keywords", () => {
    it("should have Shift, Evasive, and Challenger +3 keywords", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [archimedesElectrifiedOwl],
      });

      expect(testEngine.asPlayerOne().hasKeyword(archimedesElectrifiedOwl, "Evasive")).toBe(true);
      expect(testEngine.asPlayerOne().hasKeyword(archimedesElectrifiedOwl, "Challenger")).toBe(
        true,
      );
      expect(testEngine.getKeywordValue(archimedesElectrifiedOwl, "Challenger")).toBe(3);
    });
  });

  describe("Challenger +3", () => {
    it("deals 4 damage when challenging (1 base strength + 3 Challenger bonus)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [archimedesElectrifiedOwl],
          deck: 1,
        },
        {
          play: [{ card: fiveWillpowerDefender, exerted: true }],
          deck: 1,
        },
      );

      const preview = testEngine
        .asPlayerOne()
        .previewChallenge(archimedesElectrifiedOwl, fiveWillpowerDefender);

      // Base strength 1 + Challenger +3 = 4 damage dealt
      expect(preview?.attackerDamageDealt).toBe(4);
      // Defender has 5 willpower, so 4 damage is not lethal
      expect(preview?.defenderWouldBeBanished).toBe(false);
    });

    it("banishes a character with willpower equal to effective strength (4)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [archimedesElectrifiedOwl],
          deck: 1,
        },
        {
          play: [{ card: fourWillpowerDefender, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(archimedesElectrifiedOwl, fourWillpowerDefender),
      ).toBeSuccessfulCommand();

      // Defender should be banished (4 damage >= 4 willpower)
      expect(testEngine.asPlayerOne().getCardZone(fourWillpowerDefender)).toBe("discard");
    });

    it("does not get Challenger bonus when being challenged (defending)", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: archimedesElectrifiedOwl, exerted: true }],
          deck: 1,
        },
        {
          play: [evasiveAttacker],
          deck: 1,
        },
      );

      // Pass player one's turn so player two can act
      expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

      const preview = testEngine
        .asPlayerTwo()
        .previewChallenge(evasiveAttacker, archimedesElectrifiedOwl);

      // When Archimedes is defending, no Challenger bonus: deals only 1 damage (base strength)
      expect(preview?.defenderDamageDealt).toBe(1);
    });
  });

  describe("Evasive", () => {
    it("cannot be challenged by a character without Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: archimedesElectrifiedOwl, exerted: true }],
          deck: 1,
        },
        {
          play: [nonEvasiveDefender],
          deck: 1,
        },
      );

      // Pass player one's turn so player two can act
      expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

      // Non-evasive character should not be able to challenge Archimedes
      const result = testEngine
        .asPlayerTwo()
        .challenge(nonEvasiveDefender, archimedesElectrifiedOwl);
      expect(result.success).toBe(false);
    });

    it("can be challenged by a character with Evasive", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: archimedesElectrifiedOwl, exerted: true }],
          deck: 1,
        },
        {
          play: [evasiveAttacker],
          deck: 1,
        },
      );

      // Pass player one's turn so player two can act
      expect(testEngine.asPlayerOne().passTurn().success).toBe(true);

      // Evasive character should be able to challenge Archimedes
      expect(
        testEngine.asPlayerTwo().challenge(evasiveAttacker, archimedesElectrifiedOwl),
      ).toBeSuccessfulCommand();
    });
  });
});
