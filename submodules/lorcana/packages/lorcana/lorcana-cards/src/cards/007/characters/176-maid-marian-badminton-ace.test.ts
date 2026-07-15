import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { maidMarianBadmintonAce } from "./176-maid-marian-badminton-ace";
import { ladyKluckProtectiveConfidant } from "./172-lady-kluck-protective-confidant";

const opponentAttacker = createMockCharacter({
  id: "maid-marian-attacker",
  name: "Opponent Attacker",
  cost: 3,
  strength: 3,
  willpower: 5,
});

const nonAllyCharacter = createMockCharacter({
  id: "maid-marian-non-ally",
  name: "Non-Ally Character",
  cost: 2,
  strength: 2,
  willpower: 4,
  classifications: ["Dreamborn", "Hero"],
});

const opposingTarget = createMockCharacter({
  id: "maid-marian-opposing-target",
  name: "Opposing Target",
  cost: 2,
  strength: 2,
  willpower: 5,
});

describe("Maid Marian - Badminton Ace", () => {
  describe("GOOD SHOT - During an opponent's turn, whenever one of your Ally characters is damaged, deal 1 damage to chosen opposing character.", () => {
    it("triggers when an Ally character is damaged during opponent's turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [maidMarianBadmintonAce, { card: ladyKluckProtectiveConfidant, exerted: true }],
          deck: 2,
        },
        {
          play: [opponentAttacker, opposingTarget],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(opponentAttacker, ladyKluckProtectiveConfidant),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maidMarianBadmintonAce, {
          targets: [opposingTarget],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opposingTarget)).toBe(1);
    });

    it("adds expected damage from challenge plus GOOD SHOT damage", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [maidMarianBadmintonAce, { card: ladyKluckProtectiveConfidant, exerted: true }],
          deck: 2,
        },
        {
          play: [opponentAttacker, opposingTarget],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(opponentAttacker, ladyKluckProtectiveConfidant),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(1);
      expect(
        testEngine.asPlayerOne().resolvePendingByCard(maidMarianBadmintonAce, {
          targets: [opponentAttacker],
        }),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerTwo().getDamage(opponentAttacker)).toBe(
        ladyKluckProtectiveConfidant.strength + 1,
      );
    });

    it("does NOT trigger during your own turn", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [maidMarianBadmintonAce, opponentAttacker],
          deck: 2,
        },
        {
          play: [{ card: ladyKluckProtectiveConfidant, exerted: true }],
          deck: 2,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(opponentAttacker, ladyKluckProtectiveConfidant),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
    });

    it("does NOT trigger for non-Ally characters", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [maidMarianBadmintonAce, { card: nonAllyCharacter, exerted: true }],
          deck: 2,
        },
        {
          play: [opponentAttacker, opposingTarget],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(opponentAttacker, nonAllyCharacter),
      ).toBeSuccessfulCommand();

      expect(testEngine.asPlayerOne().getBagCount()).toBe(0);
      expect(testEngine.asPlayerTwo().getBagCount()).toBe(0);
    });
  });

  describe("FAIR PLAY - Your characters named Lady Kluck gain Resist +1.", () => {
    it("gives Resist +1 to Lady Kluck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [maidMarianBadmintonAce, ladyKluckProtectiveConfidant],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(ladyKluckProtectiveConfidant, "Resist")).toBe(
        true,
      );
      expect(testEngine.asPlayerOne().getKeywordValue(ladyKluckProtectiveConfidant, "Resist")).toBe(
        1,
      );
    });

    it("does not give Resist to characters not named Lady Kluck", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [maidMarianBadmintonAce, nonAllyCharacter],
          deck: 2,
        },
        {
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().hasKeyword(nonAllyCharacter, "Resist")).toBe(false);
    });

    it("reduces damage to Lady Kluck by 1", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [maidMarianBadmintonAce, { card: ladyKluckProtectiveConfidant, exerted: true }],
          deck: 2,
        },
        {
          play: [opponentAttacker],
          deck: 2,
        },
      );

      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      expect(
        testEngine.asPlayerTwo().challenge(opponentAttacker, ladyKluckProtectiveConfidant),
      ).toBeSuccessfulCommand();

      const expectedDamage = opponentAttacker.strength - 1;
      expect(testEngine.asPlayerOne().getDamage(ladyKluckProtectiveConfidant)).toBe(expectedDamage);
    });
  });
});
