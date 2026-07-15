import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { mulanImperialSoldier } from "./118-mulan-imperial-soldier";

const allyA = createMockCharacter({
  id: "mulan-test-ally-a",
  name: "Ally A",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
});

const allyB = createMockCharacter({
  id: "mulan-test-ally-b",
  name: "Ally B",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
});

const weakDefender = createMockCharacter({
  id: "mulan-test-weak-defender",
  name: "Weak Defender",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
});

const toughDefender = createMockCharacter({
  id: "mulan-test-tough-defender",
  name: "Tough Defender",
  cost: 3,
  strength: 1,
  willpower: 10,
  lore: 1,
});

const opponentCharacter = createMockCharacter({
  id: "mulan-test-opponent-char",
  name: "Opponent Character",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 2,
});

describe("Mulan - Imperial Soldier", () => {
  describe("LEAD BY EXAMPLE - During your turn, whenever this character banishes another character in a challenge, your other characters get +1 lore this turn.", () => {
    it("your other characters get +1 lore when Mulan banishes in challenge", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mulanImperialSoldier, allyA, allyB],
        },
        {
          play: [{ card: weakDefender, exerted: true }],
        },
      );

      // Verify base lore values before challenge
      expect(testEngine.asPlayerOne()).toHaveLore({ card: allyA, value: 1 });
      expect(testEngine.asPlayerOne()).toHaveLore({ card: allyB, value: 2 });

      // Mulan (4 strength) challenges weak defender (1 willpower) — banishes it
      expect(
        testEngine.asPlayerOne().challenge(mulanImperialSoldier, weakDefender),
      ).toBeSuccessfulCommand();

      // LEAD BY EXAMPLE triggers: other characters get +1 lore this turn
      expect(testEngine.asPlayerOne()).toHaveLore({ card: allyA, value: 2 });
      expect(testEngine.asPlayerOne()).toHaveLore({ card: allyB, value: 3 });
    });

    it("opponent's characters don't get the bonus", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mulanImperialSoldier],
        },
        {
          play: [{ card: weakDefender, exerted: true }, opponentCharacter],
        },
      );

      expect(testEngine.asPlayerTwo()).toHaveLore({
        card: opponentCharacter,
        value: 2,
      });

      expect(
        testEngine.asPlayerOne().challenge(mulanImperialSoldier, weakDefender),
      ).toBeSuccessfulCommand();

      // Opponent's character should NOT get the lore bonus
      expect(testEngine.asPlayerTwo()).toHaveLore({
        card: opponentCharacter,
        value: 2,
      });
    });

    it("Mulan herself doesn't get the bonus", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mulanImperialSoldier],
        },
        {
          play: [{ card: weakDefender, exerted: true }],
        },
      );

      // Mulan's base lore is 1
      expect(testEngine.asPlayerOne()).toHaveLore({
        card: mulanImperialSoldier,
        value: 1,
      });

      expect(
        testEngine.asPlayerOne().challenge(mulanImperialSoldier, weakDefender),
      ).toBeSuccessfulCommand();

      // Mulan should NOT get the lore bonus (excludeSelf via YOUR_OTHER_CHARACTERS)
      expect(testEngine.asPlayerOne()).toHaveLore({
        card: mulanImperialSoldier,
        value: 1,
      });
    });

    it("does not trigger when Mulan does not banish the defender", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [mulanImperialSoldier, allyA],
        },
        {
          play: [{ card: toughDefender, exerted: true }],
        },
      );

      expect(testEngine.asPlayerOne()).toHaveLore({ card: allyA, value: 1 });

      // Mulan (4 strength) challenges tough defender (10 willpower) — does NOT banish it
      expect(
        testEngine.asPlayerOne().challenge(mulanImperialSoldier, toughDefender),
      ).toBeSuccessfulCommand();

      // LEAD BY EXAMPLE should NOT trigger — no banish happened
      expect(testEngine.asPlayerOne()).toHaveLore({ card: allyA, value: 1 });
    });
  });
});
