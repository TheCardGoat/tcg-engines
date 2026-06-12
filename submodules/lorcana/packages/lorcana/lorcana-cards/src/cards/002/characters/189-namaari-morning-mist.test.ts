import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter } from "@tcg/lorcana-engine/testing";
import { namaariMorningMist } from "./189-namaari-morning-mist";

const opponentCharacter = createMockCharacter({
  id: "namaari-test-opponent",
  name: "Opponent Character",
  cost: 3,
  strength: 3,
  willpower: 5,
  lore: 1,
});

const allyCharacter = createMockCharacter({
  id: "namaari-test-ally",
  name: "Ally Character",
  cost: 2,
  strength: 2,
  willpower: 3,
  lore: 1,
});

describe("Namaari - Morning Mist", () => {
  describe("Bodyguard", () => {
    it("has the Bodyguard keyword", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture({
        play: [namaariMorningMist],
      });

      expect(testEngine.asPlayerOne()).toHaveKeyword({
        card: namaariMorningMist,
        keyword: "Bodyguard",
      });
    });

    it("opponents must challenge a Bodyguard character if able", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [
            { card: namaariMorningMist, exerted: true },
            { card: allyCharacter, exerted: true },
          ],
          deck: 1,
        },
        {
          play: [{ card: opponentCharacter, isDrying: false }],
          deck: 1,
        },
      );

      // Pass turn so player two has priority
      expect(testEngine.asPlayerOne().passTurn()).toBeSuccessfulCommand();

      // Opponent should not be able to challenge ally when bodyguard is available
      expect(
        testEngine.asPlayerTwo().challenge(opponentCharacter, allyCharacter),
      ).not.toBeSuccessfulCommand();

      // Opponent should be able to challenge the bodyguard
      expect(
        testEngine.asPlayerTwo().challenge(opponentCharacter, namaariMorningMist),
      ).toBeSuccessfulCommand();
    });
  });

  describe("BLADES - This character can challenge ready characters.", () => {
    it("can challenge a ready (non-exerted) opponent character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: namaariMorningMist, isDrying: false }],
          deck: 1,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      // opponentCharacter is ready (not exerted), but Namaari should still be able to challenge
      expect(
        testEngine.asPlayerOne().challenge(namaariMorningMist, opponentCharacter),
      ).toBeSuccessfulCommand();
    });

    it("deals and receives correct damage when challenging a ready character", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: namaariMorningMist, isDrying: false }],
          deck: 1,
        },
        {
          play: [opponentCharacter],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(namaariMorningMist, opponentCharacter),
      ).toBeSuccessfulCommand();

      // Namaari (strength 2) should deal 2 damage to opponent
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: opponentCharacter,
        value: namaariMorningMist.strength,
      });
      // Opponent (strength 3) should deal 3 damage to Namaari
      expect(testEngine.asPlayerOne()).toHaveDamage({
        card: namaariMorningMist,
        value: opponentCharacter.strength,
      });
    });

    it("can also challenge exerted characters normally", () => {
      const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          play: [{ card: namaariMorningMist, isDrying: false }],
          deck: 1,
        },
        {
          play: [{ card: opponentCharacter, exerted: true }],
          deck: 1,
        },
      );

      expect(
        testEngine.asPlayerOne().challenge(namaariMorningMist, opponentCharacter),
      ).toBeSuccessfulCommand();
    });
  });
});
